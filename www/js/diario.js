// ===== MEU DIA =====

function atualizarMeuDia() {
  const hoje = new Date();
  const hojeISO = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`;

  const receitasHoje = receitas.filter(
    (r) => converterData(r.data) === hojeISO,
  );

  const faturamentoHoje = receitasHoje.reduce(
    (total, r) => total + (r.valor || 0),
    0,
  );
  document.getElementById("diario-faturamento").textContent =
    formatarMoeda(faturamentoHoje);

  const combustivelHoje = receitasHoje.reduce(
    (total, r) => total + (r.gastoCombustivel || 0),
    0,
  );

  document.getElementById("diario-combustivel").textContent =
    formatarMoeda(combustivelHoje);

  const kmHoje = receitasHoje.reduce(
    (total, r) => total + (r.kmRodado || 0),
    0,
  );

  const gastosHoje = gastos.filter((g) => converterData(g.data) === hojeISO);

  const outrosGastosHoje = gastosHoje.reduce(
    (total, g) => total + Number(g.valor || 0),
    0,
  );

  document.getElementById("diario-outros-gastos").textContent =
    formatarMoeda(outrosGastosHoje);

  document.getElementById("diario-km").textContent = kmHoje.toFixed(0) + " km";

  const percentualMeta = (faturamentoHoje / metaDiaria) * 100;
  document.getElementById("diario-meta").textContent =
    percentualMeta >= 100
      ? "Meta atingida 🚀"
      : percentualMeta.toFixed(0) + "%";

  const horasHoje = receitasHoje.reduce((total, r) => {
    if (!r.horaInicio || !r.horaFim) return total;

    const inicio = new Date(`2000-01-01T${r.horaInicio}`);
    const fim = new Date(`2000-01-01T${r.horaFim}`);

    return total + (fim - inicio) / 1000 / 60 / 60;
  }, 0);

  document.getElementById("diario-horas").textContent =
    horasHoje.toFixed(1) + " h";
  const lucroCorridasHoje = receitasHoje.reduce(
    (total, r) => total + Number(r.lucroLiquido ?? r.valor ?? 0),
    0,
  );

  const lucroHoje = lucroCorridasHoje - outrosGastosHoje;
  document.getElementById("diario-lucro").textContent =
    formatarMoeda(lucroHoje);

  const ganhoHoraHoje = horasHoje > 0 ? lucroHoje / horasHoje : 0;

  document.getElementById("diario-ganho-hora").textContent =
    formatarMoeda(ganhoHoraHoje);

  document.getElementById("diario-data").textContent =
    hoje.toLocaleDateString("pt-BR");
}

window.atualizarMeuDia = atualizarMeuDia;
