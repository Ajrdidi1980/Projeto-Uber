// ==========================================
// PDF.JS
// Responsável pela geração de relatórios
// ==========================================
function moeda(valor) {
  return parseFloat(valor).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

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

function adicionarTitulo(doc, titulo) {
  doc.setTextColor(0, 0, 0);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);

  doc.text(titulo, 20, 45);

  doc.setDrawColor(22, 163, 74);
  doc.setLineWidth(0.6);
  doc.line(20, 49, 190, 49);
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
function adicionarTabelaCorridasAntiga(doc, y, receitas) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);

  doc.text("Corridas", 20, y);

  y += 10;

  doc.setFillColor(230, 230, 230);
  doc.rect(20, y - 6, 170, 8, "F");

  doc.setFontSize(10);

  doc.text("Data", 22, y);
  doc.text("Plataforma", 55, y);
  doc.text("Valor", 120, y);
  doc.text("KM", 150, y);
  doc.text("Lucro", 170, y);

  doc.setFont("helvetica", "normal");
  y += 8;

  receitas.forEach((r) => {
    doc.text(r.data, 22, y);

    doc.text(r.descricao, 55, y);

    doc.text("R$ " + moeda(r.valor), 120, y);

    doc.text((r.kmRodado || 0).toFixed(1), 150, y);

    doc.text("R$ " + moeda(r.lucroLiquido || r.valor), 170, y);
    y += 8;
  });

  return y;
}
function adicionarTabelaCorridas(doc, y, receitas, logo) {
  const linhas = receitas.map((r) => [
    r.data,
    r.descricao,
    "R$ " + moeda(r.valor),
    (r.kmRodado || 0).toFixed(1),
    "R$ " + moeda(r.lucroLiquido || r.valor),
  ]);

  doc.autoTable({
    startY: y,

    head: [["Data", "Plataforma", "Valor", "KM", "Lucro"]],

    body: linhas,

    theme: "grid",

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
  let y = 140;

  doc.setFontSize(12);

  // ===== DADOS DO SISTEMA =====
  const totalReceitas =
    document.getElementById("total-receitas")?.textContent || "0,00";

  const totalGastos =
    document.getElementById("total-gastos")?.textContent || "0,00";

  const saldo = document.getElementById("saldo")?.textContent || "0,00";

  const meta = document.getElementById("meta-diaria")?.textContent || "0,00";

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
  doc.text(`R$ ${moeda(meta)}`, 55, 75);
  // ===== RESUMO FINANCEIRO =====
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);

  doc.text("Resumo Financeiro", 20, 95);

  doc.setFontSize(12);

  doc.setFont("helvetica", "normal");

  doc.text(`Receitas: R$ ${moeda(totalReceitas)}`, 25, 110);

  doc.text(`Gastos: R$ ${moeda(totalGastos)}`, 25, 120);

  doc.text(`Saldo: R$ ${moeda(saldo)}`, 25, 130);

  y = adicionarTabelaCorridas(doc, y, receitas, logo);

  const totalPaginas = doc.getNumberOfPages();

  for (let i = 1; i <= totalPaginas; i++) {
    doc.setPage(i);
    adicionarRodape(doc);
  }

  doc.save("relatorio.pdf");
}

window.gerarRelatorioPDF = gerarRelatorioPDF;
