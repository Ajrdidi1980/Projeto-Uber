// ===== GRÁFICO =====
function atualizarGrafico(dadosPorDia) {
  const canvas = document.getElementById("grafico");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (grafico) {
    grafico.destroy();
  }

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
        x: { ticks: { color: "#fff" } },
        y: { ticks: { color: "#fff" } },
      },
    },
  });
}
function atualizarGraficoPizza(receitas, gastos, reserva) {
  const canvas = document.getElementById("graficoPizza");

  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (graficoPizza) {
    graficoPizza.destroy();
  }

  graficoPizza = new Chart(ctx, {
    type: "pie",

    data: {
      labels: ["Receitas", "Gastos", "Reserva"],

      datasets: [
        {
          data: [receitas, gastos, reserva],

          backgroundColor: ["#22c55e", "#ef4444", "#3b82f6"],
        },
      ],
    },

    options: {
      plugins: {
        legend: {
          labels: {
            color: "#fff",
          },
        },
      },
    },
  });
}
window.atualizarGrafico = atualizarGrafico;
window.atualizarGraficoPizza = atualizarGraficoPizza;
