// ================= METAL RATES =================
// Single source of truth for rates

const METAL_RATES = JSON.parse(localStorage.getItem("metalRates")) || {
    gold: 12300,     // per gram
    silver: 75,      // per gram
    diamond: 45000   // per carat
};

function getMetalRate(type) {
    return METAL_RATES[type] || 0;
}
