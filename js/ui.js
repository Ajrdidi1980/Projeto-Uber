// ===== TROCAR TELA =====
function trocarTela(id, el) {
  // esconder telas
  document.querySelectorAll(".tela").forEach((t) => (t.style.display = "none"));

  // mostrar tela selecionada
  document.getElementById(id).style.display = "block";
  // Atualiza navegação inferior
  document
    .querySelectorAll(".bottom-nav .nav-item")
    .forEach((b) => b.classList.remove("ativo"));

  const idNav = id === "gastos" ? "mais" : id;
  const botao = document.getElementById("nav-" + idNav);

  if (botao) {
    botao.classList.add("ativo");
  }

  // remover ativo
  document
    .querySelectorAll(".sidebar button")
    .forEach((b) => b.classList.remove("ativo"));

  // adiciona ativo
  const botaoSidebar = document.getElementById("btn-" + id);

  if (botaoSidebar) {
    botaoSidebar.classList.add("ativo");
  }
  // atualizar resumo
  if (id === "resumo") {
    atualizar();

    setTimeout(() => {
      atualizar();

      window.dispatchEvent(new Event("resize"));
    }, 150);
  }
  if (id === "diario") {
    atualizarMeuDia();
  }
}
window.atualizarStatusTeste = async function () {
  const elemento = document.getElementById("status-teste");

  if (!elemento) {
    return;
  }

  const resultado = await window.verificarTesteGratis();

  if (!resultado) {
    elemento.style.display = "none";
    return;
  }

  elemento.style.display = "block";

  if (resultado.testeAtivo) {
    const textoDias =
      resultado.diasRestantes === 1
        ? "1 dia restante"
        : `${resultado.diasRestantes} dias restantes`;

    elemento.textContent = `🎁 Período de teste grátis — ${textoDias}`;
  } else {
    elemento.textContent = "⏰ Seu período de teste grátis terminou.";
  }
};
document.getElementById("btn-assinar")?.addEventListener("click", () => {
  window.open("https://mpago.la/2pqQDbv", "_blank");
});
window.trocarTela = trocarTela;
