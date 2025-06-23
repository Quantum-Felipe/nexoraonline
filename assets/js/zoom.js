// Função para inicializar o zoom nas imagens dos produtos
function initializeZoom() {
  const productImages = document.querySelectorAll(".product-image");

  productImages.forEach((img) => {
    const container = img.parentElement;

    // Função para alternar o zoom
    function toggleZoom(e) {
      e.preventDefault();
      container.classList.toggle("zoomed");
    }

    // Adicionar eventos de clique/toque
    container.addEventListener("click", toggleZoom);
    container.addEventListener("touchend", toggleZoom);

    // Remover zoom ao mover o mouse para fora da imagem
    container.addEventListener("mouseleave", () => {
      container.classList.remove("zoomed");
    });
  });
}

// Inicializar o zoom quando a página carregar
document.addEventListener("DOMContentLoaded", initializeZoom);

// Adicionar elementos de zoom automaticamente
document.addEventListener("DOMContentLoaded", function () {
  const containers = document.querySelectorAll(".product-image-container");

  containers.forEach((container) => {
    // Verificar se os elementos de zoom já existem
    if (!container.querySelector(".zoom-lens")) {
      const lens = document.createElement("div");
      lens.className = "zoom-lens";
      container.appendChild(lens);
    }

    if (!container.querySelector(".zoom-result")) {
      const result = document.createElement("div");
      result.className = "zoom-result";
      container.appendChild(result);
    }
  });
});
