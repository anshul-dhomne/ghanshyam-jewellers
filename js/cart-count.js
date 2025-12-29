// ===== CART COUNT IN HEADER =====

function updateCartCount() {
    const countEl = document.getElementById("cartCount");
    if (!countEl) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    let totalQty = 0;
    cart.forEach(item => {
        totalQty += item.qty;
    });

    countEl.innerText = totalQty;
}

// Update on page load
document.addEventListener("DOMContentLoaded", updateCartCount);

// Update when cart changes
window.addEventListener("cartUpdated", updateCartCount);
