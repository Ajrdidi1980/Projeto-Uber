let grafico = null;
let graficoPizza = null;

// ===== GRÁFICO =====
function atualizarGrafico(dadosPorDia) {
  const canvas = document.getElementById("grafico");
  console.log("Canvas:", canvas);
  console.log("Chart:", typeof Chart);
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (grafico) {
    grafico.destroy();
  }

  grafico = new Chart(ctx, {
    type: "bar",

    data: {
      labels: Object.keys(dadosPorDia),

      datasets: [
        {
          label: "Ganhos",

          data: Object.values(dadosPorDia),

          backgroundColor: "#16a34a",

          borderColor: "#15803d",

          borderWidth: 2,
        },
      ],
    },

    options: {
      responsive: true,

      maintainAspectRatio: false,

      scales: {
        y: {
          beginAtZero: true,

          ticks: {
            color: document.body.classList.contains("dark")
              ? "#f3f4f6"
              : "#111827",
          },

          grid: {
            color: document.body.classList.contains("dark")
              ? "#374151"
              : "#dddddd",
          },
        },

        x: {
          ticks: {
            color: document.body.classList.contains("dark")
              ? "#f3f4f6"
              : "#111827",
          },

          grid: {
            display: false,
          },
        },
      },

      plugins: {
        legend: {
          labels: {
            color: "#f3f4f6",
            usePointStyle: true,
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

        legend: {
          position: "bottom",

          labels: {
            color: document.body.classList.contains("dark")
              ? "#f3f4f6"
              : "#111827",

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
