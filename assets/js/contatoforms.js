// Função para enviar mensagem via WhatsApp - #contato
function sendWhatsAppMessage() {
  const name = document.getElementById("whatsapp-name").value;
  const phone = document.getElementById("whatsapp-phone").value;
  const message = document.getElementById("whatsapp-message").value;

  if (!name || !phone || !message) {
    alert("Por favor, preencha todos os campos!");
    return;
  }

  // Número do WhatsApp da empresa (substitua pelo número correto)
  const whatsappNumber = "5511957538430";

  // Formata a mensagem
  const formattedMessage = `Olá! Tudo bem?Meu nome é ${name}. ${message}`;

  // Cria o link do WhatsApp
  const whatsappLink = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(
    formattedMessage
  )}`;

  // Abre o WhatsApp em uma nova aba
  window.open(whatsappLink, "_blank");
}
