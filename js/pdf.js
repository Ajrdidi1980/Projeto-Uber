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

function adicionarCabecalho(doc) {
  // Fundo verde
  doc.setFillColor(22, 163, 74);
  doc.rect(0, 0, 210, 28, "F");

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
  doc.setDrawColor(180);

  doc.line(20, 285, 190, 285);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  doc.text(
    "Gerado automaticamente pelo Controle Financeiro Motoristas",
    105,
    292,
    { align: "center" },
  );
}
function carregarImagem(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve(img);

    img.onerror = reject;

    img.src = src;
  });
}

async function gerarRelatorioPDF() {
  console.log(window.jspdf);
  console.log(window.jspdf?.jsPDF);

  const { jsPDF } = window.jspdf;

  const doc = new jsPDF();

  adicionarCabecalho(doc);

  const logo = await carregarImagem("img/logo.png");

  doc.addImage(logo, "PNG", 10, 5, 18, 18);

  adicionarTitulo(doc, "Relatório Financeiro");

  doc.setFont("helvetica", "bold");
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
  console.log("Receitas:", totalReceitas);
  console.log("Gastos:", totalGastos);
  console.log("Saldo:", saldo);

  doc.text(`Receitas: R$ ${moeda(totalReceitas)}`, 25, 110);

  doc.text(`Gastos: R$ ${moeda(totalGastos)}`, 25, 120);

  doc.text(`Saldo: R$ ${moeda(saldo)}`, 25, 130);

  adicionarRodape(doc);

  doc.save("relatorio.pdf");
}

window.gerarRelatorioPDF = gerarRelatorioPDF;
