// Notificação de Cookies
document.addEventListener("DOMContentLoaded", function () {
  var cookieBox = document.getElementById("cookie-notification");
  var acceptBtn = document.getElementById("accept-cookies");
  // Verifica se já aceitou
  if (!localStorage.getItem("cookiesAccepted")) {
    setTimeout(function () {
      cookieBox.classList.add("show");
    }, 600); // pequeno delay para UX
  }
  acceptBtn.addEventListener("click", function () {
    localStorage.setItem("cookiesAccepted", "true");
    cookieBox.classList.remove("show");
  });
});
