// ================= LOAD CART =================
const cart = JSON.parse(localStorage.getItem("cart")) || [];
const orderItems = document.getElementById("orderItems");
const subtotalEl = document.getElementById("subtotal");
const totalEl = document.getElementById("total");
const payBtn = document.getElementById("placeOrder");

// ================= RATES =================
const GOLD_RATE = 6200;
const SILVER_RATE = 75;
const DIAMOND_RATE = 45000;

// ================= PRICE CALC =================
function calculatePrice(p) {
  let rate = 0;
  if (p.metal === "gold") rate = GOLD_RATE;
  if (p.metal === "silver") rate = SILVER_RATE;
  if (p.metal === "diamond") rate = DIAMOND_RATE;

  const weight = p.net_weight ?? p.gross_weight ?? 0;
  const making = p.making_charge || 0;
  const subtotal = weight * rate + making;
  return subtotal + subtotal * 0.03;
}

// ================= RENDER SUMMARY =================
let subtotal = 0;

cart.forEach(p => {
  const div = document.createElement("div");
  div.className = "product";

  const img = document.createElement("img");
  img.src = p.image;

  const info = document.createElement("div");
  info.innerHTML = `<strong>${p.name}</strong><br><small>${p.purity}</small>`;

  const price = document.createElement("span");
  const itemTotal = calculatePrice(p) * (p.qty || 1);
  price.textContent = "₹ " + itemTotal.toFixed(0);

  subtotal += itemTotal;

  div.append(img, info, price);
  orderItems.appendChild(div);
});

subtotalEl.textContent = "₹ " + subtotal.toFixed(0);
totalEl.textContent = "₹ " + subtotal.toFixed(0);

// ================= RAZORPAY PAYMENT =================
payBtn.onclick = () => {

  if (!cart.length) {
    alert("Cart is empty");
    return;
  }

  const options = {
    key: "rzp_test_xxxxxxxx", // 🔑 YOUR KEY ID HERE
    amount: Math.round(subtotal * 100), // paise
    currency: "INR",
    name: "Ghanshyam Dumbhare Jewellers",
    description: "Jewellery Purchase",
    image: "/images/logo.PNG",

    handler: function (response) {
      alert("Payment Successful!\nPayment ID: " + response.razorpay_payment_id);

      // Clear cart
      localStorage.removeItem("cart");

      // Redirect
      window.location.href = "/html/order-success.html";
    },

    prefill: {
      name: document.getElementById("fname")?.value || "",
      contact: document.getElementById("phone")?.value || ""
    },

    theme: {
      color: "#5a2d82"
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
};
