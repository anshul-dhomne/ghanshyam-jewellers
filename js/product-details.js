// ================= PRODUCT DETAILS PAGE SCRIPT =================

// URL PARAM
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

// DOM ELEMENTS
const productImage = document.getElementById("productImage");
const productTitle = document.getElementById("productTitle");
const productPrice = document.getElementById("productPrice");

const netWeightEl = document.getElementById("netWeight");
const grossWeightEl = document.getElementById("grossWeight");

const metalPriceEl = document.getElementById("metalPrice");
const diamondPriceEl = document.getElementById("diamondPrice");
const makingChargeEl = document.getElementById("makingCharge");
const gstPriceEl = document.getElementById("gstPrice");
const totalPriceEl = document.getElementById("totalPrice");

const puritySelect = document.getElementById("puritySelect");
const productInfo = document.getElementById("productInfo");
const whatsappLink = document.getElementById("whatsappLink");

// ================= LOAD PRODUCTS =================
fetch("/data/products.json")
  .then(res => res.json())
  .then(data => {

    let allProducts = [];

    // Flatten JSON
    Object.values(data).forEach(metal =>
      Object.values(metal).forEach(group =>
        allProducts.push(...group)
      )
    );

    const product = allProducts.find(p => p.id == productId);

    if (!product) {
      productTitle.innerText = "Product Not Found";
      return;
    }

    // ================= BASIC DETAILS =================
    productImage.src = Array.isArray(product.image) ? product.image[0] : product.image;
    productTitle.innerText = product.name;

    netWeightEl.innerText = product.net_weight.toFixed(2);
    grossWeightEl.innerText = product.gross_weight.toFixed(2);

    productInfo.innerText = product.product_code;

    // ================= PURITY =================
    puritySelect.innerHTML = "";
    const option = document.createElement("option");
    option.value = product.purity;
    option.textContent = product.purity;
    puritySelect.appendChild(option);

    // ================= PRICE =================
    const total = calculatePrice(product);

    productPrice.innerText = `₹ ${total.toLocaleString("en-IN")}`;
    totalPriceEl.innerText = `₹ ${total.toLocaleString("en-IN")}`;

    // ================= PRICE BREAKUP =================
    let metalPrice = 0;
    let diamondPrice = 0;
    let makingCharge = 0;

    if (product.metal === "gold" || product.metal === "silver") {
        const rate = getMetalRate(product.metal);
        const makingPercent = product.making_percent || 0;
        metalPrice = rate * product.net_weight;
        makingCharge = metalPrice * (makingPercent / 100);
    }

    if (product.metal === "diamond") {
        const goldRate = getMetalRate("gold");
        const diamondRate = getMetalRate("diamond");
        metalPrice = goldRate * product.net_weight;
        diamondPrice = (product.diamond_weight || 0) * diamondRate;
        makingCharge = metalPrice * ((product.making_percent || 0) / 100);
    }

    const gst = (metalPrice + diamondPrice + makingCharge) * 0.03;

    metalPriceEl.innerText = `₹ ${Math.round(metalPrice).toLocaleString("en-IN")}`;
    diamondPriceEl.innerText = `₹ ${Math.round(diamondPrice).toLocaleString("en-IN")}`;
    makingChargeEl.innerText = `₹ ${Math.round(makingCharge).toLocaleString("en-IN")}`;
    gstPriceEl.innerText = `₹ ${Math.round(gst).toLocaleString("en-IN")}`;

    // ================= WHATSAPP =================
    whatsappLink.href =
      `https://wa.me/91XXXXXXXXXX?text=Hello, I am interested in ${product.name} (Code: ${product.product_code})`;

  })
  .catch(err => console.error("Product details error:", err));
