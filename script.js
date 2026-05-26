// ===== DADOS =====
let receitas = JSON.parse(localStorage.getItem("receitas")) || [];
let gastos = JSON.parse(localStorage.getItem("gastos")) || [];
let percentual = parseFloat(localStorage.getItem("percentual")) || 0;
let metaDiaria = parseFloat(localStorage.getItem("metaDiaria")) || 300;

let editandoReceita = null;
let editandoGasto = null;
let grafico = null;
let graficoPizza = null;
let filtroTexto = "";
let dataInicio = "";
let dataFim = "";
let modoGrafico = "mes";

// ===== ATUALIZAR TELA =====
function atualizar() {
  let totalR = 0;
  let totalG = 0;
  let totalKm = 0;
  let totalCombustivel = 0;
  let totalGanhoHora = 0;
  let qtdHoras = 0;

  const listaR = document.getElementById("lista-receitas");
  const listaG = document.getElementById("lista-gastos");

  listaR.innerHTML = "";
  listaG.innerHTML = "";

  // 🔥 AGRUPAR GANHOS POR DIA
  const ganhosPorDia = {};
  let ganhosSemanaAtual = 0;
  let ganhosSemanaPassada = 0;

  // ===== RECEITAS =====
  let ganhosManha = 0;
  let ganhosTarde = 0;
  let ganhosNoite = 0;
  const ganhosSemana = {
    Domingo: 0,
    Segunda: 0,
    Terça: 0,
    Quarta: 0,
    Quinta: 0,
    Sexta: 0,
    Sábado: 0,
  };

  let maiorGanho = 0;
  const receitasFiltradas = [];
  receitas.forEach((r, i) => {
    if (!r.data) return;
    const hoje = new Date();

    const partesData = r.data.split("/");

    const dataCorrida = new Date(
      partesData[2],
      partesData[1] - 1,
      partesData[0],
    );

    const diffTempo = hoje - dataCorrida;

    const diffDias = diffTempo / (1000 * 60 * 60 * 24);

    // ===== SEMANA ATUAL =====

    if (diffDias <= 7) {
      ganhosSemanaAtual += r.valor;
    }

    // ===== SEMANA PASSADA =====
    else if (diffDias <= 14) {
      ganhosSemanaPassada += r.valor;
    }
    // ===== DIA DA SEMANA =====

    const partesSemana = r.data.split("/");

    const dataSemana = new Date(
      partesSemana[2],
      partesSemana[1] - 1,
      partesSemana[0],
    );

    const dias = [
      "Domingo",
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
    ];

    const nomeDia = dias[dataSemana.getDay()];

    ganhosSemana[nomeDia] += r.valor;

    // ===== MAIOR GANHO =====

    if (r.valor > maiorGanho) {
      maiorGanho = r.valor;
    }

    // filtro texto
    if (filtroTexto && !r.descricao.toLowerCase().includes(filtroTexto)) return;

    // converter data
    const partes = r.data.split("/");
    const dataFormatada = `${partes[2]}-${partes[1]}-${partes[0]}`;

    // filtro período
    if (dataInicio && dataFormatada < dataInicio) return;
    if (dataFim && dataFormatada > dataFim) return;

    // 🔥 ACUMULADORES
    totalR += r.lucroLiquido || r.valor;
    if (r.horaInicio) {
      const hora = Number(r.horaInicio.split(":")[0]);

      if (hora >= 5 && hora < 12) {
        ganhosManha += r.valor;
      } else if (hora >= 12 && hora < 18) {
        ganhosTarde += r.valor;
      } else {
        ganhosNoite += r.valor;
      }
    }
    totalKm += r.kmRodado || 0;
    totalCombustivel += r.gastoCombustivel || 0;
    if (r.ganhoPorHora) {
      totalGanhoHora += r.ganhoPorHora;
      qtdHoras++;
    }
    // 🔥 AGRUPAMENTO POR DIA
    agruparGanhosPorPeriodo({
      modoGrafico,
      ganhosPorDia,
      receita: r,
    });
    receitasFiltradas.push(r);
  });
  renderizarTabelaReceitas(receitasFiltradas, listaR);
  const gastosFiltrados = [];

  // ===== GASTOS =====
  gastos.forEach((g, i) => {
    if (!g.data) return;

    const partes = g.data.split("/");
    const dataFormatada = `${partes[2]}-${partes[1]}-${partes[0]}`;

    if (dataInicio && dataFormatada < dataInicio) return;
    if (dataFim && dataFormatada > dataFim) return;

    totalG += g.valor;

    gastosFiltrados.push(g);
  });
  renderizarTabelaGastos(gastosFiltrados, listaG);

  // ===== CÁLCULOS =====
  const valores = Object.values(ganhosPorDia);

  const { melhorDia, mediaDia } = calcularDesempenhoDiario({
    valores,
    totalR,
  });
  // ===== MELHOR DIA =====
  const melhorDiaSemana = calcularMelhorDiaSemana(ganhosSemana);
  const melhorPeriodo = calcularMelhorPeriodo({
    ganhosManha,
    ganhosTarde,
    ganhosNoite,
  });

  const { custoPorKm, ganhoPorKm, mediaHora } = calcularMetricas({
    totalKm,
    totalCombustivel,
    totalR,
    totalGanhoHora,
    qtdHoras,
  });
  // ===== RESUMO =====
  const { reserva, saldo } = calcularResumoFinanceiro({
    totalR,
    totalG,
    percentual,
  });
  let metaDiaria = Number(localStorage.getItem("metaDiaria")) || 300;

  const faltamMeta = calcularFaltamMeta(totalR, metaDiaria);
  console.log("META:", metaDiaria);
  console.log("TOTALR:", totalR);
  console.log("FALTAM:", faltamMeta);
  const textoMeta = calcularTextoMeta({
    totalR,
    metaDiaria,
    faltamMeta,
  });

  atualizarCardsDashboard({
    totalR,
    totalG,
    reserva,
    saldo,
    melhorDia,
    mediaDia,
    custoPorKm,
    ganhoPorKm,
    mediaHora,
    metaDiaria,
    textoMeta,
    melhorPeriodo,
    melhorDiaSemana,
    maiorGanho,
  });
  atualizarBarraMeta(totalR, metaDiaria);

  atualizarComparativoSemanal(receitas);

  atualizarGrafico(ganhosPorDia);
  atualizarGraficoPizza(totalR, totalG, reserva);
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./sw.js")
    .then(() => console.log("PWA ativo"))
    .catch((err) => console.log(err));
}

