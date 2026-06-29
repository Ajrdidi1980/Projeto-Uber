// ==========================================
// FILTROS.JS
// Responsável pelos períodos dos relatórios
// ==========================================

function obterPeriodo(tipo) {
  const hoje = new Date();

  switch (tipo) {
    case "hoje": {
      const data = hoje.toISOString().split("T")[0];

      return {
        inicio: data,
        fim: data,
      };
    }

    case "semana": {
      const inicio = new Date();
      inicio.setDate(hoje.getDate() - 7);

      return {
        inicio: inicio.toISOString().split("T")[0],
        fim: hoje.toISOString().split("T")[0],
      };
    }

    case "mes": {
      const inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

      return {
        inicio: inicio.toISOString().split("T")[0],
        fim: hoje.toISOString().split("T")[0],
      };
    }

    default:
      return {
        inicio: "",
        fim: "",
      };
  }
}
function filtrarReceitas(receitas, periodo) {
  return receitas;
}

window.obterPeriodo = obterPeriodo;
window.filtrarReceitas = filtrarReceitas;
