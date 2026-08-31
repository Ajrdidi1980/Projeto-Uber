// ==========================================
// FILTROS.JS
// Responsável pelos períodos dos relatórios
// ==========================================

function obterPeriodo(tipo) {
  const hoje = new Date();
  console.log("Hoje ISO:", hoje.toISOString().split("T")[0]);
  console.log("Hoje Local:", hoje.toLocaleDateString("pt-BR"));

  switch (tipo) {
    case "hoje": {
      const data = hoje.toLocaleDateString("sv-SE");

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
function formatarDataBR(dataISO) {
  if (!dataISO) return "";

  const [ano, mes, dia] = dataISO.split("-");

  return `${dia}/${mes}/${ano}`;
}

function obterTextoPeriodo(periodo) {
  if (periodo === "tudo") {
    if (receitas.length === 0) {
      return "Sem registros";
    }

    const datas = receitas.map((r) => converterDataISO(r.data)).sort();

    return `${formatarDataBR(datas[0])} a ${formatarDataBR(datas[datas.length - 1])}`;
  }

  const { inicio, fim } = obterPeriodo(periodo);

  if (inicio === fim) {
    return formatarDataBR(inicio);
  }

  return `${formatarDataBR(inicio)} a ${formatarDataBR(fim)}`;
}
function obterNomePeriodo(periodo) {
  switch (periodo) {
    case "hoje":
      return "Hoje";

    case "semana":
      return "Últimos 7 dias";

    case "mes":
      return "Mês atual";

    case "tudo":
    default:
      return "Todo o histórico";
  }
}
function filtrarReceitas(receitas, periodo) {
  switch (periodo) {
    case "hoje": {
      const hoje = obterPeriodo("hoje");

      return receitas.filter((receita) => {
        return converterDataISO(receita.data) === hoje.inicio;
      });
    }
    case "semana": {
      const semana = obterPeriodo("semana");

      return receitas.filter((receita) => {
        const data = converterDataISO(receita.data);

        return data >= semana.inicio && data <= semana.fim;
      });
    }
    case "mes": {
      const mes = obterPeriodo("mes");

      return receitas.filter((receita) => {
        const data = converterDataISO(receita.data);

        return data >= mes.inicio && data <= mes.fim;
      });
    }

    case "tudo":
    default:
      return receitas;
  }
}
function filtrarGastos(gastos, periodo) {
  switch (periodo) {
    case "hoje": {
      const hoje = obterPeriodo("hoje");

      return gastos.filter((gasto) => {
        return converterDataISO(gasto.data) === hoje.inicio;
      });
    }

    case "semana": {
      const semana = obterPeriodo("semana");

      return gastos.filter((gasto) => {
        const data = converterDataISO(gasto.data);

        return data >= semana.inicio && data <= semana.fim;
      });
    }

    case "mes": {
      const mes = obterPeriodo("mes");

      return gastos.filter((gasto) => {
        const data = converterDataISO(gasto.data);

        return data >= mes.inicio && data <= mes.fim;
      });
    }

    case "tudo":
    default:
      return gastos;
  }
}
window.obterNomePeriodo = obterNomePeriodo;
window.obterTextoPeriodo = obterTextoPeriodo;
window.obterPeriodo = obterPeriodo;
window.filtrarReceitas = filtrarReceitas;
window.filtrarGastos = filtrarGastos;
