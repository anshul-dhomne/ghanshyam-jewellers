// ================= CATEGORY PAGE SCRIPT =================

const params = new URLSearchParams(window.location.search);
const category = params.get("cat");
const metalType = params.get("metal") || "gold";

const heading = document.querySelector(".page-header h1");
const productList = document.getElementById("productList");

// ================= METAL RATE FETCHER =================
const rate = getMetalRate(product.metal);

const weight = product.net_weight || product.gross_weight || 0;
const metalPrice = weight * rate;


// ================= TITLE MAP =================
const titleMap = {
  gold: {
    "ladies-ring": "Gold Ladies Ring",
    "ladies-chain": "Gold Ladies Chain",
    "earring": "Gold Earrings",
    "pendant": "Gold Pendant",
    "mangalsutra": "Gold Mangalsutra",
    "necklace": "Gold Necklace",
    "bangles": "Gold Bangles",
    "bracelet": "Gold Bracelet",
    "nath": "Gold Nath",
    "gents-ring": "Gold Gents Ring",
    "gents-chain": "Gold Gents Chain",
    "gents-bracelet": "Gold Gents Bracelet"
  },
  silver: {
    "ladies-payal": "Silver Payal",
    "ladies-toering": "Silver Toering",
    "ladies-ring": "Silver Ladies Ring",
    "ladies-chain": "Silver Ladies Chain",
    "ladies-kada": "Silver Ladies Kada",
    "ladies-bracelet": "Silver Ladies Bracelet",
    "gents-ring": "Silver Gents Ring",
    "gents-chain": "Silver Gents Chain",
    "gents-kada": "Silver Gents Kada",
    "gents-bracelet": "Silver Gents Bracelet"
  },
  diamond: {
    "ladies-ring": "Diamond Ladies Ring",
    "ladies-earring": "Diamond Ladies Earrings",
    "ladies-pendant": "Diamond Ladies Pendant",
    "mangalsutra": "Diamond Mangalsutra",
    "ladies-bracelet": "Diamond Ladies Bracelet",
    "nose-pin": "Diamond Nose Pin",
    "gents-ring": "Diamond Gents Ring",
    "gents-earring": "Diamond Gents Earrings",
    "gents-bracelet": "Diamond Gents Bracelet"
  }
};

// ================= PAGE HEADING =================
heading.textContent =
  category && titleMap[metalType]?.[category]
    ? titleMap[metalType][category]
    : metalType.charAt(0).toUpperCase() + metalType.slice(1) + " Jewellery";

// ================= FETCH PRODUCTS =================
fetch("/data/products.json")
  .then(res => res.json())
  .then(groups => {
    const products = groups.flat();

    const filtered = products.filter(p =>
      p.metal === metalType &&
      (!category || p.category === category)
    );

    if (!filtered.length) {
      const msg = document.createElement("p");
      msg.textContent = "No products found";
      productList.appendChild(msg);
      return;
    }

    filtered.forEach(p => {
      const product = document.createElement("div");
      product.className = "product";
      product.style.cursor = "pointer";

      // 👉 ENTIRE CARD CLICK
      product.addEventListener("click", () => openProduct(p.id));

      // IMAGE
      const img = document.createElement("img");
      img.src = p.image;
      img.alt = p.name;

      // NAME
      const name = document.createElement("h4");
      name.textContent = p.name;

      // WEIGHT (ONLY)
      const weight = document.createElement("p");
      weight.style.fontSize = "13px";
      weight.style.color = "#666";
      weight.textContent = `Weight: ${p.weight ?? p.gross_weight ?? "--"} g`;

      // PRICE LABEL
      const price = document.createElement("span");
      price.textContent = "₹ Auto Price";

      product.append(img, name, weight, price);
      productList.appendChild(product);
    });
  })
  .catch(err => console.error("Category JSON error:", err));

// ================= NAVIGATION =================
function openProduct(id) {
  window.location.href = `/html/product-details.html?id=${id}`;
}


