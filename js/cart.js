// ================= CART PAGE SCRIPT =================

// ---------- ELEMENTS ----------
const cartList = document.getElementById("cartList");
const subtotalEl = document.getElementById("cartSubtotal");
const shippingEl = document.getElementById("cartShipping");
const totalEl = document.getElementById("cartTotal");

// ---------- CART STORAGE ----------
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ---------- RENDER CART ----------
function renderCart() {
  const cart = getCart();
  cartList.innerHTML = "";

  if (cart.length === 0) {
    cartList.innerHTML = "<p>Your cart is empty</p>";
    updateSummary([]);
    return;
  }

  cart.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "cart-item";

    row.innerHTML = `
      <img src="${item.image}" alt="${item.name}">

      <div>
        <h4>${item.name}</h4>
        <p class="cart-meta">
          <span>Metal Purity: ${item.purity}</span>
          ${item.size ? `| <span>Size: ${item.size}</span>` : ""}
        </p>
        <p class="cart-price">₹${item.price.toLocaleString("en-IN")}</p>
      </div>

      <div class="qty">
        <button class="qty-minus">-</button>
        <span>${item.qty}</span>
        <button class="qty-plus">+</button>
      </div>

      <span class="remove" title="Remove item">
        <i class="fa-solid fa-trash"></i>
      </span>
    `;

    // Quantity minus
    row.querySelector(".qty-minus").onclick = () => updateQty(index, -1);

    // Quantity plus
    row.querySelector(".qty-plus").onclick = () => updateQty(index, 1);

    // Remove item
    row.querySelector(".remove").onclick = () => removeItem(index);

    cartList.appendChild(row);
  });

  updateSummary(cart);
}

// ---------- UPDATE SUMMARY ----------
function updateSummary(cart) {
  let subtotal = 0;

  cart.forEach(item => {
    subtotal += item.price * item.qty;
  });

  // Shipping logic (simple)
  const shipping = subtotal > 0 ? 0 : 0; // FREE for now
  const total = subtotal + shipping;

  subtotalEl.innerText = "₹" + subtotal.toLocaleString("en-IN");
  shippingEl.innerText = shipping === 0 ? "FREE" : "₹" + shipping.toLocaleString("en-IN");
  totalEl.innerText = "₹" + total.toLocaleString("en-IN");
}

// ---------- UPDATE QUANTITY ----------
function updateQty(index, change) {
  const cart = getCart();
  cart[index].qty += change;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  saveCart(cart);
  renderCart();
}

// ---------- REMOVE ITEM ----------
function removeItem(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

// ---------- CHECKOUT ----------
document.getElementById("checkoutBtn").onclick = () => {
  window.location.href = "checkout.html";
};

// ---------- WHATSAPP ORDER ----------
document.getElementById("whatsappBtn").onclick = () => {
  const cart = getCart();
  if (!cart.length) return;

  let message = "🛒 Jewellery Order\n\n";

  cart.forEach(item => {
    message += `${item.name}\n`;
    message += `Purity: ${item.purity}\n`;
    if (item.size) message +=  `Size: ${item.size}\n`;
    message += `Qty: ${item.qty}\n`;
    message += `Price: ₹${item.price}\n\n`;
  });

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  message += `Total: ₹${total}`;

  window.open(
    `https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(message)}`,
    "_blank"
  );
};

// ---------- INIT ----------
renderCart();
