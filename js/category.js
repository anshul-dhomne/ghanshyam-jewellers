// ================= CATEGORY PAGE SCRIPT =================

// URL PARAMS
const params = new URLSearchParams(window.location.search);
const category = params.get("cat");
const metalType = params.get("metal") || "gold";

// DOM ELEMENTS
const heading = document.querySelector(".page-header h1");
const descriptionEl = document.querySelector(".category-description");
const productList = document.getElementById("productList");

// ================= TITLE MAP =================
const titleMap = {
  gold: {
    "ladies-ring": "Gold Ring",
    "ladies-chain": "Gold Chain",
    "ladies-earring": "Gold Earring",
    "ladies-pendant": "Gold Pendant",
    "ladies-mangalsutra": "Gold Mangalsutra",
    "ladies-necklace": "Gold Necklace",
    "ladies-bangles": "Gold Bangles",
    "ladies-bracelet": "Gold Bracelet",
    "ladies-kada": "Gold Kada",
    "ladies-nath": "Gold Nath",
    "gents-ring": "Gold Ring",
    "gents-chain": "Gold Chain",
    "gents-kada": "Gold Kada",
    "gents-bracelet": "Gold Bracelet"
  },
  silver: {
    "ladies-payal": "Silver Payal",
    "ladies-toering": "Silver Toering",
    "ladies-ring": "Silver Ring",
    "ladies-chain": "Silver Chain",
    "ladies-kada": "Silver Kada",
    "ladies-bracelet": "Silver Bracelet",
    "gents-ring": "Silver Ring",
    "gents-chain": "Silver Chain",
    "gents-bracelet": "Silver Bracelet",
    "gents-kada": "Silver Kada"
  },
  diamond: {
    "ladies-ring": "Diamond Ring",
    "ladies-earring": "Diamond Earring",
    "ladies-pendant": "Diamond Pendant",
    "ladies-mangalsutra": "Diamond Mangalsutra",
    "ladies-bracelet": "Diamond Bracelet",
    "ladies-nose-pin": "Diamond Nose Pin",
    "gents-ring": "Diamond Ring",
    "gents-chain": "Diamond Chain",
    "gents-bracelet": "Diamond Bracelet"
  }
};

// ================= DESCRIPTION MAP =================
const descriptionMap = {
  "gold ring": "Explore a timeless collection of gold rings designed with elegance.",
  "gold mangalsutra": "The mangalsutra is a sacred symbol of marriage.",
  "gold pendant": "Elegant gold pendants for every occasion.",
  "gold earring": "Timeless gold earrings crafted with perfection.",
  "gold necklace": "Graceful gold necklaces for weddings & celebrations."
};

// ================= PAGE HEADING =================
heading.textContent =
  category && titleMap[metalType]?.[category]
    ? titleMap[metalType][category]
    : metalType.charAt(0).toUpperCase() + metalType.slice(1) + " Jewellery";

// ================= PAGE DESCRIPTION =================
const cleanCat = category
  ? category.replace("ladies-", "").replace("gents-", "").replace("-", " ")
  : "";

const descKey = `${metalType} ${cleanCat}`.trim();
descriptionEl.textContent = descriptionMap[descKey] || "";

// ================= FETCH PRODUCTS =================
fetch("/data/products.json")
  .then(res => res.json())
  .then(data => {

    let allProducts = [];

    // 🔥 FLATTEN NESTED JSON
    Object.keys(data).forEach(metal => {
      Object.keys(data[metal]).forEach(gender => {
        allProducts = allProducts.concat(data[metal][gender]);
      });
    });

    // FILTER PRODUCTS
    const filtered = allProducts.filter(p =>
      p.metal === metalType &&
      (!category || p.category === category)
    );

    if (!filtered.length) {
      productList.innerHTML = "<p>No products found</p>";
      return;
    }

    // RENDER PRODUCTS
    filtered.forEach(p => {
      const product = document.createElement("div");
      product.className = "product";

      // IMAGE
      const img = document.createElement("img");
      img.src = p.image;
      img.alt = p.name;
      img.style.cursor = "pointer";
      img.onclick = () => openProduct(p.id);

      // NAME
      const name = document.createElement("h4");
      name.textContent = p.name;

      // OPTIONAL DESCRIPTION
      if (p.product_desc) {
        const desc = document.createElement("p");
        desc.textContent = p.product_desc;
        desc.style.fontSize = "14px";
        desc.style.color = "#444";
        desc.style.margin = "8px 0";
        product.appendChild(desc);
      }

      // PRICE PLACEHOLDER
      const price = document.createElement("span");
      price.textContent = "₹ Auto Price";

      product.append(img, name, price);
      productList.appendChild(product);
    });
  })
  .catch(err => console.error("Category JSON error:", err));

// ================= NAVIGATION =================
function openProduct(id) {
  window.location.href = `/html/product-details.html?id=${id}`;
}
