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

    productInfo.innerHTML = `
  <strong>Product Code:</strong> ${product.product_code}<br>
  <span>${product.product_desc || ""}</span>
`;



    // ================= PURITY =================
    puritySelect.innerHTML = `<option>${product.purity}</option>`;

    // ================= PRICE =================
    const total = calculatePrice(product);
    productPrice.innerText = `₹ ${total.toLocaleString("en-IN")}`;
    totalPriceEl.innerText = `₹ ${total.toLocaleString("en-IN")}`;

    // ================= PINCODE CHECK (INLINE MESSAGE) =================
    const pincodeInput = document.querySelector(".pincode-wrapper input");
    const pincodeButton = document.querySelector(".pincode-wrapper button");
    const pincodeMessage = document.getElementById("pincodeMessage");

    const serviceablePincodes = [
      "441912",
      "440001",
      "441104",
      "441904"
    ];

    pincodeButton.addEventListener("click", () => {
      const pin = pincodeInput.value.trim();

      if (!/^\d{6}$/.test(pin)) {
        pincodeMessage.textContent = "Please enter a valid 6-digit pincode";
        pincodeMessage.style.color = "#c0392b"; // red
        return;
      }

      if (serviceablePincodes.includes(pin)) {
        pincodeMessage.textContent = "✔ Delivery available to this location";
        pincodeMessage.style.color = "#27ae60"; // green
      } else {
        pincodeMessage.textContent = "✖ Delivery not available to this location";
        pincodeMessage.style.color = "#c0392b"; // red
      }
    });

    // ================= SIZE LOGIC =================
    const sizeRow = document.getElementById("sizeRow");
    const sizeSelect = document.getElementById("sizeSelect");

    if (product.size && Array.isArray(product.size) && product.size.length) {
      sizeRow.style.display = "grid";
      sizeSelect.innerHTML = "";

      product.size.forEach(s => {
        const opt = document.createElement("option");
        opt.value = s;
        opt.textContent = s;
        sizeSelect.appendChild(opt);
      });
    } else {
      sizeRow.style.display = "none";
    }

    // ================= PRICE BREAKUP =================
    let metalPrice = 0;
    let diamondPrice = 0;
    let makingCharge = 0;

    if (product.metal === "gold" || product.metal === "silver") {
      const rate = getMetalRate(product.metal);
      metalPrice = rate * product.net_weight;
      makingCharge = metalPrice * ((product.making_percent || 0) / 100);
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