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
async function salvarMeta() {
  const valor = document.getElementById("meta-input").value;

  metaDiaria = Number(valor);

  // Continua salvando localmente
  localStorage.setItem("metaDiaria", metaDiaria);

  // Novo: salva no Firestore
  await window.salvarConfiguracoesFirebase({
    metaDiaria,
    percentual,
  });

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
  const periodo = obterPeriodo("hoje");

  dataInicio = periodo.inicio;
  dataFim = periodo.fim;

  atualizar();
}
// ===== FILTRO SEMANA =====
function filtrarSemana() {
  const periodo = obterPeriodo("semana");

  dataInicio = periodo.inicio;
  dataFim = periodo.fim;

  atualizar();
}
// ===== FILTRO MÊS =====
function filtrarMes() {
  const periodo = obterPeriodo("mes");

  dataInicio = periodo.inicio;
  dataFim = periodo.fim;

  atualizar();
}
function atualizarCardsDashboard(dados) {
  document.getElementById("total-receitas").textContent = formatarMoeda(
    dados.totalR,
  );

  document.getElementById("total-gastos").textContent = formatarMoeda(
    dados.totalG,
  );

  document.getElementById("total-combustivel").textContent = formatarMoeda(
    dados.totalCombustivel,
  );

  document.getElementById("reserva").textContent = formatarMoeda(dados.reserva);

  document.getElementById("saldo").textContent = formatarMoeda(dados.saldo);

  document.getElementById("melhor-dia").textContent = formatarMoeda(
    dados.melhorDia,
  );

  document.getElementById("media-dia").textContent = formatarMoeda(
    dados.mediaDia,
  );

  document.getElementById("custo-km").textContent = formatarMoeda(
    dados.custoPorKm,
  );

  document.getElementById("ganho-km").textContent = formatarMoeda(
    dados.ganhoPorKm,
  );

  document.getElementById("media-hora").textContent = formatarMoeda(
    dados.mediaHora,
  );

  const horas = Math.floor(dados.totalHorasTrabalhadas || 0);

  const minutos = Math.round(((dados.totalHorasTrabalhadas || 0) - horas) * 60);

  document.getElementById("horas-trabalhadas").innerHTML =
    `📅 ${dados.quantidadeDiasTrabalhados} dias<br>` +
    `🕒 ${horas}h ${String(minutos).padStart(2, "0")}min`;

  document.getElementById("meta-diaria").textContent = formatarMoeda(
    dados.metaDiaria,
  );

  document.getElementById("faltam-meta").textContent = dados.textoMeta;

  document.getElementById("melhor-periodo").textContent = dados.melhorPeriodo;

  document.getElementById("ranking-dia").textContent =
    "🏆 Melhor dia: " + dados.melhorDiaSemana;

  document.getElementById("ranking-periodo").textContent =
    "🔥 Melhor período: " + dados.melhorPeriodo;

  document.getElementById("ranking-maior").textContent =
    "💰 Maior corrida: " + formatarMoeda(dados.maiorGanho);
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

  const obterData = (data) => {
    if (!data) return null;

    // Data antiga em texto
    if (typeof data === "string") {
      const partes = data.split("/");
      return new Date(partes[2], partes[1] - 1, partes[0]);
    }

    // Timestamp do Firestore
    if (data.toDate) {
      return data.toDate();
    }

    return null;
  };

  const semanaAtual = receitas.filter((r) => {
    const data = obterData(r.data);

    if (!data) return false;

    const diff = (hoje - data) / (1000 * 60 * 60 * 24);

    return diff <= 7;
  });

  const semanaPassada = receitas.filter((r) => {
    const data = obterData(r.data);

    if (!data) return false;

    const diff = (hoje - data) / (1000 * 60 * 60 * 24);

    return diff > 7 && diff <= 14;
  });

  const totalAtual = semanaAtual.reduce(
    (acc, r) => acc + Number(r.valor || 0),
    0,
  );

  const totalPassado = semanaPassada.reduce(
    (acc, r) => acc + Number(r.valor || 0),
    0,
  );

  let textoComparativo = "Sem dados suficientes";

  if (totalPassado > 0) {
    const diferenca = ((totalAtual - totalPassado) / totalPassado) * 100;

    if (diferenca > 0) {
      textoComparativo = `📈 ${diferenca.toFixed(1)}% acima da semana passada`;
    } else {
      textoComparativo = `📉 ${Math.abs(diferenca).toFixed(1)}% abaixo da semana passada`;
    }
  }

  const economiaEletricaTotal = receitas.reduce(
    (total, r) => total + (Number(r.economiaEletrica) || 0),
    0,
  );
  const comparativo = document.getElementById("comparativo-semana");

  if (comparativo) {
    comparativo.textContent = textoComparativo;
  }
}
function calcularMetricas({
  totalKm,
  totalCombustivel,
  totalR,
  totalGanhoHora,
  qtdHoras,
  saldo,
}) {
  let custoPorKm = 0;

  if (totalKm > 0) {
    custoPorKm = totalCombustivel / totalKm;
  }

  let ganhoPorKm = 0;

  if (totalKm && totalKm > 0) {
    ganhoPorKm = saldo / totalKm;
  }

  let mediaHora = 0;

  if (qtdHoras && qtdHoras > 0) {
    mediaHora = saldo / qtdHoras;
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
function calcularResumoFinanceiro({
  totalR,
  totalG,
  totalCombustivel,
  percentual,
}) {
  const saldo = totalR - totalCombustivel - totalG;

  const reserva = saldo * (percentual / 100);

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

function calcularDesempenhoDiario({
  valores,
  saldo,
  quantidadeDiasTrabalhados,
}) {
  let melhorDia = 0;

  let mediaDia = 0;

  if (valores.length > 0) {
    melhorDia = Math.max(...valores);

    if (quantidadeDiasTrabalhados > 0) {
      mediaDia = saldo / quantidadeDiasTrabalhados;
    }
  }

  return {
    melhorDia,
    mediaDia,
  };
}
function agruparGanhosPorPeriodo({ modoGrafico, ganhosPorDia, receita }) {
  // AGRUPAR POR DIA
  if (modoGrafico === "dia") {
    const chaveDia =
      typeof receita.data === "string"
        ? receita.data
        : converterData(receita.data);

    if (!ganhosPorDia[chaveDia]) {
      ganhosPorDia[chaveDia] = 0;
    }

    ganhosPorDia[chaveDia] += Number(
      receita.lucroLiquido ?? receita.valor ?? 0,
    );
  }

  // AGRUPAR POR MÊS
  else {
    let chaveMes;

    if (typeof receita.data === "string") {
      const partesMes = receita.data.split("/");
      chaveMes = partesMes[1] + "/" + partesMes[2];
    } else if (receita.data?.toDate) {
      const d = receita.data.toDate();

      chaveMes =
        String(d.getMonth() + 1).padStart(2, "0") + "/" + d.getFullYear();
    } else {
      return;
    }

    if (!ganhosPorDia[chaveMes]) {
      ganhosPorDia[chaveMes] = 0;
    }

    ganhosPorDia[chaveMes] += Number(
      receita.lucroLiquido ?? receita.valor ?? 0,
    );
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
  totalR += Number(receita.valor || 0);

  totalKm += receita.kmRodado || 0;

  totalCombustivel += receita.gastoCombustivel || 0;

  if (receita.horasTrabalhadas > 0) {
    totalGanhoHora += Number(receita.lucroLiquido ?? receita.valor ?? 0);

    qtdHoras += Number(receita.horasTrabalhadas);
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

    const resultadoLiquido = Number(receita.lucroLiquido ?? receita.valor ?? 0);

    if (hora >= 5 && hora < 12) {
      ganhosManha += resultadoLiquido;
    } else if (hora >= 12 && hora < 18) {
      ganhosTarde += resultadoLiquido;
    } else {
      ganhosNoite += resultadoLiquido;
    }
  }

  return {
    ganhosManha,
    ganhosTarde,
    ganhosNoite,
  };
}
function calcularGanhosSemanais({
  receita,
  diffDias,
  ganhosSemanaAtual,
  ganhosSemanaPassada,
}) {
  // SEMANA ATUAL
  if (diffDias <= 7) {
    ganhosSemanaAtual += receita.valor;
  }

  // SEMANA PASSADA
  else if (diffDias <= 14) {
    ganhosSemanaPassada += receita.valor;
  }

  return {
    ganhosSemanaAtual,
    ganhosSemanaPassada,
  };
}
function acumularGanhosSemana({ receita, ganhosSemana }) {
  let dataSemana;

  if (typeof receita.data === "string") {
    const partesSemana = receita.data.split("/");

    dataSemana = new Date(
      partesSemana[2],
      partesSemana[1] - 1,
      partesSemana[0],
    );
  } else if (receita.data?.toDate) {
    dataSemana = receita.data.toDate();
  } else {
    return ganhosSemana;
  }

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

  ganhosSemana[nomeDia] += Number(receita.lucroLiquido ?? receita.valor ?? 0);

  return ganhosSemana;
}
function calcularMaiorGanho({ receita, maiorGanho }) {
  if (receita.valor > maiorGanho) {
    maiorGanho = receita.valor;
  }

  return maiorGanho;
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
window.atualizarBarraMeta = atualizarBarraMeta;
window.calcularFaltamMeta = calcularFaltamMeta;
window.calcularDesempenhoDiario = calcularDesempenhoDiario;
window.agruparGanhosPorPeriodo = agruparGanhosPorPeriodo;
window.calcularAcumuladoresReceita = calcularAcumuladoresReceita;
window.calcularGanhosPorPeriodo = calcularGanhosPorPeriodo;
window.calcularGanhosSemanais = calcularGanhosSemanais;
window.acumularGanhosSemana = acumularGanhosSemana;
window.calcularMaiorGanho = calcularMaiorGanho;
