// ================= PRODUCT DETAILS PAGE SCRIPT =================

// ---------- URL PARAM ----------
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

// ---------- DOM ELEMENTS ----------
const productImage = document.getElementById("productImage");
const productImageWrapper = document.querySelector(".product-image");
const thumbnailList = document.getElementById("thumbnailList");

const productTitle = document.getElementById("productTitle");
const productPrice = document.getElementById("productPrice");

const netWeightEl = document.getElementById("netWeight");
const grossWeightEl = document.getElementById("grossWeight");

const metalPriceEl = document.getElementById("metalPrice");
const diamondPriceEl = document.getElementById("diamondPrice");
const makingChargeEl = document.getElementById("makingCharge");
const gstPriceEl = document.getElementById("gstPrice");
const totalPriceEl = document.getElementById("totalPrice");

const purityValue = document.getElementById("purityValue");
const whatsappLink = document.getElementById("whatsappLink");

// ---------- LOAD PRODUCTS ----------
fetch("/data/products.json")
  .then(res => res.json())
  .then(data => {

    // ---------- FLATTEN JSON ----------
    let allProducts = [];
    Object.values(data).forEach(metal =>
      Object.values(metal).forEach(group =>
        allProducts.push(...group))
    );

    // ---------- FIND PRODUCT ----------
    const product = allProducts.find(p => p.id == productId);
    if (!product) {
      productTitle.innerText = "Product Not Found";
      return;
    }

    // ---------- IMAGE LOGIC ----------
    const images = Array.isArray(product.image)
      ? product.image
      : [product.image];

    productImage.src = images[0];

    if (images.length > 1) {
      thumbnailList.innerHTML = "";
      thumbnailList.style.display = "flex";
      productImageWrapper.classList.remove("full-width");

      images.forEach((src, index) => {
        const thumb = document.createElement("img");
        thumb.src = src;

        if (index === 0) thumb.classList.add("active");

        thumb.addEventListener("click", () => {
          document
            .querySelectorAll("#thumbnailList img")
            .forEach(i => i.classList.remove("active"));

          thumb.classList.add("active");
          productImage.src = src;
        });

        thumbnailList.appendChild(thumb);
      });
    } else {
      thumbnailList.style.display = "none";
      productImageWrapper.classList.add("full-width");
    }

    // ---------- BASIC DETAILS ----------
    productTitle.innerText = product.name;
    netWeightEl.innerText = product.net_weight.toFixed(2);
    grossWeightEl.innerText = product.gross_weight.toFixed(2);

    // ---------- PURITY (TEXT ONLY FROM JSON) ----------
    purityValue.innerText = product.purity;

    // ---------- SIZE LOGIC ----------
    const sizeRow = document.getElementById("sizeRow");
    const sizeSelect = document.getElementById("sizeSelect");

    if (product.size && Array.isArray(product.size) && product.size.length) {
      sizeRow.style.display = "block";
      sizeSelect.innerHTML = `<option value="">Select Size</option>`;

      product.size.forEach(s => {
        const opt = document.createElement("option");
        opt.value = s;
        opt.textContent = s;
        sizeSelect.appendChild(opt);
      });
    } else {
      sizeRow.style.display = "none";
    }

    // ---------- PRICE CALCULATION ----------
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
    const finalPrice = Math.round(
      metalPrice + diamondPrice + makingCharge + gst
    );

    metalPriceEl.innerText = `₹ ${Math.round(metalPrice).toLocaleString("en-IN")}`;
    diamondPriceEl.innerText = `₹ ${Math.round(diamondPrice).toLocaleString("en-IN")}`;
    makingChargeEl.innerText = `₹ ${Math.round(makingCharge).toLocaleString("en-IN")}`;
    gstPriceEl.innerText = `₹ ${Math.round(gst).toLocaleString("en-IN")}`;
    productPrice.innerText = `₹ ${finalPrice.toLocaleString("en-IN")}`;
    totalPriceEl.innerText = `₹ ${finalPrice.toLocaleString("en-IN")}`;

    // ---------- ADD TO CART (GLOBAL COUNT SUPPORTED) ----------
    document.getElementById("addToCartBtn").addEventListener("click", () => {

      let selectedSize = null;
      if (sizeRow.style.display !== "none" && sizeSelect.value) {
        selectedSize = sizeSelect.value;
      }

      const cart = getCart();

      const existing = cart.find(
        item =>
          item.id === product.id &&
          item.purity === product.purity &&
          item.size === selectedSize
      );

      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          image: images[0],
          purity: product.purity,
          size: selectedSize,
          price: finalPrice,
          qty: 1
        });
      }

      // ✅ THIS LINE TRIGGERS GLOBAL CART COUNT UPDATE
      saveCart(cart);

      alert("Product added to cart 🛒");
    });

    // ---------- WHATSAPP ----------
    whatsappLink.href =
      `https://wa.me/91XXXXXXXXXX?text=I am interested in ${product.name}`;

  })
  .catch(err => console.error("Product details error:", err));
