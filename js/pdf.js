// ==========================================
// PDF.JS
// Responsável pela geração de relatórios
// ==========================================

function adicionarCabecalho(doc, logo) {
  // Fundo verde
  doc.setFillColor(22, 163, 74);
  doc.rect(0, 0, 210, 28, "F");
  if (logo) {
    doc.addImage(logo, "PNG", 10, 5, 18, 18);
  }

  // Texto
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);

  doc.text("CONTROLE FINANCEIRO MOTORISTAS", 105, 18, {
    align: "center",
  });
}
let periodoSelecionado = "tudo";

function adicionarTitulo(doc, titulo) {
  doc.setTextColor(0, 0, 0);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);

  doc.text(titulo, 20, 45);

  doc.setDrawColor(22, 163, 74);
  doc.setLineWidth(0.6);
  doc.line(20, 49, 190, 49);
}
function selecionarPeriodo(btn, periodo) {
  document
    .querySelectorAll("#relatorios .selector-btn")
    .forEach((b) => b.classList.remove("ativo"));

  btn.classList.add("ativo");

  periodoSelecionado = periodo;
}

function adicionarRodape(doc) {
  const paginaAtual = doc.getCurrentPageInfo().pageNumber;
  const totalPaginas = doc.getNumberOfPages();

  const agora = new Date();

  const dataHora = agora.toLocaleString("pt-BR");

  doc.setDrawColor(180);
  doc.line(20, 285, 190, 285);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  doc.text("Controle Financeiro Motoristas", 20, 290);

  doc.text(`Gerado em: ${dataHora}`, 105, 290, {
    align: "center",
  });

  doc.text(`Página ${paginaAtual} de ${totalPaginas}`, 190, 290, {
    align: "right",
  });
}
function carregarImagem(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve(img);

    img.onerror = reject;

    img.src = src;
  });
}

function adicionarTabelaCorridas(doc, y, receitas, logo) {
  const linhas = receitas.map((r) => [
    r.data,
    r.descricao,
    " " + formatarMoeda(r.valor),
    (r.kmRodado || 0).toFixed(1),
    " " + formatarMoeda(r.lucroLiquido || r.valor),
  ]);

  doc.autoTable({
    startY: 190,
    margin: {
      top: 35,
    },

    head: [["Data", "Plataforma", "Valor", "KM", "Lucro"]],

    body: linhas,

    theme: "grid",

    showHead: "everyPage",

    headStyles: {
      fillColor: [22, 163, 74],
      textColor: 255,
      fontStyle: "bold",
    },

    styles: {
      fontSize: 10,
    },

    columnStyles: {
      0: { cellWidth: 28 },
      1: { cellWidth: 60 },
      2: { halign: "right" },
      3: { halign: "center" },
      4: { halign: "right" },
    },
    didDrawPage: function (data) {
      adicionarCabecalho(doc, logo);
      adicionarRodape(doc);
    },
  });

  return doc.lastAutoTable.finalY;
}

async function gerarRelatorioPDF() {
  const { jsPDF } = window.jspdf;

  const doc = new jsPDF();

  const logo = await carregarImagem("img/logo.png");

  adicionarCabecalho(doc, logo);

  adicionarTitulo(doc, "Relatório Financeiro");
  let y = 170;

  doc.setFontSize(12);

  // ===== DADOS DO SISTEMA =====

  const meta = Number(localStorage.getItem("metaDiaria") || 0);

  const dataAtual = new Date().toLocaleDateString("pt-BR");

  // ===== INFORMAÇÕES =====
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);

  doc.text("Data:", 20, 65);

  doc.setFont("helvetica", "normal");
  doc.text(dataAtual, 55, 65);

  doc.setFont("helvetica", "bold");
  doc.text("Meta diária:", 20, 75);

  doc.setFont("helvetica", "normal");
  doc.text(formatarMoeda(meta), 55, 75);
  doc.setFont("helvetica", "bold");
  doc.text("Período:", 20, 85);

  doc.setFont("helvetica", "normal");
  doc.text(obterTextoPeriodo(periodoSelecionado), 55, 85);
  // ===== RESUMO FINANCEIRO =====
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);

  doc.text("Resumo Financeiro", 20, 105);

  doc.setFontSize(12);

  doc.setFont("helvetica", "normal");

  const receitasFiltradas = filtrarReceitas(receitas, periodoSelecionado);
  const totalReceitas = receitasFiltradas.reduce(
    (total, receita) => total + Number(receita.valor || 0),
    0,
  );

  const totalCombustivel = receitasFiltradas.reduce(
    (total, receita) => total + Number(receita.gastoCombustivel || 0),
    0,
  );
  const gastosFiltrados = filtrarGastos(gastos, periodoSelecionado);

  const totalGastos = gastosFiltrados.reduce(
    (total, gasto) => total + Number(gasto.valor || 0),
    0,
  );

  const saldo = totalReceitas - totalGastos - totalCombustivel;

  const quantidadeDiasTrabalhados = receitasFiltradas.length;

  const kmRodados = calcularKmRodados(receitasFiltradas);

  const dias = Math.max(new Set(receitasFiltradas.map((r) => r.data)).size, 1);

  const mediaDiaria = totalReceitas / dias;

  doc.text(`Receitas:  ${formatarMoeda(totalReceitas)}`, 25, 120);

  doc.text(`Combustível:  ${formatarMoeda(totalCombustivel)}`, 25, 130);

  doc.text(`Outros gastos:  ${formatarMoeda(totalGastos)}`, 25, 140);

  doc.text(`Saldo líquido:  ${formatarMoeda(saldo)}`, 25, 150);

  doc.text(`Média diária: ${formatarMoeda(mediaDiaria)}`, 25, 160);

  doc.text(`Dias Trabalhados: ${quantidadeDiasTrabalhados}`, 25, 170);

  doc.text(
    `KM Rodados: ${kmRodados.toLocaleString("pt-BR", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })} km`,
    25,
    180,
  );

  y = adicionarTabelaCorridas(doc, y, receitasFiltradas, logo);

  const totalPaginas = doc.getNumberOfPages();

  for (let i = 1; i <= totalPaginas; i++) {
    doc.setPage(i);
    adicionarRodape(doc);
  }

  doc.save("relatorio.pdf");
}

window.gerarRelatorioPDF = gerarRelatorioPDF;
