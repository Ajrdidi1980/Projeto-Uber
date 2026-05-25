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
    const receitaEditada = {
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

    const idFirebase = receitas[editandoReceita].id;

    receitas[editandoReceita] = {
      id: idFirebase,
      ...receitaEditada,
    };
    console.log(receitas[editandoReceita]);

    await editarReceitaFirebase(idFirebase, receitaEditada);

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

    const idFirebase = await salvarReceitaFirebase(novaReceita);

    novaReceita.id = idFirebase;
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
// ===== EDITAR =====
function editarReceita(i) {
  const r = receitas[i];

  document.getElementById("desc-receita").value = r.descricao;

  document.getElementById("valor-receita").value = r.valor;

  document.getElementById("data-receita").value = r.data
    .split("/")
    .reverse()
    .join("-");

  document.getElementById("hora-inicio").value = r.horaInicio || "";

  document.getElementById("hora-fim").value = r.horaFim || "";

  document.getElementById("km-inicial").value = r.kmInicial || "";

  document.getElementById("km-final").value = r.kmFinal || "";

  document.getElementById("consumo").value = r.consumo || "";

  document.getElementById("combustivel").value = r.combustivel || "";

  document.getElementById("btn-receita").textContent = "Salvar";

  editandoReceita = i;
}
async function excluirReceita(i) {
  const receita = receitas[i];

  if (receita.id) {
    await window.excluirReceitaFirebase(receita.id);
  }

  receitas = receitas.filter((_, index) => index !== i);

  atualizar();
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

function renderizarReceita(r, i) {
  return `
    <tr>
      <td>${r.descricao}</td>
      <td>${r.data}</td>

      <td>
        R$ ${r.valor.toFixed(2)}
      </td>

      <td>
        ${r.kmRodado ? r.kmRodado.toFixed(1) + " km" : "-"}
      </td>

      <td>
        ${r.gastoCombustivel ? "R$ " + r.gastoCombustivel.toFixed(2) : "-"}
      </td>

      <td>
        <strong>
          R$ ${r.lucroLiquido ? r.lucroLiquido.toFixed(2) : r.valor.toFixed(2)}
        </strong>
      </td>

      <td>
        ${r.ganhoPorHora ? "R$ " + r.ganhoPorHora.toFixed(2) + "/h" : "-"}
      </td>

      <td>
        <button onclick="editarReceita(${i})">
          Editar
        </button>

        <button onclick="excluirReceita(${i})">
          Excluir
        </button>
      </td>
    </tr>
  `;
}
function renderizarTabelaReceitas(receitasFiltradas, listaR) {
  listaR.innerHTML = "";

  receitasFiltradas.forEach((r, i) => {
    listaR.innerHTML += renderizarReceita(r, i);
  });
}
window.addReceita = addReceita;
window.editarReceita = editarReceita;
window.excluirReceita = excluirReceita;
window.filtrarReceitas = filtrarReceitas;
window.filtrarPorData = filtrarPorData;
window.renderizarReceita = renderizarReceita;
window.renderizarTabelaReceitas = renderizarTabelaReceitas;
