// Tooltip do ChatBot
const chatbotBtn = document.getElementById("chatbot-button");
const chatbotTooltip = document.getElementById("chatbot-tooltip");
if (chatbotBtn && chatbotTooltip) {
  function showTooltip() {
    chatbotTooltip.classList.add("show");
  }
  function hideTooltip() {
    chatbotTooltip.classList.remove("show");
  }
  chatbotBtn.addEventListener("mouseenter", showTooltip);
  chatbotBtn.addEventListener("mouseleave", hideTooltip);
  chatbotBtn.addEventListener("focus", showTooltip);
  chatbotBtn.addEventListener("blur", hideTooltip);
  // Mobile: mostra ao tocar, esconde ao abrir o chat
  chatbotBtn.addEventListener("touchstart", showTooltip);
  chatbotBtn.addEventListener("touchend", hideTooltip);
  // Esconde tooltip ao abrir o chat
  chatbotBtn.addEventListener("click", hideTooltip);
}
