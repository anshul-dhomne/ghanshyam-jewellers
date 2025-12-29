// ===== GLOBAL CART UTILITIES =====

function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));

    // 🔔 Notify header & other pages
    window.dispatchEvent(new Event("cartUpdated"));
}
