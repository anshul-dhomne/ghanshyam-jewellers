const cart = JSON.parse(localStorage.getItem("cart")) || [];

const orderItems = document.getElementById("orderItems");
const subtotalEl = document.getElementById("subtotal");
const gstEl = document.getElementById("gst");
const totalEl = document.getElementById("total");
const payBtn = document.getElementById("placeOrder");

const RATES = {
  gold: 6200,
  silver: 75,
  diamond: 45000
};

let subtotal = 0;

/* RENDER CART */
cart.forEach(p => {
  const qty = p.qty || 1;
  const rate = RATES[p.metal] || 0;
  const weight = p.net_weight || p.gross_weight || 0;
  const price = (rate * weight + (p.making_charge || 0)) * qty;

  subtotal += price;

  const div = document.createElement("div");
  div.className = "product";
  div.innerHTML = `
    <img src="${p.image}">
    <div>
      <strong>${p.name}</strong><br>
      <small>${p.purity}</small>
    </div>
    <span>₹ ${price.toFixed(0)}</span>
  `;
  orderItems.appendChild(div);
});

/* TOTAL CALCULATION */
const gst = subtotal * 0.03;
const total = subtotal + gst;

subtotalEl.textContent = "₹ " + subtotal.toFixed(0);
gstEl.textContent = "₹ " + gst.toFixed(0);
totalEl.textContent = "₹ " + total.toFixed(0);

/* BILLING ADDRESS TOGGLE */
const billingRadios = document.querySelectorAll('input[name="billing"]');
const billingForm = document.getElementById("billingForm");

billingRadios.forEach(radio => {
  radio.addEventListener("change", () => {
    billingForm.style.display =
      radio.value === "different" && radio.checked ? "block" : "none";
  });
});

/* PAYMENT */
payBtn.onclick = () => {
  if (!cart.length) return alert("Cart is empty");
  if (!fname.value || !phone.value) return alert("Fill required details");

  const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

  if (paymentMethod === "cod") {
    alert("Order placed successfully (COD)");
    localStorage.removeItem("cart");
    window.location.href = "/html/order-success.html";
    return;
  }

  new Razorpay({
    key: "rzp_test_xxxxxxxx",
    amount: Math.round(total * 100),
    currency: "INR",
    name: "Ghanshyam Dumbhare Jewellers",
    handler: () => {
      localStorage.removeItem("cart");
      window.location.href = "/html/order-success.html";
    }
  }).open();
};
