// ChatBot FAQ Profissional e Responsivo com reconhecimento de palavras-chave
const faqData = [
  {
    question: "Quais são as formas de pagamento?",
    answer:
      "Aceitamos Pix, boleto bancário e cartões de crédito das principais bandeiras.",
    keywords: [
      "pagamento",
      "pagar",
      "pix",
      "boleto",
      "cartão",
      "cartoes",
      "cartão de crédito",
      "formas de pagamento",
    ],
  },
  {
    question: "Quanto tempo leva para meu pedido chegar?",
    answer:
      "O prazo de entrega varia entre 3 a 10 dias úteis, dependendo da sua localidade.",
    keywords: [
      "prazo",
      "entrega",
      "chegar",
      "tempo",
      "frete",
      "dias",
      "quando",
    ],
  },
  {
    question: "Posso trocar um produto?",
    answer:
      "Sim, você tem até 7 dias após o recebimento para solicitar a troca.",
    keywords: ["troca", "trocar", "devolver", "devolução", "produto"],
  },
  {
    question: "Como acompanhar meu pedido?",
    answer:
      "Você receberá um link de rastreamento por e-mail assim que seu pedido for enviado conforme a página do parceiro.",
    keywords: [
      "acompanhar",
      "rastrear",
      "rastreamento",
      "pedido",
      "enviado",
      "status",
    ],
  },
  {
    question: "Vocês têm loja física?",
    answer:
      "Atualmente operamos apenas online para oferecer melhores preços e agilidade.",
    keywords: [
      "loja física",
      "loja",
      "presencial",
      "endereço",
      "local",
      "fisica",
    ],
  },
  {
    question: "Os produtos têm garantia?",
    answer:
      "Sim, todos os produtos possuem garantia mínima de 3 meses contra defeitos de fabricação. Essa informação pode variar dependendo do fornecedor de cada produto de parceiros.",
    keywords: ["garantia", "defeito", "problema", "troca", "assistência"],
  },
  {
    question: "Como posso falar com o suporte?",
    answer:
      'Você pode nos contatar pelo <a href="https://api.whatsapp.com/send?phone=5511957538430" target="_blank" style="color:#25D366;font-weight:600;text-decoration:underline;">WhatsApp</a>, <a href="mailto:nexoraonlinebrasil@gmail.com" style="color:#4820fc;font-weight:600;text-decoration:underline;">e-mail</a> ou pelo <a href="https://www.nexoraonline.com.br#contact" style="color:#4820fc;font-weight:600;text-decoration:underline;">formulário de contato do site</a>.',
    keywords: [
      "suporte",
      "contato",
      "falar",
      "ajuda",
      "atendimento",
      "whatsapp",
      "email",
    ],
  },
];

const WHATSAPP_NUMBER = "5511957538430";

// Elementos
const chatbotButton = document.getElementById("chatbot-button");
let chatbotWindow = document.getElementById("faq-chatbot");

// Novo HTML do ChatBot
if (chatbotWindow) {
  chatbotWindow.innerHTML = `
    <div class="faq-chatbot-header">
      <span><i class='bx bxs-bot' style='font-size:22px;vertical-align:middle;'></i> Atendimento Virtual</span>
      <button class="close-btn" aria-label="Fechar" tabindex="0">&times;</button>
    </div>
    <div class="faq-chatbot-messages" id="faq-messages"></div>
    <div class="faq-chatbot-suggestions" id="faq-suggestions"></div>
    <form class="faq-chatbot-input" id="faq-form" autocomplete="off">
      <input type="text" id="faq-input" placeholder="Digite sua dúvida ou escolha uma sugestão..." aria-label="Digite sua dúvida" autocomplete="off" />
      <button type="submit" aria-label="Enviar"><i class='bx bx-send'></i></button>
    </form>
  `;
}

const faqMessages = document.getElementById("faq-messages");
const faqSuggestions = document.getElementById("faq-suggestions");
const faqForm = document.getElementById("faq-form");
const faqInput = document.getElementById("faq-input");
const closeBtn = document.querySelector(".faq-chatbot-header .close-btn");

// Função para adicionar bolha de mensagem
function addBubble(text, sender = "bot") {
  const bubble = document.createElement("div");
  bubble.className = `faq-bubble ${sender}`;
  bubble.innerHTML = text;
  faqMessages.appendChild(bubble);
  faqMessages.scrollTop = faqMessages.scrollHeight;
}

// Mensagem de boas-vindas
function welcomeMessage() {
  addBubble(
    "Olá! Sou o assistente virtual. Como posso ajudar? Escolha uma dúvida abaixo ou digite sua pergunta."
  );
}

// Exibir sugestões de perguntas
function showSuggestions() {
  faqSuggestions.innerHTML = "";
  faqData.forEach((item, idx) => {
    const btn = document.createElement("button");
    btn.className = "faq-suggestion-btn";
    btn.textContent = item.question;
    btn.type = "button";
    btn.tabIndex = 0;
    btn.onclick = () => handleQuestion(item.question);
    faqSuggestions.appendChild(btn);
  });
}

// Lógica para responder perguntas com reconhecimento de palavra-chave
function handleQuestion(question) {
  addBubble(question, "user");
  // Busca exata
  let found = faqData.find(
    (item) => item.question.toLowerCase() === question.toLowerCase()
  );
  // Busca por palavra-chave
  if (!found) {
    const lower = question.toLowerCase();
    found = faqData.find(
      (item) => item.keywords && item.keywords.some((kw) => lower.includes(kw))
    );
  }
  setTimeout(() => {
    if (found) {
      addBubble(found.answer, "bot");
    } else {
      // Mensagem padrão com link WhatsApp
      const whatsappLink = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(
        "Olá! Tenho uma dúvida: " + question
      )}`;
      addBubble(
        `Desculpe, não encontrei uma resposta para essa dúvida. Tente uma das sugestões abaixo ou <a href="${whatsappLink}" target="_blank" style="color:#25D366;font-weight:600;text-decoration:underline;">fale conosco no WhatsApp</a>.`,
        "bot"
      );
    }
  }, 400);
}

// Evento de envio do formulário
if (faqForm) {
  faqForm.onsubmit = (e) => {
    e.preventDefault();
    const value = faqInput.value.trim();
    if (value) {
      handleQuestion(value);
      faqInput.value = "";
    }
  };
}

// Botão de fechar
if (closeBtn) {
  closeBtn.onclick = () => {
    chatbotWindow.style.display = "none";
  };
}

// Botão flutuante abre o chatbot
if (chatbotButton) {
  chatbotButton.onclick = () => {
    chatbotWindow.style.display =
      chatbotWindow.style.display === "none" ||
      chatbotWindow.style.display === ""
        ? "flex"
        : "none";
    if (chatbotWindow.style.display === "flex") {
      faqMessages.innerHTML = "";
      welcomeMessage();
      showSuggestions();
      faqInput.focus();
    }
  };
}

// Acessibilidade: fechar com ESC
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && chatbotWindow.style.display !== "none") {
    chatbotWindow.style.display = "none";
  }
});

// Inicialização
if (chatbotWindow && chatbotWindow.style.display !== "none") {
  welcomeMessage();
  showSuggestions();
}
