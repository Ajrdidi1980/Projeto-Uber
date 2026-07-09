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

  const botao = document.getElementById("nav-" + id);

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
window.trocarTela = trocarTela;
