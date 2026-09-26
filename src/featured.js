import { API_URL, productCard, setupCardClicks } from "./product-card.js";

// The empty box in index.html where the cards will appear
const container = document.getElementById("featured-products");

// Gets the featured products from the backend and shows them
async function loadFeatured() {
    if (!container) return;

    container.innerHTML = `<p class="col-span-full text-center text-stone-500">Loading products...</p>`;

    try {
        const response = await fetch(`${API_URL}/products?featured=1`);
        if (!response.ok) throw new Error("Server error");
        const products = await response.json();
        container.innerHTML = products.map(productCard).join("");
    } catch (error) {
        container.innerHTML = `<p class="col-span-full text-center text-red-600">Could not load products. Is the server running?</p>`;
    }
}

setupCardClicks(container);
loadFeatured();