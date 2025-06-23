// Cupom de desconto
function showCoupon(btn) {
  var coupon = btn.nextElementSibling;
  if (coupon.style.display === "none" || coupon.style.display === "") {
    coupon.style.display = "inline-block";
    btn.style.display = "none";
  }
}
