// ===== MEU DIA =====

function atualizarMeuDia() {
  const hoje = new Date();

  document.getElementById("diario-data").textContent =
    hoje.toLocaleDateString("pt-BR");
}
const faturamento = document.getElementById("total-receitas").textContent;

document.getElementById("diario-faturamento").textContent = faturamento;

window.atualizarMeuDia = atualizarMeuDia;
