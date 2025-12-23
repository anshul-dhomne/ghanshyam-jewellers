// ================= PRICE CALCULATION =================

function calculatePrice(product) {

    let subtotal = 0;

    // ================= GOLD & SILVER =================
    if (product.metal === "gold" || product.metal === "silver") {

        const metalRate = getMetalRate(product.metal);
        const makingPercent = product.making_percent || 0;

        // Making charge per gram
        const makingPerGram = metalRate * (makingPercent / 100);

        // Effective rate per gram
        const finalRatePerGram = metalRate + makingPerGram;

        // Price before GST
        subtotal = finalRatePerGram * product.net_weight;
    }

    // ================= DIAMOND =================
    if (product.metal === "diamond") {

        const goldRate = getMetalRate("gold");
        const diamondRate = getMetalRate("diamond");
        const makingPercent = product.making_percent || 0;

        // Gold value
        const goldValue = goldRate * product.net_weight;

        // Diamond value
        const diamondValue = (product.diamond_weight || 0) * diamondRate;

        // Making charge on gold portion only
        const makingCharge = goldValue * (makingPercent / 100);

        subtotal = goldValue + diamondValue + makingCharge;
    }

    // ================= GST =================
    const gst = subtotal * 0.03;

    // ================= FINAL PRICE =================
    return Math.round(subtotal + gst);
}
