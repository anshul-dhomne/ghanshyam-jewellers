const cart = JSON.parse(localStorage.getItem("cart")) || [];
const orderItems = document.getElementById("orderItems");
const subtotalEl = document.getElementById("subtotal");
const gstEl = document.getElementById("gst");
const totalEl = document.getElementById("total");
const shippingEl = document.getElementById("shipping");
const payBtn = document.getElementById("placeOrder");

const RATES = {
  gold: 6200,
  silver: 75,
  diamond: 45000
};

let subtotal = 0;

// ================= RENDER CART =================
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

const gst = subtotal * 0.03;
const total = subtotal + gst;

subtotalEl.textContent = "₹ " + subtotal.toFixed(0);
gstEl.textContent = "₹ " + gst.toFixed(0);
totalEl.textContent = "₹ " + total.toFixed(0);

// ================= PAYMENT =================
payBtn.onclick = () => {

  if (!cart.length) return alert("Cart is empty");

  if (!fname.value || !phone.value)
    return alert("Please fill required details");

  const paymentType = document.querySelector('input[name="pay"]:checked').value;

  if (paymentType === "cod") {
    alert("Order placed successfully (COD)");
    localStorage.removeItem("cart");
    window.location.href = "/html/order-success.html";
    return;
  }

  const options = {
    key: "rzp_test_xxxxxxxx",
    amount: Math.round(total * 100),
    currency: "INR",
    name: "Ghanshyam Dumbhare Jewellers",
    handler: function () {
      localStorage.removeItem("cart");
      window.location.href = "/html/order-success.html";
    }
  };

  new Razorpay(options).open();
};
