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

          backgroundColor: "rgba(34, 197, 94, 0.75)",

          borderColor: "#22c55e",

          borderWidth: 2,

          borderRadius: 6,

          borderSkipped: false,

          hoverBackgroundColor: "rgba(34, 197, 94, 1)",

          hoverBorderColor: "#4ade80",
        },
      ],
    },
    options: {
      responsive: true,

      maintainAspectRatio: false,

      plugins: {
        legend: {
          labels: {
            color: "#e2e8f0",

            font: {
              size: 12,
            },
          },
        },

        tooltip: {
          backgroundColor: "rgba(15, 23, 42, 0.95)",

          titleColor: "#fff",

          bodyColor: "#e2e8f0",

          borderColor: "rgba(34, 197, 94, 0.3)",

          borderWidth: 1,

          padding: 10,
        },
      },

      scales: {
        x: {
          grid: {
            display: false,
          },

          ticks: {
            color: "#94a3b8",
          },
        },

        y: {
          grid: {
            color: "rgba(255,255,255,0.04)",
          },

          ticks: {
            color: "#94a3b8",
          },
        },
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

          backgroundColor: [
            "rgba(34, 197, 94, 0.9)",
            "rgba(239, 68, 68, 0.9)",
            "rgba(59, 130, 246, 0.9)",
          ],

          borderColor: ["#22c55e", "#ef4444", "#3b82f6"],

          borderWidth: 2,

          hoverOffset: 12,
        },
      ],
    },

    options: {
      responsive: true,

      maintainAspectRatio: false,

      animation: {
        animateRotate: true,
        duration: 1200,
      },

      plugins: {
        legend: {
          position: "bottom",

          labels: {
            color: "#e2e8f0",

            padding: 20,

            font: {
              size: 13,
              weight: "bold",
            },
          },
        },

        tooltip: {
          backgroundColor: "rgba(15, 23, 42, 0.95)",

          titleColor: "#fff",

          bodyColor: "#e2e8f0",

          borderColor: "rgba(255,255,255,0.08)",

          borderWidth: 1,

          padding: 12,
        },
      },
    },
  });
}
window.atualizarGrafico = atualizarGrafico;
window.atualizarGraficoPizza = atualizarGraficoPizza;
