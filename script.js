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

// ===== SALVAR =====
function salvar() {
  localStorage.setItem("receitas", JSON.stringify(receitas));
  localStorage.setItem("gastos", JSON.stringify(gastos));
  localStorage.setItem("percentual", percentual);
  localStorage.setItem("metaDiaria", metaDiaria);
}

// ===== DATA =====
function hoje() {
  const d = new Date();

  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const ano = d.getFullYear();

  return `${dia}/${mes}/${ano}`;
}
function formatarData(dataISO) {
  const partes = dataISO.split("-");

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// ===== TROCAR TELA =====
function trocarTela(id, el) {
  // esconder telas
  document.querySelectorAll(".tela").forEach((t) => (t.style.display = "none"));

  // mostrar tela selecionada
  document.getElementById(id).style.display = "block";

  // remover ativo
  document
    .querySelectorAll(".sidebar button")
    .forEach((b) => b.classList.remove("ativo"));

  // adiciona ativo
  document.getElementById("btn-" + id).classList.add("ativo");

  if (el) {
    el.classList.add("ativo");
  }
  // atualizar resumo
  if (id === "resumo") {
    atualizar();
  }
}

// ===== FILTRO =====
function filtrarReceitas() {
  filtroTexto = document.getElementById("filtro-receitas").value.toLowerCase();

  atualizar();
}
function filtrarPorData() {
  dataInicio = document.getElementById("data-inicio").value;
  dataFim = document.getElementById("data-fim").value;

  atualizar();
}

// ===== ADICIONAR / EDITAR RECEITA =====
async function addReceita() {
  const desc = document.getElementById("desc-receita").value;
  const valor = parseFloat(document.getElementById("valor-receita").value) || 0;
  const dataReceita = document.getElementById("data-receita").value;
  const horaInicio = document.getElementById("hora-inicio").value;
  const horaFim = document.getElementById("hora-fim").value;
  const kmInicial =
    parseFloat(document.getElementById("km-inicial").value) || 0;
  const kmFinal = parseFloat(document.getElementById("km-final").value) || 0;
  const consumo = parseFloat(document.getElementById("consumo").value) || 0;
  const combustivel =
    parseFloat(document.getElementById("combustivel").value) || 0;

  const kmRodado = kmFinal - kmInicial;
  let ganhoPorHora = 0;

  if (horaInicio && horaFim) {
    const inicio = new Date(`2000-01-01T${horaInicio}`);
    const fim = new Date(`2000-01-01T${horaFim}`);

    const horas = (fim - inicio) / 1000 / 60 / 60;

    if (horas > 0) {
      ganhoPorHora = valor / horas;
    }
  }

  let gastoCombustivel = 0;

  if (consumo > 0 && combustivel > 0 && kmRodado > 0) {
    gastoCombustivel = (kmRodado / consumo) * combustivel;
  }
  const lucroLiquido = valor - gastoCombustivel;

  if (!desc || isNaN(valor)) return alert("Preencha tudo");

  if (editandoReceita !== null) {
    receitas[editandoReceita] = {
      descricao: desc,
      valor: valor,
      data: dataReceita ? formatarData(dataReceita) : hoje(),
      kmRodado,
      gastoCombustivel,
      lucroLiquido,
    };
    editandoReceita = null;
  } else {
    const novaReceita = {
      descricao: desc,
      valor: valor,
      data: dataReceita ? formatarData(dataReceita) : hoje(),

      horaInicio,
      horaFim,

      kmInicial,
      kmFinal,

      consumo,
      combustivel,

      kmRodado,
      gastoCombustivel,
      lucroLiquido,
      ganhoPorHora,
    };

    receitas.push(novaReceita);

    await salvarReceitaFirebase(novaReceita);
  }

  salvar();
  atualizar();

  // limpa campos
  document.getElementById("desc-receita").value = "";
  document.getElementById("valor-receita").value = "";
  document.getElementById("desc-gasto").value = "";
  document.getElementById("valor-gasto").value = "";
  document.getElementById("data-receita").value = "";
  document.getElementById("hora-inicio").value = "";
  document.getElementById("hora-fim").value = "";
  document.getElementById("km-inicial").value = "";
  document.getElementById("km-final").value = "";
  document.getElementById("consumo").value = "";
  document.getElementById("combustivel").value = "";
  document.getElementById("tipo-gasto").value = "outros";
  document.getElementById("btn-gasto").textContent = "Adicionar";
}

// ===== ADICIONAR / EDITAR GASTO =====
function addGasto() {
  const desc = document.getElementById("desc-gasto").value;
  const valor = parseFloat(document.getElementById("valor-gasto").value) || 0;
  const tipo = document.getElementById("tipo-gasto").value;

  if (!desc || isNaN(valor)) return alert("Preencha tudo");

  if (editandoGasto !== null) {
    gastos[editandoGasto] = {
      descricao: desc,
      valor: valor,
      tipo: tipo || "outros",
      data: hoje(),
    };
    editandoGasto = null;
  } else {
    gastos.push({
      descricao: desc,
      valor: valor,
      tipo: tipo || "outros",
      data: hoje(),
    });
  }

  salvar();
  atualizar();
}
function limparFiltros() {
  filtroTexto = "";
  dataInicio = "";
  dataFim = "";

  document.getElementById("filtro-receitas").value = "";
  if (document.getElementById("data-inicio"))
    document.getElementById("data-inicio").value = "";
  if (document.getElementById("data-fim"))
    document.getElementById("data-fim").value = "";

  atualizar();
}

// ===== EDITAR =====
function editarReceita(i) {
  const r = receitas[i];

  document.getElementById("desc-receita").value = r.descricao;
  document.getElementById("valor-receita").value = r.valor;

  editandoReceita = i;
}

function editarGasto(i) {
  const g = gastos[i];

  document.getElementById("desc-gasto").value = g.descricao;
  document.getElementById("valor-gasto").value = g.valor;
  document.getElementById("tipo-gasto").value = g.tipo;
  document.getElementById("btn-gasto").textContent = "Salvar";

  editandoGasto = i;
}
// ===== EXCLUIR =====
async function excluirReceita(i) {
  const receita = receitas[i];

  if (receita.id) {
    await excluirReceitaFirebase(receita.id);
  }

  receitas.splice(i, 1);

  salvar();

  atualizar();
}

function excluirGasto(i) {
  gastos.splice(i, 1);
  salvar();
  atualizar();
}

// ===== RESERVA =====
function salvarPercentual() {
  percentual = parseFloat(document.getElementById("percentual").value) || 0;

  salvar();
  atualizar();
}
function salvarMeta() {
  const valor = document.getElementById("meta-input").value;

  metaDiaria = Number(valor);

  localStorage.setItem("metaDiaria", metaDiaria);

  atualizar();
}

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
    if (modoGrafico === "dia") {
      if (!ganhosPorDia[r.data]) {
        ganhosPorDia[r.data] = 0;
      }

      ganhosPorDia[r.data] += r.valor;
    } else {
      const partesMes = r.data.split("/");

      const chaveMes = partesMes[1] + "/" + partesMes[2];

      if (!ganhosPorDia[chaveMes]) {
        ganhosPorDia[chaveMes] = 0;
      }

      ganhosPorDia[chaveMes] += r.valor;
    }

    // 🔥 RENDER
    listaR.innerHTML += `
      <tr>
        <td>${r.descricao}</td>
        <td>${r.data}</td>
        <td>R$ ${r.valor.toFixed(2)}</td>
        <td>${r.kmRodado ? r.kmRodado.toFixed(1) + " km" : "-"}</td>
        <td>${r.gastoCombustivel ? "R$ " + r.gastoCombustivel.toFixed(2) : "-"}</td>
        <td><strong>R$ ${r.lucroLiquido ? r.lucroLiquido.toFixed(2) : r.valor.toFixed(2)}</strong></td>
        <td>${r.ganhoPorHora ? "R$ " + r.ganhoPorHora.toFixed(2) + "/h" : "-"}</td>
        <td>
          <button onclick="editarReceita(${i})">Editar</button>
          <button onclick="excluirReceita(${i})">Excluir</button>
        </td>
      </tr>
    `;
  });

  // ===== GASTOS =====
  gastos.forEach((g, i) => {
    if (!g.data) return;

    const partes = g.data.split("/");
    const dataFormatada = `${partes[2]}-${partes[1]}-${partes[0]}`;

    if (dataInicio && dataFormatada < dataInicio) return;
    if (dataFim && dataFormatada > dataFim) return;

    totalG += g.valor;

    listaG.innerHTML += `
      <tr>
        <td>${g.descricao} (${g.tipo})</td>
        <td>${g.data}</td>
        <td>R$ ${g.valor.toFixed(2)}</td>
        <td>
          <button onclick="editarGasto(${i})">Editar</button>
          <button onclick="excluirGasto(${i})">Excluir</button>
        </td>
      </tr>
    `;
  });

  // ===== CÁLCULOS =====
  const valores = Object.values(ganhosPorDia);

  let melhorDia = 0;
  let mediaDia = 0;

  if (valores.length > 0) {
    melhorDia = Math.max(...valores);
    mediaDia = totalR / valores.length;
  }
  // ===== MELHOR DIA =====

  let melhorDiaSemana = "Domingo";
  let maiorValorSemana = 0;

  for (const dia in ganhosSemana) {
    if (ganhosSemana[dia] > maiorValorSemana) {
      maiorValorSemana = ganhosSemana[dia];

      melhorDiaSemana = dia;
    }
  }
  let melhorPeriodo = "Manhã";

  if (ganhosTarde > ganhosManha && ganhosTarde > ganhosNoite) {
    melhorPeriodo = "Tarde";
  }

  if (ganhosNoite > ganhosManha && ganhosNoite > ganhosTarde) {
    melhorPeriodo = "Noite";
  }

  let custoPorKm = 0;
  if (totalKm > 0) {
    custoPorKm = totalCombustivel / totalKm;
  }
  let ganhoPorKm = 0;

  if (totalKm > 0) {
    ganhoPorKm = totalR / totalKm;
  }
  let mediaHora = 0;

  if (qtdHoras > 0) {
    mediaHora = totalGanhoHora / qtdHoras;
  }

  // ===== RESUMO =====
  const reserva = totalR * (percentual / 100);
  const saldo = totalR - totalG - reserva;
  let metaDiaria = Number(localStorage.getItem("metaDiaria")) || 300;

  let faltamMeta = Math.max(0, Number(metaDiaria) - totalR);
  console.log("META:", metaDiaria);
  console.log("TOTALR:", totalR);
  console.log("FALTAM:", faltamMeta);

  let textoMeta = "";

  if (totalR >= Number(metaDiaria)) {
    textoMeta = "Meta batida 🚀";
  } else {
    textoMeta = "R$ " + faltamMeta.toFixed(2);
  }

  // ===== ATUALIZAR UI =====
  document.getElementById("total-receitas").textContent = totalR.toFixed(2);
  document.getElementById("total-gastos").textContent = totalG.toFixed(2);
  document.getElementById("reserva").textContent = reserva.toFixed(2);
  document.getElementById("saldo").textContent = saldo.toFixed(2);
  document.getElementById("melhor-dia").textContent = melhorDia.toFixed(2);
  document.getElementById("media-dia").textContent = mediaDia.toFixed(2);
  document.getElementById("custo-km").textContent = custoPorKm.toFixed(2);
  document.getElementById("ganho-km").textContent = ganhoPorKm.toFixed(2);
  document.getElementById("media-hora").textContent = mediaHora.toFixed(2);
  document.getElementById("meta-diaria").textContent =
    Number(metaDiaria).toFixed(2);
  document.getElementById("faltam-meta").textContent = textoMeta;
  document.getElementById("melhor-periodo").textContent = melhorPeriodo;
  document.getElementById("ranking-dia").textContent =
    "🏆 Melhor dia: " + melhorDiaSemana;

  document.getElementById("ranking-periodo").textContent =
    "🔥 Melhor período: " + melhorPeriodo;

  document.getElementById("ranking-maior").textContent =
    "💰 Maior corrida: R$ " + maiorGanho.toFixed(2);
  let porcentagemMeta = (totalR / Number(metaDiaria)) * 100;

  if (porcentagemMeta > 100) {
    porcentagemMeta = 100;
  }
  const barra = document.getElementById("progresso-meta");

  barra.style.width = porcentagemMeta + "%";

  // 🔴 VERMELHO
  if (porcentagemMeta < 50) {
    barra.style.background = "linear-gradient(90deg, #ef4444, #dc2626)";
  }

  // 🟡 AMARELO
  else if (porcentagemMeta < 100) {
    barra.style.background = "linear-gradient(90deg, #facc15, #eab308)";
  }

  // 🟢 VERDE
  else {
    barra.style.background = "linear-gradient(90deg, #22c55e, #16a34a)";
  }
  document.getElementById("texto-progresso").textContent =
    porcentagemMeta.toFixed(0) + "% da meta";

  // ===== COMPARATIVO SEMANAL =====

  const hoje = new Date();

  const semanaAtual = receitas.filter((r) => {
    if (!r.data) return false;

    const partes = r.data.split("/");

    const data = new Date(partes[2], partes[1] - 1, partes[0]);

    const diff = (hoje - data) / (1000 * 60 * 60 * 24);

    return diff <= 7;
  });

  const semanaPassada = receitas.filter((r) => {
    if (!r.data) return false;

    const partes = r.data.split("/");

    const data = new Date(partes[2], partes[1] - 1, partes[0]);

    const diff = (hoje - data) / (1000 * 60 * 60 * 24);

    return diff > 7 && diff <= 14;
  });

  const totalAtual = semanaAtual.reduce((acc, r) => acc + r.valor, 0);

  const totalPassado = semanaPassada.reduce((acc, r) => acc + r.valor, 0);

  let textoComparativo = "Sem dados suficientes";

  if (totalPassado > 0) {
    const diferenca = ((totalAtual - totalPassado) / totalPassado) * 100;

    if (diferenca > 0) {
      textoComparativo = `📈 ${diferenca.toFixed(1)}% acima da semana passada`;
    } else {
      textoComparativo = `📉 ${Math.abs(diferenca).toFixed(
        1,
      )}% abaixo da semana passada`;
    }
  }

  document.getElementById("comparativo-semana").innerHTML = textoComparativo;

  atualizarGrafico(ganhosPorDia);
  atualizarGraficoPizza(totalR, totalG, reserva);
}