// ===== INICIAR =====
document.addEventListener("DOMContentLoaded", async function () {
  trocarTela("receitas", document.querySelector(".sidebar button"));

  await iniciarSistema();
});
async function exportarPDF() {
  const { jsPDF } = window.jspdf;

  const doc = new jsPDF();

  // ===== DADOS =====
  const receitas = document.getElementById("total-receitas").textContent;

  const gastos = document.getElementById("total-gastos").textContent;

  const saldo = document.getElementById("saldo").textContent;

  const meta = document.getElementById("meta-diaria").textContent;

  const data = new Date().toLocaleDateString("pt-BR");

  // ===== TITULO =====
  doc.setFontSize(18);

  doc.text("Relatório Financeiro", 20, 20);

  // ===== DATA =====
  doc.setFontSize(11);

  doc.text(`Data: ${data}`, 20, 30);

  // ===== RESUMO =====
  doc.setFontSize(14);

  doc.text("Resumo Financeiro", 20, 45);

  doc.setFontSize(12);

  doc.text(`Receitas: R$ ${receitas}`, 20, 60);
  doc.text(`Gastos: R$ ${gastos}`, 20, 70);
  doc.text(`Saldo: R$ ${saldo}`, 20, 80);
  doc.text(`Meta diária: R$ ${meta}`, 20, 90);

  // ===== CORRIDAS =====
  let y = 110;

  doc.setFontSize(14);

  doc.text("Corridas", 20, y);

  y += 10;

  receitasArray = JSON.parse(localStorage.getItem("receitas")) || [];

  doc.setFontSize(11);

  receitasArray.forEach((r) => {
    doc.text(`${r.data} | ${r.descricao} | R$ ${r.valor.toFixed(2)}`, 20, y);

    y += 8;
  });

  // ===== SALVAR =====
  doc.save("relatorio-financeiro.pdf");
}
// ===== EXPORTAR BACKUP =====
function exportarBackup() {
  const dados = {
    receitas,
    gastos,
    metaDiaria,
  };

  const json = JSON.stringify(dados, null, 2);

  const blob = new Blob([json], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;
  a.download = "backup-financeiro.json";

  a.click();

  URL.revokeObjectURL(url);
}

// ===== IMPORTAR BACKUP =====
function importarBackup(event) {
  const arquivo = event.target.files[0];

  if (!arquivo) return;

  const leitor = new FileReader();

  leitor.onload = function (e) {
    const dados = JSON.parse(e.target.result);

    receitas = dados.receitas || [];
    gastos = dados.gastos || [];
    metaDiaria = dados.metaDiaria || 0;

    localStorage.setItem("receitas", JSON.stringify(receitas));

    localStorage.setItem("gastos", JSON.stringify(gastos));

    localStorage.setItem("metaDiaria", metaDiaria);

    atualizar();

    mostrarToast("✅ Backup restaurado!");
  };

  leitor.readAsText(arquivo);
}
function mostrarToast(mensagem) {
  const toast = document.getElementById("toast");

  toast.textContent = mensagem;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}
// ===== TROCAR TEMA =====
function trocarTema() {
  document.body.classList.toggle("light");

  if (document.body.classList.contains("light")) {
    localStorage.setItem("tema", "light");
  } else {
    localStorage.setItem("tema", "dark");
  }
}

// ===== CARREGAR TEMA =====
const temaSalvo = localStorage.getItem("tema");

if (temaSalvo === "light") {
  document.body.classList.add("light");
}

async function iniciarSistema() {
  window.escutarReceitasFirebase((receitasFirebase) => {
    receitas = receitasFirebase;

    atualizar();
  });

  window.escutarGastosFirebase((gastosFirebase) => {
    gastos = gastosFirebase;

    atualizar();
  });
}
