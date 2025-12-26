// ================= PRODUCT DETAILS PAGE SCRIPT =================

// ---------- URL PARAM ----------
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

// ---------- DOM ----------
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

// ---------- CART HELPERS ----------
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ---------- LOAD PRODUCTS ----------
fetch("/data/products.json")
  .then(res => res.json())
  .then(data => {

    // ---- FLATTEN JSON ----
    let allProducts = [];
    Object.values(data).forEach(metal =>
      Object.values(metal).forEach(group =>
        allProducts.push(...group))
    );

    const product = allProducts.find(p => p.id == productId);
    if (!product) {
      productTitle.innerText = "Product Not Found";
      return;
    }

    // ---------- IMAGES ----------
    const images = Array.isArray(product.image) ? product.image : [product.image];
    productImage.src = images[0];

    if (images.length > 1) {
      thumbnailList.innerHTML = "";
      images.forEach((src, i) => {
        const img = document.createElement("img");
        img.src = src;
        if (i === 0) img.classList.add("active");
        img.onclick = () => {
          document.querySelectorAll("#thumbnailList img")
            .forEach(x => x.classList.remove("active"));
          img.classList.add("active");
          productImage.src = src;
        };
        thumbnailList.appendChild(img);
      });
    } else {
      thumbnailList.style.display = "none";
      productImageWrapper.classList.add("full-width");
    }

    // ---------- BASIC DETAILS ----------
    productTitle.innerText = product.name;
    netWeightEl.innerText = product.net_weight.toFixed(2);
    grossWeightEl.innerText = product.gross_weight.toFixed(2);

    // ---------- PURITY (TEXT ONLY) ----------
    purityValue.innerText = product.purity;

    // ---------- SIZE ----------
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

    // ---------- PRICE CALC ----------
    let metalPrice = 0, diamondPrice = 0, makingCharge = 0;

    if (product.metal === "gold" || product.metal === "silver") {
      metalPrice = getMetalRate(product.metal) * product.net_weight;
      makingCharge = metalPrice * ((product.making_percent || 0) / 100);
    }

    if (product.metal === "diamond") {
      metalPrice = getMetalRate("gold") * product.net_weight;
      diamondPrice = (product.diamond_weight || 0) * getMetalRate("diamond");
      makingCharge = metalPrice * ((product.making_percent || 0) / 100);
    }

    const gst = (metalPrice + diamondPrice + makingCharge) * 0.03;
    const finalPrice = Math.round(metalPrice + diamondPrice + makingCharge + gst);

    metalPriceEl.innerText = `₹ ${Math.round(metalPrice).toLocaleString("en-IN")}`;
    diamondPriceEl.innerText = `₹ ${Math.round(diamondPrice).toLocaleString("en-IN")}`;
    makingChargeEl.innerText = `₹ ${Math.round(makingCharge).toLocaleString("en-IN")}`;
    gstPriceEl.innerText = `₹ ${Math.round(gst).toLocaleString("en-IN")}`;
    productPrice.innerText = `₹ ${finalPrice.toLocaleString("en-IN")}`;
    totalPriceEl.innerText = `₹ ${finalPrice.toLocaleString("en-IN")}`;

    // ---------- ADD TO CART (FIXED) ----------
    document.getElementById("addToCartBtn").onclick = () => {

      let selectedSize = null;
      if (sizeRow.style.display !== "none" && sizeSelect.value) {
        selectedSize = sizeSelect.value;
      }

      const cart = getCart();

      const existing = cart.find(
        i => i.id === product.id && i.size === selectedSize
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

      saveCart(cart);
      alert("Product added to cart 🛒");
    };

    // ---------- WHATSAPP ----------
    whatsappLink.href =
      `https://wa.me/91XXXXXXXXXX?text=I am interested in ${product.name}`;
  })
  .catch(err => console.error(err));
