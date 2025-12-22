// ================= CART PAGE SCRIPT =================

// TEMP METAL RATES (ADMIN LATER)
const rate = getMetalRate(item.metal);
const price = rate * item.net_weight + item.making_charge;


// ================= PRICE CALCULATION =================
function calculateItemPrice(product) {
    let rate = 0;

    if (product.metal === "gold") rate = GOLD_RATE;
    if (product.metal === "silver") rate = SILVER_RATE;
    if (product.metal === "diamond") rate = DIAMOND_RATE;

    const weight = product.net_weight ?? product.gross_weight ?? 0;
    const making = product.making_charge || 0;

    const metalPrice = weight * rate;
    const subtotal = metalPrice + making;
    const gst = subtotal * 0.03;

    return subtotal + gst;
}

// ================= RENDER CART =================
function renderCart() {
    cartItemsEl.innerHTML = "";

    if (!cart.length) {
        cartItemsEl.textContent = "Your cart is empty.";
        subtotalEl.textContent = "₹ 0";
        gstEl.textContent = "₹ 0";
        totalEl.textContent = "₹ 0";
        return;
    }

    let subtotal = 0;
    let gst = 0;

    cart.forEach((item, index) => {
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        // IMAGE
        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.name;

        // DETAILS
        const details = document.createElement("div");

        const name = document.createElement("h4");
        name.textContent = item.name;

        const weight = document.createElement("p");
        weight.textContent = `Weight: ${item.net_weight ?? item.gross_weight} g`;

        const price = calculateItemPrice(item);
        subtotal += (price / 1.03) * item.qty;
        gst += ((price / 1.03) * 0.03) * item.qty;

        const priceText = document.createElement("p");
        priceText.textContent = `Price: ₹ ${price.toFixed(0)}`;

        details.append(name, weight, priceText);

        // QUANTITY
        const qty = document.createElement("div");
        qty.className = "qty";

        const minus = document.createElement("button");
        minus.textContent = "-";
        minus.onclick = () => updateQty(index, -1);

        const count = document.createElement("span");
        count.textContent = item.qty;

        const plus = document.createElement("button");
        plus.textContent = "+";
        plus.onclick = () => updateQty(index, 1);

        qty.append(minus, count, plus);

        // REMOVE
        const remove = document.createElement("div");
        remove.className = "remove";
        remove.innerHTML = `<i class="fa fa-trash"></i>`;
        remove.onclick = () => removeItem(index);

        cartItem.append(img, details, qty, remove);
        cartItemsEl.appendChild(cartItem);
    });

    subtotalEl.textContent = `₹ ${subtotal.toFixed(0)}`;
    gstEl.textContent = `₹ ${gst.toFixed(0)}`;
    totalEl.textContent = `₹ ${(subtotal + gst).toFixed(0)}`;
}

// ================= ACTIONS =================
function updateQty(index, change) {
    cart[index].qty += change;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    saveCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

// ================= WHATSAPP ORDER =================
whatsappBtn.onclick = () => {
    let message = "Hello Ghanshyam Dumbhare Jewellers,%0A%0AOrder Details:%0A";

    cart.forEach(item => {
        message += `${item.name} (%0AWeight: ${item.net_weight}g, Qty: ${item.qty})%0A%0A`;
    });

    message += `Total: ${totalEl.textContent}`;

    window.open(`https://wa.me/91XXXXXXXXXX?text=${message}`, "_blank");
};

renderCart();
