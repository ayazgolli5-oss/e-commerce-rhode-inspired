import { API_URL, productCard, setupCardClicks } from "./product-card.js";
import { addToCart } from "./cart.js";

// The boxes in product.html
const detail = document.getElementById("product-detail");
const related = document.getElementById("related-products");

// Read the id from the address: product.html?id=3  ->  "3"
const id = new URLSearchParams(window.location.search).get("id");

let quantity = 1;

// Builds the HTML of the big product section
function productPage(p) {
    const inStock = p.stock > 0;

    return `
    <div class="grid grid-cols-1 gap-8 md:grid-cols-2">

        <!-- Left: big image -->
        <div class="flex items-center justify-center rounded-2xl bg-[#f5f5f4] p-10 md:min-h-[600px]">
            <img src="${p.image}" alt="${p.name}" class="max-h-[480px] w-auto object-contain mix-blend-multiply">
        </div>

        <!-- Right: information -->
        <div class="flex flex-col justify-center gap-5 px-2 md:px-8">
            <a href="shop.html" class="text-sm uppercase tracking-wide text-stone-500 hover:underline">&larr; back to shop</a>

            <p class="text-sm uppercase tracking-widest text-stone-500">${p.category}</p>
            <h1 class="text-5xl font-extrabold lowercase tracking-tight text-stone-700">${p.name}</h1>
            <p class="text-lg text-stone-500">${p.tagline || ""}</p>

            <p class="text-3xl font-bold text-stone-800">$${Number(p.price).toFixed(2)}</p>

            <p class="leading-relaxed text-stone-600">${p.description || ""}</p>

            <p class="text-sm ${inStock ? "text-green-700" : "text-red-600"}">
                ${inStock ? `In stock (${p.stock} available)` : "Out of stock"}
            </p>

            <!-- Quantity selector -->
            <div class="flex items-center gap-4">
                <div class="flex items-center rounded-full border border-stone-400">
                    <button id="qty-minus" class="px-5 py-2 text-xl text-stone-700 hover:opacity-60">&minus;</button>
                    <span id="qty-value" class="w-8 text-center text-lg">1</span>
                    <button id="qty-plus" class="px-5 py-2 text-xl text-stone-700 hover:opacity-60">+</button>
                </div>

                <button id="add-to-cart" ${inStock ? "" : "disabled"}
                    class="flex-1 rounded-full bg-stone-700 py-3 text-sm font-bold tracking-widest text-white transition hover:bg-stone-900 disabled:cursor-not-allowed disabled:opacity-40">
                    ADD TO CART
                </button>
            </div>
        </div>
    </div>`;
}

// Makes the - / + / ADD TO CART buttons work
function setupButtons(p) {
    const value = document.getElementById("qty-value");

    document.getElementById("qty-minus").addEventListener("click", () => {
        if (quantity > 1) quantity--;
        value.textContent = quantity;
    });

    document.getElementById("qty-plus").addEventListener("click", () => {
        if (quantity < p.stock) quantity++; // can't choose more than the stock
        value.textContent = quantity;
    });

    const addBtn = document.getElementById("add-to-cart");
    addBtn.addEventListener("click", () => {
        addToCart(p, quantity); // puts the product in the cart with the chosen quantity
    });
}

// "Vous aimerez aussi": other products from the same category
async function loadRelated(p) {
    const response = await fetch(`${API_URL}/products`);
    const all = await response.json();

    const list = all
        .filter((other) => other.category === p.category && other.id !== p.id)
        .slice(0, 3);

    if (list.length === 0) {
        related.parentElement.classList.add("hidden"); // hide the section if empty
        return;
    }
    related.innerHTML = list.map(productCard).join("");
}

// Gets ONE product from the backend and shows the page
async function loadProduct() {
    if (!id) {
        detail.innerHTML = `<p class="text-center text-stone-500">No product selected. <a href="shop.html" class="underline">Go to the shop</a></p>`;
        return;
    }

    try {
        const response = await fetch(`${API_URL}/products/${id}`);

        if (response.status === 404) {
            detail.innerHTML = `<p class="text-center text-stone-500">This product doesn't exist. <a href="shop.html" class="underline">Go to the shop</a></p>`;
            return;
        }
        if (!response.ok) throw new Error("Server error");

        const product = await response.json();

        document.title = `Rhode - ${product.name}`; // browser tab title
        detail.innerHTML = productPage(product);
        setupButtons(product);
        loadRelated(product);
    } catch (error) {
        detail.innerHTML = `<p class="text-center text-red-600">Could not load the product. Is the server running?</p>`;
    }
}

setupCardClicks(related);
loadProduct();