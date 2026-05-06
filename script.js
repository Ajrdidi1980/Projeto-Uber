// ===== DADOS =====
let receitas = JSON.parse(localStorage.getItem("receitas")) || [];
let gastos = JSON.parse(localStorage.getItem("gastos")) || [];
let percentual = parseFloat(localStorage.getItem("percentual")) || 0;

let editandoReceita = null;
let editandoGasto = null;
let grafico = null;
let filtroTexto = "";
let dataInicio = "";
let dataFim = "";

// ===== SALVAR =====
function salvar() {
  localStorage.setItem("receitas", JSON.stringify(receitas));
  localStorage.setItem("gastos", JSON.stringify(gastos));
  localStorage.setItem("percentual", percentual);
}

// ===== DATA =====
function hoje() {
  const d = new Date();

  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const ano = d.getFullYear();

  return `${dia}/${mes}/${ano}`;
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
function addReceita() {
  const desc = document.getElementById("desc-receita").value;
  const valor = parseFloat(document.getElementById("valor-receita").value) || 0;
  const kmInicial =
    parseFloat(document.getElementById("km-inicial").value) || 0;
  const kmFinal = parseFloat(document.getElementById("km-final").value) || 0;
  const consumo = parseFloat(document.getElementById("consumo").value) || 0;
  const combustivel =
    parseFloat(document.getElementById("combustivel").value) || 0;

  const kmRodado = kmFinal - kmInicial;

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
      data: hoje(),
      kmRodado,
      gastoCombustivel,
      lucroLiquido,
    };
    editandoReceita = null;
  } else {
    receitas.push({
      descricao: desc,
      valor: valor,
      data: hoje(),
      kmRodado,
      gastoCombustivel,
      lucroLiquido,
    });
  }

  salvar();
  atualizar();

  // limpa campos
  document.getElementById("desc-receita").value = "";
  document.getElementById("valor-receita").value = "";
  document.getElementById("btn-receita").textContent = "Adicionar";
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

  // limpa campos
  document.getElementById("desc-gasto").value = "";
  document.getElementById("valor-gasto").value = "";
  document.getElementById("tipo-gasto").value = "outros";
  document.getElementById("btn-gasto").textContent = "Adicionar";
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
function excluirReceita(i) {
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

// ===== ATUALIZAR TELA =====
function atualizar() {
  let totalR = 0;
  let totalG = 0;
  let totalKm = 0;
  let totalCombustivel = 0;

  const listaR = document.getElementById("lista-receitas");
  const listaG = document.getElementById("lista-gastos");

  listaR.innerHTML = "";
  listaG.innerHTML = "";

  // 🔥 AGRUPAR GANHOS POR DIA
  const ganhosPorDia = {};

  // ===== RECEITAS =====
  receitas.forEach((r, i) => {
    if (!r.data) return;

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
    totalKm += r.kmRodado || 0;
    totalCombustivel += r.gastoCombustivel || 0;

    // 🔥 AGRUPAMENTO POR DIA
    if (!ganhosPorDia[r.data]) {
      ganhosPorDia[r.data] = 0;
    }
    ganhosPorDia[r.data] += r.valor;

    // 🔥 RENDER
    listaR.innerHTML += `
      <tr>
        <td>${r.descricao}</td>
        <td>${r.data}</td>
        <td>R$ ${r.valor.toFixed(2)}</td>
        <td>${r.kmRodado ? r.kmRodado.toFixed(1) + " km" : "-"}</td>
        <td>${r.gastoCombustivel ? "R$ " + r.gastoCombustivel.toFixed(2) : "-"}</td>
        <td><strong>R$ ${r.lucroLiquido ? r.lucroLiquido.toFixed(2) : r.valor.toFixed(2)}</strong></td>
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

  let custoPorKm = 0;
  if (totalKm > 0) {
    custoPorKm = totalCombustivel / totalKm;
  }
  let ganhoPorKm = 0;

  if (totalKm > 0) {
    ganhoPorKm = totalR / totalKm;
  }

  // ===== RESUMO =====
  const reserva = totalR * (percentual / 100);
  const saldo = totalR - totalG - reserva;

  // ===== ATUALIZAR UI =====
  document.getElementById("total-receitas").textContent = totalR.toFixed(2);
  document.getElementById("total-gastos").textContent = totalG.toFixed(2);
  document.getElementById("reserva").textContent = reserva.toFixed(2);
  document.getElementById("saldo").textContent = saldo.toFixed(2);
  document.getElementById("melhor-dia").textContent = melhorDia.toFixed(2);
  document.getElementById("media-dia").textContent = mediaDia.toFixed(2);
  document.getElementById("custo-km").textContent = custoPorKm.toFixed(2);
  document.getElementById("ganho-km").textContent = ganhoPorKm.toFixed(2);

  atualizarGrafico(ganhosPorDia);
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

// ===== INICIAR =====
document.addEventListener("DOMContentLoaded", function () {
  trocarTela("receitas", document.querySelector(".sidebar button"));

  atualizar();
});
