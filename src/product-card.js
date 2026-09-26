// Shared code for product cards (used by featured.js AND shop.js)

// Address of YOUR backend
export const API_URL = "http://localhost:3000/api";

// Turns a rating like 4.8 into stars: ★★★★★
export function stars(rating) {
    const full = Math.round(rating);
    return "★".repeat(full) + "☆".repeat(5 - full);
}

// Builds the HTML of ONE product card
export function productCard(p) {
    // Small pill in the top-right corner (only if the product has a badge)
    const badge = p.badge
        ? `<span class="whitespace-nowrap rounded-full bg-stone-700 px-3 py-1 text-xs font-bold lowercase text-white">${p.badge}</span>`
        : "";

    // Stars + number of reviews (an empty line keeps all cards aligned)
    const reviews = p.review_count > 0
        ? `<p class="flex items-center gap-2 text-sm text-stone-600">
               <span>${stars(p.rating)}</span>
               <span>(${Number(p.review_count).toLocaleString()})</span>
           </p>`
        : `<p class="h-5"></p>`;

    return `
    <article data-product-id="${p.id}"
        class="group flex cursor-pointer flex-col rounded-2xl bg-[#f5f5f4] p-6 transition duration-300 hover:shadow-lg">

        <!-- Big word + badge -->
        <div class="flex items-start justify-between gap-3">
            <h3 class="text-4xl font-extrabold lowercase tracking-tight text-stone-600">${p.label || p.category}</h3>
            ${badge}
        </div>

        <!-- Image + button that appears on hover -->
        <div class="relative my-4 flex h-64 items-center justify-center overflow-hidden md:h-72">
            <img src="${p.image}" alt="${p.name}"
                class="max-h-[80%] w-auto object-contain mix-blend-multiply transition duration-500 group-hover:scale-105">

            <button class="add-btn absolute inset-x-2 bottom-0 rounded-full bg-stone-700 py-2.5 text-xs font-bold tracking-widest text-white transition duration-300 hover:bg-stone-900 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                ADD TO CART
            </button>
        </div>

        ${reviews}

        <!-- Name + price -->
        <div class="mt-1 flex items-baseline justify-between gap-4">
            <span class="text-base font-bold uppercase tracking-wide text-stone-700">${p.name}</span>
            <span class="text-base font-bold text-stone-700">$${Number(p.price).toFixed(2)}</span>
        </div>

        <!-- Short sentence under the name -->
        <p class="mt-1 text-sm text-stone-500">${p.tagline || ""}</p>
    </article>`;
}

// Clicks on cards: the button adds to cart, the rest of the card opens the product page
export function setupCardClicks(container) {
    container?.addEventListener("click", (e) => {
        const button = e.target.closest(".add-btn");
        if (button) {
            // The real cart comes later; for now we just show a confirmation
            button.textContent = "ADDED ✓";
            setTimeout(() => (button.textContent = "ADD TO CART"), 1500);
            return;
        }

        const card = e.target.closest("[data-product-id]");
        if (card) {
            window.location.href = `product.html?id=${card.dataset.productId}`;
        }
    });
}