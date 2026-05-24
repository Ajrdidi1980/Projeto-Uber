// ===== SALVAR =====
function salvar() {
  localStorage.setItem("gastos", JSON.stringify(gastos));
  localStorage.setItem("percentual", percentual);
  localStorage.setItem("metaDiaria", metaDiaria);
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
window.salvar = salvar;
window.salvarPercentual = salvarPercentual;
window.salvarMeta = salvarMeta;
