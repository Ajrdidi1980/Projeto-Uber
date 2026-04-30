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
function trocarTela(id) {
  document.querySelectorAll(".tela").forEach((t) => {
    t.style.display = "none";
  });

  document.getElementById(id).style.display = "block";
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
  const valor = parseFloat(document.getElementById("valor-receita").value);

  if (!desc || isNaN(valor)) return alert("Preencha tudo");

  if (editandoReceita !== null) {
    receitas[editandoReceita] = {
      descricao: desc,
      valor: valor,
      data: hoje(),
    };
    editandoReceita = null;
  } else {
    receitas.push({
      descricao: desc,
      valor: valor,
      data: hoje(),
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
  const valor = parseFloat(document.getElementById("valor-gasto").value);

  if (!desc || isNaN(valor)) return alert("Preencha tudo");

  if (editandoGasto !== null) {
    gastos[editandoGasto] = {
      descricao: desc,
      valor: valor,
      data: hoje(),
    };
    editandoGasto = null;
  } else {
    gastos.push({
      descricao: desc,
      valor: valor,
      data: hoje(),
    });
  }

  salvar();
  atualizar();

  // limpa campos
  document.getElementById("desc-gasto").value = "";
  document.getElementById("valor-gasto").value = "";
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

  // 🔥 CALCULAR MELHOR DIA E MÉDIA
  const ganhosPorDia = {};

  receitas.forEach((r) => {
    if (!r.data) return;

    if (!ganhosPorDia[r.data]) {
      ganhosPorDia[r.data] = 0;
    }

    ganhosPorDia[r.data] += r.valor;
  });

  const valores = Object.values(ganhosPorDia);

  let melhorDia = 0;
  let mediaDia = 0;

  if (valores.length > 0) {
    melhorDia = Math.max(...valores);
    mediaDia = totalR / valores.length;
  }

  document.getElementById("melhor-dia").textContent = melhorDia.toFixed(2);
  document.getElementById("media-dia").textContent = mediaDia.toFixed(2);

  const listaR = document.getElementById("lista-receitas");
  const listaG = document.getElementById("lista-gastos");

  listaR.innerHTML = "";
  listaG.innerHTML = "";

  // RECEITAS
  receitas.forEach((r, i) => {
    // filtro por texto
    if (filtroTexto && !r.descricao.toLowerCase().includes(filtroTexto)) return;

    // 🔥 CONVERTER DATA (DD/MM/AAAA → AAAA-MM-DD)
    if (!r.data) return;
    const partes = r.data.split("/");
    const dataFormatada = `${partes[2]}-${partes[1]}-${partes[0]}`;

    // 🔥 FILTRO POR PERÍODO
    if (dataInicio && dataFormatada < dataInicio) return;
    if (dataFim && dataFormatada > dataFim) return;

    totalR += r.valor;

    listaR.innerHTML += `
      <tr>
        <td>${r.descricao}</td>
        <td>${r.data}</td>
        <td>R$ ${r.valor.toFixed(2)}</td>
        <td>
          <button onclick="editarReceita(${i})">Editar</button>
          <button onclick="excluirReceita(${i})">Excluir</button>
        </td>
      </tr>
    `;
  });

  // GASTOS
  gastos.forEach((g, i) => {
    if (!g.data) return;

    const partes = g.data.split("/");
    const dataFormatada = `${partes[2]}-${partes[1]}-${partes[0]}`;

    if (dataInicio && dataFormatada < dataInicio) return;
    if (dataFim && dataFormatada > dataFim) return;

    totalG += g.valor;

    listaG.innerHTML += `
    <tr>
      <td>${g.descricao}</td>
      <td>${g.data}</td>
      <td>R$ ${g.valor.toFixed(2)}</td>
      <td>
        <button onclick="editarGasto(${i})">Editar</button>
        <button onclick="excluirGasto(${i})">Excluir</button>
      </td>
    </tr>
  `;
  });

  // RESUMO
  const reserva = totalR * (percentual / 100);
  const saldo = totalR - totalG - reserva;

  document.getElementById("total-receitas").textContent = totalR.toFixed(2);
  document.getElementById("total-gastos").textContent = totalG.toFixed(2);
  document.getElementById("reserva").textContent = reserva.toFixed(2);
  document.getElementById("saldo").textContent = saldo.toFixed(2);
  atualizarGrafico();

  function atualizarGrafico() {
    const canvas = document.getElementById("grafico");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (grafico) {
      grafico.destroy();
    }

    const dadosPorDia = {};

    receitas.forEach((r) => {
      if (!r.data) return;

      if (!dadosPorDia[r.data]) {
        dadosPorDia[r.data] = 0;
      }

      dadosPorDia[r.data] += r.valor;
    });

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
          x: {
            ticks: { color: "#fff" },
          },
          y: {
            ticks: { color: "#fff" },
          },
        },
      },
    });
  }
}

// ===== INICIAR =====
document.addEventListener("DOMContentLoaded", function () {
  trocarTela("receitas");
  atualizar();
});
