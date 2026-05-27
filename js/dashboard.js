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
// ===== LIMPAR =====
function limparFiltros() {
  dataInicio = "";
  dataFim = "";

  atualizar();
}
// ===== FILTRO HOJE =====
function filtrarHoje() {
  const d = new Date();

  const dia = String(d.getDate()).padStart(2, "0");

  const mes = String(d.getMonth() + 1).padStart(2, "0");

  const ano = d.getFullYear();

  const hoje = `${ano}-${mes}-${dia}`;

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
function atualizarCardsDashboard(dados) {
  document.getElementById("total-receitas").textContent =
    dados.totalR.toFixed(2);

  document.getElementById("total-gastos").textContent = dados.totalG.toFixed(2);

  document.getElementById("reserva").textContent = dados.reserva.toFixed(2);

  document.getElementById("saldo").textContent = dados.saldo.toFixed(2);

  document.getElementById("melhor-dia").textContent =
    dados.melhorDia.toFixed(2);

  document.getElementById("media-dia").textContent = dados.mediaDia.toFixed(2);

  document.getElementById("custo-km").textContent = dados.custoPorKm.toFixed(2);

  document.getElementById("ganho-km").textContent = dados.ganhoPorKm.toFixed(2);

  document.getElementById("media-hora").textContent =
    dados.mediaHora.toFixed(2);

  document.getElementById("meta-diaria").textContent = Number(
    dados.metaDiaria,
  ).toFixed(2);

  document.getElementById("faltam-meta").textContent = dados.textoMeta;

  document.getElementById("melhor-periodo").textContent = dados.melhorPeriodo;

  document.getElementById("ranking-dia").textContent =
    "🏆 Melhor dia: " + dados.melhorDiaSemana;

  document.getElementById("ranking-periodo").textContent =
    "🔥 Melhor período: " + dados.melhorPeriodo;

  document.getElementById("ranking-maior").textContent =
    "💰 Maior corrida: R$ " + dados.maiorGanho.toFixed(2);
}
function atualizarBarraMeta(totalR, metaDiaria) {
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
}
function atualizarComparativoSemanal(receitas) {
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
      textoComparativo = `📉 ${Math.abs(diferenca).toFixed(1)}% abaixo da semana passada`;
    }
  }

  document.getElementById("comparativo-semana").innerHTML = textoComparativo;
}
function calcularMetricas({
  totalKm,
  totalCombustivel,
  totalR,
  totalGanhoHora,
  qtdHoras,
}) {
  let custoPorKm = 0;

  if (totalKm > 0) {
    custoPorKm = totalCombustivel / totalKm;
  }

  let ganhoPorKm = 0;

  if (totalKm && totalKm > 0) {
    ganhoPorKm = totalR / totalKm;
  }

  let mediaHora = 0;

  if (qtdHoras && qtdHoras > 0) {
    mediaHora = totalGanhoHora / qtdHoras;
  }

  return {
    custoPorKm,
    ganhoPorKm,
    mediaHora,
  };
}
function calcularMelhorPeriodo({ ganhosManha, ganhosTarde, ganhosNoite }) {
  let melhorPeriodo = "Manhã";

  if (ganhosTarde > ganhosManha && ganhosTarde > ganhosNoite) {
    melhorPeriodo = "Tarde";
  }

  if (ganhosNoite > ganhosManha && ganhosNoite > ganhosTarde) {
    melhorPeriodo = "Noite";
  }

  return melhorPeriodo;
}
function calcularMelhorDiaSemana(ganhosSemana) {
  let melhorDiaSemana = "Domingo";

  let maiorValorSemana = 0;

  for (const dia in ganhosSemana) {
    if (ganhosSemana[dia] > maiorValorSemana) {
      maiorValorSemana = ganhosSemana[dia];

      melhorDiaSemana = dia;
    }
  }

  return melhorDiaSemana;
}
function calcularResumoFinanceiro({ totalR, totalG, percentual }) {
  const reserva = totalR * (percentual / 100);

  const saldo = totalR - totalG - reserva;

  return {
    reserva,
    saldo,
  };
}
function calcularTextoMeta({ totalR, metaDiaria, faltamMeta }) {
  let textoMeta = "";

  if (totalR >= Number(metaDiaria)) {
    textoMeta = "Meta batida 🚀";
  } else {
    textoMeta = "R$ " + faltamMeta.toFixed(2);
  }

  return textoMeta;
}
function calcularFaltamMeta(totalR, metaDiaria) {
  return Math.max(0, Number(metaDiaria) - totalR);
}
function calcularDesempenhoDiario({ valores, totalR }) {
  let melhorDia = 0;

  let mediaDia = 0;

  if (valores.length > 0) {
    melhorDia = Math.max(...valores);

    mediaDia = totalR / valores.length;
  }

  return {
    melhorDia,
    mediaDia,
  };
}
function agruparGanhosPorPeriodo({ modoGrafico, ganhosPorDia, receita }) {
  // AGRUPAR POR DIA
  if (modoGrafico === "dia") {
    if (!ganhosPorDia[receita.data]) {
      ganhosPorDia[receita.data] = 0;
    }

    ganhosPorDia[receita.data] += receita.valor;
  }

  // AGRUPAR POR MÊS
  else {
    const partesMes = receita.data.split("/");

    const chaveMes = partesMes[1] + "/" + partesMes[2];

    if (!ganhosPorDia[chaveMes]) {
      ganhosPorDia[chaveMes] = 0;
    }

    ganhosPorDia[chaveMes] += receita.valor;
  }
}
function calcularAcumuladoresReceita({
  receita,
  totalR,
  totalKm,
  totalCombustivel,
  totalGanhoHora,
  qtdHoras,
}) {
  totalR += receita.lucroLiquido || receita.valor;

  totalKm += receita.kmRodado || 0;

  totalCombustivel += receita.gastoCombustivel || 0;

  if (receita.ganhoPorHora) {
    totalGanhoHora += receita.ganhoPorHora;

    qtdHoras++;
  }

  return {
    totalR,
    totalKm,
    totalCombustivel,
    totalGanhoHora,
    qtdHoras,
  };
}
function calcularGanhosPorPeriodo({
  receita,
  ganhosManha,
  ganhosTarde,
  ganhosNoite,
}) {
  if (receita.horaInicio) {
    const hora = Number(receita.horaInicio.split(":")[0]);

    if (hora >= 5 && hora < 12) {
      ganhosManha += receita.valor;
    } else if (hora >= 12 && hora < 18) {
      ganhosTarde += receita.valor;
    } else {
      ganhosNoite += receita.valor;
    }
  }

  return {
    ganhosManha,
    ganhosTarde,
    ganhosNoite,
  };
}
window.salvar = salvar;
window.salvarPercentual = salvarPercentual;
window.salvarMeta = salvarMeta;
window.limparFiltros = limparFiltros;
window.filtrarHoje = filtrarHoje;
window.filtrarSemana = filtrarSemana;
window.filtrarMes = filtrarMes;
window.atualizarCardsDashboard = atualizarCardsDashboard;
window.atualizarBarraMeta = atualizarBarraMeta;
window.atualizarComparativoSemanal = atualizarComparativoSemanal;
window.calcularMetricas = calcularMetricas;
window.calcularMelhorPeriodo = calcularMelhorPeriodo;
window.calcularMelhorDiaSemana = calcularMelhorDiaSemana;
window.calcularResumoFinanceiro = calcularResumoFinanceiro;
window.calcularTextoMeta = calcularTextoMeta;
window.calcularFaltamMeta = calcularFaltamMeta;
window.calcularDesempenhoDiario = calcularDesempenhoDiario;
window.agruparGanhosPorPeriodo = agruparGanhosPorPeriodo;
window.calcularAcumuladoresReceita = calcularAcumuladoresReceita;
window.calcularGanhosPorPeriodo = calcularGanhosPorPeriodo;
