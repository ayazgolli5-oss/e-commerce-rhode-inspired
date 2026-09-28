
// ===== CART =====
// The cart lives in the browser (localStorage), so it stays saved
// when you change pages or refresh. Later, "Place order" will send it to the backend.

const FREE_SHIPPING = 45; // same number as the banner: free shipping over $45

// ----- 1. Read and save the cart -----

// Returns the cart as an array: [{ id, name, price, image, stock, qty }, ...]
export function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCount();   // refresh "CART (3)" in the navbar
    renderDrawer();  // refresh the drawer
}

// ----- 2. Change the cart -----

// Adds a product (or increases its quantity if it's already in the cart)
export function addToCart(product, qty = 1) {
    const cart = getCart();
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
        existing.qty = Math.min(existing.qty + qty, product.stock); // never more than the stock
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image,
            stock: product.stock,
            qty: Math.min(qty, product.stock),
        });
    }

    saveCart(cart);
    openDrawer(); // show the cart right away, like on the real rhode site
}

function changeQty(id, change) {
    const cart = getCart();
    const item = cart.find((i) => i.id === id);
    if (!item) return;

    item.qty += change;
    if (item.qty > item.stock) item.qty = item.stock;

    // Quantity 0 -> remove the product
    saveCart(item.qty <= 0 ? cart.filter((i) => i.id !== id) : cart);
}

export function clearCart() {
    saveCart([]);
}

function removeItem(id) {
    saveCart(getCart().filter((i) => i.id !== id));
}

// ----- 3. Calculations -----

export function cartTotal() {
    return getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
}

function cartCount() {
    return getCart().reduce((sum, item) => sum + item.qty, 0);
}

// ----- 4. The navbar counter: CART (3) -----

function updateCount() {
    const link = document.getElementById("cart-open");
    if (link) link.textContent = `CART (${cartCount()})`;
}

// ----- 5. The drawer (the panel that slides in from the right) -----

// Creates the drawer HTML once and adds it to the page
function createDrawer() {
    document.body.insertAdjacentHTML("beforeend", `
    <div id="cart-backdrop" class="fixed inset-0 z-40 hidden bg-black/50"></div>

    <aside id="cart-drawer"
        class="fixed inset-y-0 right-0 z-50 flex w-full md:w-1/2 translate-x-full flex-col bg-[#f3f2f0] transition-transform duration-300">

        <div class="flex items-center justify-between px-6 py-6">
            <h2 class="text-3xl font-extrabold lowercase text-stone-700">your cart</h2>
            <button id="cart-close" class="text-3xl text-stone-600 hover:opacity-60">&times;</button>
        </div>

        <div id="cart-shipping" class="px-6"></div>
        <div id="cart-items" class="flex-1 space-y-4 overflow-y-auto px-6 py-4"></div>
        <div id="cart-footer" class="border-t border-stone-300 px-6 py-6"></div>
    </aside>`);

    document.getElementById("cart-close").addEventListener("click", closeDrawer);
    document.getElementById("cart-backdrop").addEventListener("click", closeDrawer);

    // One listener for all the -, + and remove buttons inside the drawer
    document.getElementById("cart-items").addEventListener("click", (e) => {
        const btn = e.target.closest("[data-action]");
        if (!btn) return;
        const id = Number(btn.dataset.id);

        if (btn.dataset.action === "minus") changeQty(id, -1);
        if (btn.dataset.action === "plus") changeQty(id, +1);
        if (btn.dataset.action === "remove") removeItem(id);
    });
}

// Fills the drawer with the current cart
function renderDrawer() {
    const itemsBox = document.getElementById("cart-items");
    if (!itemsBox) return;

    const cart = getCart();
    const total = cartTotal();

    // Free shipping progress bar
    const missing = FREE_SHIPPING - total;
    const percent = Math.min((total / FREE_SHIPPING) * 100, 100);
    document.getElementById("cart-shipping").innerHTML = cart.length === 0 ? "" : `
        <p class="mb-2 text-sm text-stone-600">
            ${missing > 0
                ? `You're <strong>$${missing.toFixed(2)}</strong> away from free shipping`
                : "You've unlocked <strong>free shipping</strong> ✓"}
        </p>
        <div class="h-2 w-full overflow-hidden rounded-full bg-white">
            <div class="h-full rounded-full bg-stone-700 transition-all duration-500" style="width: ${percent}%"></div>
        </div>`;

    // Empty cart
    if (cart.length === 0) {
        itemsBox.innerHTML = `
            <div class="mt-20 text-center text-stone-500">
                <p class="mb-6 text-lg">Your cart is empty.</p>
                <a href="shop.html" class="rounded-full border border-stone-700 px-8 py-2.5 text-sm uppercase tracking-wide text-stone-700 hover:bg-stone-700 hover:text-white">shop all</a>
            </div>`;
        document.getElementById("cart-footer").innerHTML = "";
        return;
    }

    // One row per product
    itemsBox.innerHTML = cart.map((item) => `
        <div class="flex gap-4 rounded-2xl bg-white p-3">
            <div class="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-[#f5f5f4]">
                <img src="${item.image}" alt="${item.name}" class="max-h-20 w-auto object-contain mix-blend-multiply">
            </div>

            <div class="flex flex-1 flex-col justify-between">
                <div class="flex items-start justify-between gap-2">
                    <p class="font-bold uppercase text-stone-700">${item.name}</p>
                    <button data-action="remove" data-id="${item.id}" class="text-sm text-stone-400 underline hover:text-stone-700">remove</button>
                </div>

                <div class="flex items-center justify-between">
                    <div class="flex items-center rounded-full border border-stone-300">
                        <button data-action="minus" data-id="${item.id}" class="px-3 py-1 text-lg hover:opacity-60">&minus;</button>
                        <span class="w-6 text-center">${item.qty}</span>
                        <button data-action="plus" data-id="${item.id}" class="px-3 py-1 text-lg hover:opacity-60 ${item.qty >= item.stock ? "opacity-30" : ""}">+</button>
                    </div>
                    <p class="font-bold text-stone-800">$${(item.price * item.qty).toFixed(2)}</p>
                </div>
            </div>
        </div>`).join("");

    // Total + checkout button
    document.getElementById("cart-footer").innerHTML = `
        <div class="mb-4 flex items-center justify-between text-lg">
            <span class="text-stone-600">Subtotal</span>
            <span class="font-bold text-stone-800">$${total.toFixed(2)}</span>
        </div>
        <button id="checkout-btn" class="w-full rounded-full bg-stone-700 py-3.5 text-sm font-bold tracking-widest text-white hover:bg-stone-900">
            CHECKOUT
        </button>`;

    // The real checkout (orders saved in MySQL) is the next step
    document.getElementById("checkout-btn").addEventListener("click", () => {
            window.location.href = "checkout.html";

    });
}

export function openDrawer() {
    document.getElementById("cart-drawer")?.classList.remove("translate-x-full");
    document.getElementById("cart-backdrop")?.classList.remove("hidden");
}

function closeDrawer() {
    document.getElementById("cart-drawer")?.classList.add("translate-x-full");
    document.getElementById("cart-backdrop")?.classList.add("hidden");
}

// ----- 6. Start: runs on every page that loads this file -----

createDrawer();
renderDrawer();
updateCount();

document.getElementById("cart-open")?.addEventListener("click", (e) => {
    e.preventDefault(); // it's a link, don't jump to the top of the page
    openDrawer();
});