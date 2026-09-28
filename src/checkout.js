import { API_URL } from "./product-card.js";
import { getCart, cartTotal, clearCart } from "./cart.js";

const FREE_SHIPPING = 45;
const SHIPPING_COST = 5;

const summary = document.getElementById("checkout-summary");
const form = document.getElementById("checkout-form");
const errorMsg = document.getElementById("checkout-error");
const page = document.getElementById("checkout-page");

// ----- 1. Only logged-in users can order -----
const token = localStorage.getItem("token");
if (!token) {
    // Go to login, then come back here after logging in
    window.location.href = "account.html?next=checkout.html";
}

// ----- 2. Show the order summary -----
function renderSummary() {
    const cart = getCart();

    if (cart.length === 0) {
        page.innerHTML = `
            <div class="py-20 text-center text-stone-500">
                <p class="mb-6 text-lg">Your cart is empty.</p>
                <a href="shop.html" class="rounded-full border border-stone-700 px-8 py-2.5 text-sm uppercase tracking-wide text-stone-700 hover:bg-stone-700 hover:text-white">shop all</a>
            </div>`;
        return;
    }

    const subtotal = cartTotal();
    const shipping = subtotal >= FREE_SHIPPING ? 0 : SHIPPING_COST;

    summary.innerHTML = `
        ${cart.map((item) => `
            <div class="flex items-center gap-4">
                <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white">
                    <img src="${item.image}" alt="${item.name}" class="max-h-14 w-auto object-contain mix-blend-multiply">
                </div>
                <p class="flex-1 text-stone-700"><span class="font-bold uppercase">${item.name}</span> &times; ${item.qty}</p>
                <p class="font-bold text-stone-800">$${(item.price * item.qty).toFixed(2)}</p>
            </div>`).join("")}

        <div class="space-y-2 border-t border-stone-300 pt-4 text-stone-600">
            <div class="flex justify-between"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
            <div class="flex justify-between"><span>Shipping</span><span>${shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div>
            <div class="flex justify-between text-lg font-bold text-stone-800"><span>Total</span><span>$${(subtotal + shipping).toFixed(2)}</span></div>
        </div>`;
}

// ----- 3. Send the order to the backend -----
form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMsg.classList.add("hidden");

    const button = form.querySelector("button[type=submit]");
    button.disabled = true;           // avoid ordering twice with a double click
    button.textContent = "PLACING ORDER...";

    // We only send ids and quantities: the backend takes the real prices from MySQL
    const order = {
        fullName: document.getElementById("full-name").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        phone: document.getElementById("phone").value,
        items: getCart().map((item) => ({ productId: item.id, qty: item.qty })),
    };

    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // proves who is ordering (JWT)
            },
            body: JSON.stringify(order),
        });
        const data = await response.json();

        if (response.status === 401) {
            // Token expired -> log in again
            localStorage.removeItem("token");
            window.location.href = "account.html?next=checkout.html";
            return;
        }
        if (!response.ok) throw new Error(data.error);

        // Success: empty the cart and show the confirmation
        clearCart();
        page.innerHTML = `
            <div class="mx-auto max-w-lg py-20 text-center">
                <p class="mb-4 text-6xl">✓</p>
                <h1 class="mb-4 text-5xl font-extrabold lowercase text-stone-700">thank you!</h1>
                <p class="mb-2 text-lg text-stone-600">Your order <strong>#${data.orderId}</strong> is confirmed.</p>
                <p class="mb-10 text-stone-500">Total paid: $${Number(data.total).toFixed(2)}</p>
                <a href="shop.html" class="rounded-full bg-stone-700 px-10 py-3 text-sm font-bold tracking-widest text-white hover:bg-stone-900">CONTINUE SHOPPING</a>
            </div>`;
    } catch (error) {
        errorMsg.textContent = error.message || "Could not place the order. Is the server running?";
        errorMsg.classList.remove("hidden");
        button.disabled = false;
        button.textContent = "PLACE ORDER";
    }
});

if (token) renderSummary();