// ===== GRÁFICO =====
function atualizarGrafico(dadosPorDia) {
  const canvas = document.getElementById("grafico");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (grafico) {
    grafico.destroy();
  }

  const labels = Object.keys(dadosPorDia);
  const valores = Object.values(dadosPorDia);

  grafico = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Ganhos por dia (R$)",
          data: valores,
          backgroundColor: "#22c55e",
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          labels: { color: "#fff" },
        },
      },
      scales: {
        x: { ticks: { color: "#fff" } },
        y: { ticks: { color: "#fff" } },
      },
    },
  });
}
function atualizarGraficoPizza(receitas, gastos, reserva) {
  const canvas = document.getElementById("graficoPizza");

  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (graficoPizza) {
    graficoPizza.destroy();
  }

  graficoPizza = new Chart(ctx, {
    type: "pie",

    data: {
      labels: ["Receitas", "Gastos", "Reserva"],

      datasets: [
        {
          data: [receitas, gastos, reserva],

          backgroundColor: ["#22c55e", "#ef4444", "#3b82f6"],
        },
      ],
    },

    options: {
      plugins: {
        legend: {
          labels: {
            color: "#fff",
          },
        },
      },
    },
  });
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
function filtrarReceitas() {
  filtroTexto = document.getElementById("filtro-receitas").value.toLowerCase();

  atualizar();
}
// ===== FILTRO HOJE =====
function filtrarHoje() {
  const hoje = new Date().toISOString().split("T")[0];

  dataInicio = hoje;
  dataFim = hoje;

  atualizar();
}

// ===== FILTRO SEMANA =====
function filtrarSemana() {
  const hoje = new Date();

  const primeiroDia = new Date();
  primeiroDia.setDate(hoje.getDate() - 7);

  dataInicio = primeiroDia.toISOString().split("T")[0];

  dataFim = hoje.toISOString().split("T")[0];

  atualizar();
}

// ===== FILTRO MÊS =====
function filtrarMes() {
  const hoje = new Date();

  const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

  dataInicio = primeiroDia.toISOString().split("T")[0];

  dataFim = hoje.toISOString().split("T")[0];

  atualizar();
}

// ===== LIMPAR =====
function limparFiltros() {
  dataInicio = "";
  dataFim = "";

  atualizar();
}
async function iniciarSistema() {
  const receitasNuvem = await carregarReceitasFirebase();

  if (receitasNuvem.length > 0) {
    receitas = receitasNuvem;
  }

  atualizar();
}
