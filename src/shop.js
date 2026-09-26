import { API_URL, productCard, setupCardClicks } from "./product-card.js";

// The boxes in shop.html
const grid = document.getElementById("shop-products");
const filters = document.getElementById("shop-filters");
const sortSelect = document.getElementById("shop-sort");
const countText = document.getElementById("shop-count");

let allProducts = [];        // every product from the database
let activeCategory = "all";  // which filter button is selected

// Shows the products (after filtering and sorting)
function render() {
    // 1. Filter by category
    let list = activeCategory === "all"
        ? [...allProducts]
        : allProducts.filter((p) => p.category === activeCategory);

    // 2. Sort
    const sort = sortSelect.value;
    if (sort === "price-asc") list.sort((a, b) => Number(a.price) - Number(b.price));
    if (sort === "price-desc") list.sort((a, b) => Number(b.price) - Number(a.price));
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));

    // 3. Show them
    countText.textContent = `${list.length} products`;
    grid.innerHTML = list.length
        ? list.map(productCard).join("")
        : `<p class="col-span-full text-center text-stone-500">No products in this category.</p>`;
}

// Creates one filter button per category: ALL, LIPS, CHEEKS, SKIN...
function renderFilters() {
     const categories = [...new Set(allProducts.map((p) => p.category)), "all"];

    filters.innerHTML = categories
        .map((c) => {
            const style = c === activeCategory
                ? "border-[#6b665f] bg-[#6b665f] text-white"
                : "border-stone-400 text-stone-600 hover:border-stone-700";
            const text = c === "all" ? "shop all" : c;
            return `<button data-category="${c}"
                class="rounded-full border px-7 py-2.5 text-lg uppercase tracking-wide transition ${style}">
                ${text}
            </button>`;
        })
        .join("");
}

// When a filter button is clicked
filters.addEventListener("click", (e) => {
    const button = e.target.closest("[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category;
    renderFilters();
    render();
});

// When the sort menu changes
sortSelect.addEventListener("change", render);

// Gets ALL products from the backend
async function loadShop() {
    grid.innerHTML = `<p class="col-span-full text-center text-stone-500">Loading products...</p>`;

    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error("Server error");
        allProducts = await response.json();
        renderFilters();
        render();
    } catch (error) {
        grid.innerHTML = `<p class="col-span-full text-center text-red-600">Could not load products. Is the server running?</p>`;
    }
}

setupCardClicks(grid);
loadShop();