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
function calcularGastoCombustivel({ kmRodado, consumo, combustivel }) {
  let gastoCombustivel = 0;

  if (consumo > 0 && combustivel > 0 && kmRodado > 0) {
    gastoCombustivel = (kmRodado / consumo) * combustivel;
  }

  return gastoCombustivel;
}

window.hoje = hoje;
window.formatarData = formatarData;
window.calcularGastoCombustivel = calcularGastoCombustivel;
