// ================= METAL RATES =================

const METAL_RATES = {
    gold: 12300,     // per gram
    silver: 75,      // per gram
    diamond: 45000   // per carat
};

function getMetalRate(type) {
    return METAL_RATES[type] || 0;
}
