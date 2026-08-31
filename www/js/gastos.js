function renderizarGasto(g, i) {
  return `
    <tr>

      <td>
        ${formatarTipoGasto(g.tipo)}
      </td>

      <td>
        ${g.descricao}
      </td>

      <td>
        ${g.data}
      </td>

      <td>
        ${formatarMoeda(g.valor)}
      </td>

      <td>

        <button class="btn-editar" onclick="editarGasto(${i})">
          ✏️
        </button>

        <button class="btn-excluir" onclick="excluirGasto(${i})">
          🗑️
        </button>

      </td>

    </tr>
  `;
}
// ===== ADICIONAR / EDITAR GASTO =====

async function addGasto() {
  const desc = document.getElementById("desc-gasto").value;

  const valor = parseFloat(document.getElementById("valor-gasto").value) || 0;
  const dataGasto = document.getElementById("data-gasto").value;

  const tipo = document.getElementById("tipo-gasto").value;

  if (isNaN(valor)) return alert("Preencha o valor");

  const gastoData = {
    descricao: desc,
    valor: valor,
    tipo: tipo || "outros",
    data: dataGasto ? formatarData(dataGasto) : hoje(),
  };

  if (editandoGasto !== null) {
    const idFirebase = gastos[editandoGasto].id;

    await editarGastoFirebase(idFirebase, gastoData);

    editandoGasto = null;
  } else {
    await salvarGastoFirebase(gastoData);
  }

  atualizar();

  document.getElementById("desc-gasto").value = "";

  document.getElementById("valor-gasto").value = "";
  document.getElementById("data-gasto").value = "";
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

async function excluirGasto(i) {
  const gasto = gastos[i];

  if (gasto.id) {
    await excluirGastoFirebase(gasto.id);
  }
}
function editarGasto(i) {
  const g = gastos[i];

  document.getElementById("desc-gasto").value = g.descricao;
  document.getElementById("valor-gasto").value = g.valor;
  document.getElementById("tipo-gasto").value = g.tipo;
  document.getElementById("btn-gasto").textContent = "Salvar";

  editandoGasto = i;
}
function renderizarTabelaGastos(gastosFiltrados, listaG) {
  listaG.innerHTML = "";

  gastosFiltrados.forEach((g, i) => {
    listaG.innerHTML += renderizarGasto(g, i);
  });
}
window.renderizarGasto = renderizarGasto;
window.addGasto = addGasto;
window.excluirGasto = excluirGasto;
window.editarGasto = editarGasto;
window.renderizarTabelaGastos = renderizarTabelaGastos;
