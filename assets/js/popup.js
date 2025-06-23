(function () {
  // Configurações do WhatsApp
  const WHATSAPP_NUMBER = "558191959369";
  // Gatilho: 'immediate', 'timed', 'scroll', 'exit'
  const TRIGGER = "timed"; // Altere aqui para o gatilho desejado
  const TRIGGER_DELAY = 5000; // ms para 'timed'
  let popupShown = false;
  const overlay = document.getElementById("popupOverlayMkt");
  const closeBtn = document.getElementById("closePopupMkt");
  const noThanks = document.getElementById("noThanksMkt");
  const form = document.getElementById("mktForm");

  function showPopup() {
    if (!popupShown) {
      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
      popupShown = true;
    }
  }
  function closePopup() {
    overlay.classList.remove("active");
    document.body.style.overflow = "auto";
  }
  closeBtn.addEventListener("click", closePopup);
  noThanks.addEventListener("click", closePopup);
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closePopup();
  });

  // Gatilhos de exibição
  if (TRIGGER === "immediate") showPopup();
  if (TRIGGER === "timed") setTimeout(showPopup, TRIGGER_DELAY);
  if (TRIGGER === "scroll") {
    window.addEventListener("scroll", function scrollTrigger() {
      const scrolled = window.scrollY,
        wh = window.innerHeight,
        dh = document.documentElement.scrollHeight;
      if (scrolled > (dh - wh) * 0.5) {
        showPopup();
        window.removeEventListener("scroll", scrollTrigger);
      }
    });
  }
  if (TRIGGER === "exit") {
    document.addEventListener("mouseleave", function exitIntent(e) {
      if (e.clientY < 20) {
        showPopup();
        document.removeEventListener("mouseleave", exitIntent);
      }
    });
  }

  // Envio para WhatsApp
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const nome = document.getElementById("mktNome").value.trim();
    const email = document.getElementById("mktEmail").value.trim();
    const fone = document.getElementById("mktFone")
      ? document.getElementById("mktFone").value.trim()
      : "";
    ("");

    // Envia para Google Sheets
    fetch(
      "https://script.google.com/macros/s/AKfycbwlng1eL0IkPuAN3ko84OrIAJlJLf2E9-2XexM4RL4rGgrrjEKfl1ZhCfu6ultrBl3TPA/exec",

      {
        method: "POST",
        body: JSON.stringify({ nome, email, fone }),
        headers: { "Content-Type": "application/json" },
        mode: "no-cors",
      }
    )
      .then(() => {
        // Exibe mensagem de sucesso no pop-up
        const successMsg = document.createElement("div");
        successMsg.style.color = "#2ecc71";
        successMsg.style.margin = "15px 0";
        successMsg.style.fontWeight = "bold";
        successMsg.textContent =
          "Dados enviados com sucesso! Em breve entraremos em contato.";
        form.parentNode.insertBefore(successMsg, form.nextSibling);
        form.reset();
        // Opcional: fecha o pop-up após alguns segundos
        setTimeout(closePopup, 2500);
      })
      .catch(() => {
        // Exibe mensagem de erro no pop-up
        const errorMsg = document.createElement("div");
        errorMsg.style.color = "#e74c3c";
        errorMsg.style.margin = "15px 0";
        errorMsg.style.fontWeight = "bold";
        errorMsg.textContent = "Erro ao enviar os dados. Tente novamente.";
        form.parentNode.insertBefore(errorMsg, form.nextSibling);
      });
  });
})();
