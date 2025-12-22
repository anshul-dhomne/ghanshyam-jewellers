// ================= CATEGORY PAGE SCRIPT =================

// URL PARAMS
const params = new URLSearchParams(window.location.search);
const category = params.get("cat");
const metalType = params.get("metal") || "gold";

// DOM ELEMENTS
const heading = document.querySelector(".page-header h1");
const descriptionEl = document.querySelector(".category-description");
const productList = document.getElementById("productList");
const sortSelect = document.querySelector(".sort select");

// GLOBAL STATE
let allLoadedProducts = [];

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
  gold: "Explore our complete collection of hallmarked gold jewellery, crafted with elegance, tradition, and timeless craftsmanship.",
  silver: "Discover premium silver jewellery designed for everyday wear and special occasions with lasting shine.",
  diamond: "Experience luxury with our certified diamond jewellery collection, crafted for brilliance and sophistication.",

  "gold ring": "Explore a timeless collection of gold rings designed with elegance, tradition, and everyday luxury.",
  "gold chain": "Discover premium gold chains crafted for daily wear and special occasions.",
  "gold earring": "Timeless gold earrings crafted to enhance your elegance on every occasion.",
  "gold pendant": "Elegant gold pendants designed to complement both traditional and modern styles.",
  "gold mangalsutra": "The mangalsutra is a sacred symbol of marriage, beautifully crafted in gold.",
  "gold necklace": "Graceful gold necklaces featuring intricate craftsmanship for weddings and celebrations.",
  "gold bangles": "Traditional and modern gold bangles crafted with fine detailing and superior finish.",
  "gold bracelet": "Stylish gold bracelets designed for comfort, durability, and elegance.",
  "gold kada": "Classic gold kadas crafted with bold designs, perfect for traditional wear.",
  "gold nath": "Traditional gold naths designed with delicate craftsmanship for bridal elegance.",

  "silver ring": "Elegant silver rings crafted for daily wear with a perfect balance of style and comfort.",
  "silver chain": "Premium silver chains made with durable designs and a polished finish.",
  "silver payal": "Beautiful silver payals designed with traditional artistry and modern comfort.",
  "silver toering": "Delicately crafted silver toerings for everyday elegance.",
  "silver bracelet": "Stylish silver bracelets perfect for casual and festive wear.",
  "silver kada": "Classic silver kadas designed with strong craftsmanship and lasting shine.",

  "diamond ring": "Exquisite diamond rings crafted with precision for timeless luxury.",
  "diamond earring": "Elegant diamond earrings designed to sparkle on every special occasion.",
  "diamond pendant": "Minimal and luxurious diamond pendants crafted for modern elegance.",
  "diamond mangalsutra": "A perfect blend of tradition and luxury with certified diamonds.",
  "diamond bracelet": "Premium diamond bracelets designed with exceptional brilliance.",
  "diamond nose pin": "Delicate diamond nose pins crafted with fine detailing and certified diamonds.",
  "diamond chain": "Luxury diamond chains designed for those who appreciate timeless elegance."
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

descriptionEl.textContent = !category
  ? descriptionMap[metalType]
  : descriptionMap[descKey] || "";

// ================= FETCH PRODUCTS =================
fetch("/data/products.json")
  .then(res => res.json())
  .then(data => {

    let allProducts = [];

    Object.keys(data).forEach(metal => {
      Object.keys(data[metal]).forEach(gender => {
        allProducts = allProducts.concat(data[metal][gender]);
      });
    });

    allLoadedProducts = allProducts.filter(p =>
      p.metal === metalType &&
      (!category || p.category === category)
    );

    applyFiltersAndSort();
  })
  .catch(err => console.error("Category JSON error:", err));

// ================= RENDER =================
function renderProducts(products) {
  productList.innerHTML = "";

  if (!products.length) {
    productList.innerHTML = "<p>No products found</p>";
    return;
  }

  products.forEach(p => {
    const product = document.createElement("div");
    product.className = "product";

    const img = document.createElement("img");
    img.src = Array.isArray(p.image) ? p.image[0] : p.image;
    img.alt = p.name;
    img.onclick = () => openProduct(p.id);

    const name = document.createElement("h4");
    name.textContent = p.name;

    const price = document.createElement("span");
    price.textContent = `Rs. ${calculatePrice(p).toLocaleString("en-IN")}`;

    product.append(img, name, price);
    productList.appendChild(product);
  });
}

// ================= FILTER + SORT =================
function applyFiltersAndSort() {
  let filtered = [...allLoadedProducts];

  // Gender
  const genders = [...document.querySelectorAll(".filter-gender:checked")].map(i => i.value);
  if (genders.length) {
    filtered = filtered.filter(p => genders.some(g => p.category.startsWith(g)));
  }

  // Purity
  const purities = [...document.querySelectorAll(".filter-purity:checked")].map(i => i.value);
  if (purities.length) {
    filtered = filtered.filter(p => purities.includes(p.purity));
  }

  // Price
  const priceRanges = [...document.querySelectorAll(".filter-price:checked")].map(i => i.value);
  if (priceRanges.length) {
    filtered = filtered.filter(p => {
      const price = calculatePrice(p);
      return priceRanges.some(r =>
        (r === "below-50000" && price < 50000) ||
        (r === "50000-100000" && price >= 50000 && price <= 100000) ||
        (r === "above-100000" && price > 100000)
      );
    });
  }

  // Sort
  if (sortSelect.value === "Price: Low to High") {
    filtered.sort((a, b) => calculatePrice(a) - calculatePrice(b));
  }
  if (sortSelect.value === "Price: High to Low") {
    filtered.sort((a, b) => calculatePrice(b) - calculatePrice(a));
  }

  renderProducts(filtered);
}

// ================= EVENTS =================
document.querySelectorAll(".filter-gender, .filter-purity, .filter-price")
  .forEach(el => el.addEventListener("change", applyFiltersAndSort));

sortSelect.addEventListener("change", applyFiltersAndSort);

// ================= NAVIGATION =================
function openProduct(id) {
  window.location.href = `/html/product-details.html?id=${id}`;
}
