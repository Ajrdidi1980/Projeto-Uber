// ===== ADICIONAR / EDITAR RECEITA =====

async function addReceita() {
  if (!document.querySelector("#selector-plataforma .ativo")) {
    alert("Selecione onde você trabalhou");
    return;
  }
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
  const tipoVeiculo = document.getElementById("tipo-veiculo").value;
  localStorage.setItem(`ultimoPreco_${tipoVeiculo}`, combustivel);
  const kmRodado = kmFinal - kmInicial;

  let ganhoPorHora = 0;
  let horasTrabalhadas = 0;

  if (horaInicio && horaFim) {
    const inicio = new Date(`2000-01-01T${horaInicio}`);
    const fim = new Date(`2000-01-01T${horaFim}`);

    if (fim < inicio) {
      fim.setDate(fim.getDate() + 1);
    }

    const horas = (fim - inicio) / 1000 / 60 / 60;
    if (horas > 0) {
      horasTrabalhadas = horas;
    }
  }

  let gastoCombustivel = 0;

  if (consumo > 0 && combustivel > 0 && kmRodado > 0) {
    gastoCombustivel = (kmRodado / consumo) * combustivel;
  }

  const lucroLiquido = valor - gastoCombustivel;
  if (horasTrabalhadas > 0) {
    ganhoPorHora = lucroLiquido / horasTrabalhadas;
  }

  let economiaEletrica = 0;

  if (tipoVeiculo === "eletrico") {
    const gasolinaMedia = 6.5;

    const consumoGasolina = 10;

    const gastoGasolina = (kmRodado / consumoGasolina) * gasolinaMedia;

    economiaEletrica = gastoGasolina - gastoCombustivel;
  }

  if (isNaN(valor)) return alert("Preencha o faturamento");

  if (tipoVeiculo !== "eletrico") {
    if (consumo <= 0) {
      alert("Informe o consumo do veículo.");
      return;
    }

    if (combustivel <= 0) {
      alert("Informe o preço do combustível.");
      return;
    }
  }

  if (editandoReceita !== null) {
    const receitaEditada = {
      descricao: desc,
      valor: valor,
      data: dataReceita ? formatarData(dataReceita) : hoje(),
      timestamp: Date.now(),

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
      horasTrabalhadas,
      economiaEletrica,
      tipoVeiculo,
    };

    const idFirebase = receitas[editandoReceita].id;

    receitas[editandoReceita] = {
      id: idFirebase,
      ...receitaEditada,
    };

    await editarReceitaFirebase(idFirebase, receitaEditada);

    editandoReceita = null;
  } else {
    const novaReceita = {
      descricao: desc,
      valor: valor,
      data: dataReceita ? formatarData(dataReceita) : hoje(),
      timestamp: Date.now(),
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
      horasTrabalhadas,
      economiaEletrica,
      tipoVeiculo,
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
  document.getElementById("km-inicial").value = kmFinal;
  document.getElementById("km-final").value = "";
  document.getElementById("consumo").value = consumo;
  document.getElementById("combustivel").value = combustivel;
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
function aplicarFiltrosReceitas() {
  filtroTexto = document.getElementById("filtro-receitas").value.toLowerCase();
  filtroVeiculo = document.getElementById("filtro-veiculo").value;

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
        ${formatarMoeda(r.valor)}
      </td>

      <td>
       ${formatarKm(r.kmRodado)}
      </td>
      <td>
        ${renderizarVeiculo(r.tipoVeiculo)}
      </td>

      <td>
        ${formatarMoeda(r.gastoCombustivel || 0)}
      </td>

      <td>
        <strong>
          ${formatarMoeda(r.lucroLiquido ?? r.valor)}
        </strong>
      </td>
      <td> ${
        r.tipoVeiculo === "eletrico"
          ? `
      <span class="economia-eletrica">
         ⚡R$  ${formatarMoeda(r.economiaEletrica)}
      </span>
      `
          : "N/A"
      }
      </td>
 

      <td>
        ${formatarMoeda(r.ganhoPorHora || 0)}
      </td>

      <td>
      ${renderizarAcoes(i)}
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

document.addEventListener("DOMContentLoaded", () => {
  const tipoVeiculo = document.getElementById("tipo-veiculo");

  tipoVeiculo.addEventListener("change", () => {
    const consumo = document.getElementById("consumo");

    const combustivel = document.getElementById("combustivel");

    if (tipoVeiculo.value === "gasolina") {
      consumo.placeholder = "Km/L";

      combustivel.placeholder = "R$/L";
    }

    if (tipoVeiculo.value === "gnv") {
      consumo.placeholder = "Km/m³";

      combustivel.placeholder = "R$/m³";
    }

    if (tipoVeiculo.value === "eletrico") {
      consumo.placeholder = "Km/kWh";

      combustivel.placeholder = "R$/kWh";
    }
  });
});

window.addReceita = addReceita;
window.editarReceita = editarReceita;
window.excluirReceita = excluirReceita;
window.filtrarPorData = filtrarPorData;
window.renderizarReceita = renderizarReceita;
window.renderizarTabelaReceitas = renderizarTabelaReceitas;
