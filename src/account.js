import { API_URL } from "./product-card.js";

// ===== ACCOUNT PAGE =====
// Not logged in  -> the login form stays (auth.js handles it)
// Logged in      -> we replace the page with "Hi, Aya" + my orders + log out

const token = localStorage.getItem("token");
const main = document.querySelector("main");

// Colors for each order status
const STATUS_STYLE = {
    pending: "bg-amber-100 text-amber-800",
    shipped: "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-stone-200 text-stone-600",
};

function logOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "account.html"; // back to the login form
}

// Builds one row of the orders table
function orderRow(order) {
    const date = new Date(order.created_at).toLocaleDateString("fr-FR");
    const style = STATUS_STYLE[order.status] || STATUS_STYLE.pending;

    return `
        <div class="flex items-center justify-between rounded-2xl bg-white px-6 py-4">
            <div>
                <p class="font-bold text-stone-700">Order #${order.id}</p>
                <p class="text-sm text-stone-500">${date}</p>
            </div>
            <span class="rounded-full px-4 py-1 text-sm font-semibold capitalize ${style}">${order.status}</span>
            <p class="font-bold text-stone-800">$${Number(order.total).toFixed(2)}</p>
        </div>`;
}

async function loadAccount() {
    try {
        // Ask the backend who I am + my orders, at the same time
        const headers = { Authorization: `Bearer ${token}` };
        const [meRes, ordersRes] = await Promise.all([
            fetch(`${API_URL}/me`, { headers }),
            fetch(`${API_URL}/orders/mine`, { headers }),
        ]);

        // Token expired or invalid -> log out
        if (meRes.status === 401 || ordersRes.status === 401) return logOut();
        if (!meRes.ok || !ordersRes.ok) throw new Error("Server error");

        const me = await meRes.json();
        const orders = await ordersRes.json();
        const name = me.first_name || me.email;

        main.innerHTML = `
        <section class="mx-8 mt-5 rounded-2xl bg-[#f3f2f0] px-8 py-12 md:px-16">
            <div class="mb-10 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 class="text-5xl font-extrabold lowercase text-stone-700">hi, ${name}</h1>
                    <p class="mt-2 text-stone-500">${me.email}</p>
                </div>
                <button id="logout-btn"
                    class="rounded-full border-2 border-stone-700 px-8 py-2 text-sm font-semibold tracking-wide text-stone-700 transition hover:bg-stone-700 hover:text-white">
                    LOG OUT
                </button>
            </div>

            <h2 class="mb-4 text-2xl font-bold text-stone-700">My orders</h2>
            <div class="space-y-3">
                ${orders.length
                    ? orders.map(orderRow).join("")
                    : `<p class="text-stone-500">No orders yet. <a href="shop.html" class="underline">Start shopping</a></p>`}
            </div>
        </section>`;

        document.getElementById("logout-btn").addEventListener("click", logOut);
    } catch (error) {
        main.innerHTML = `<p class="mt-20 text-center text-red-600">Could not load your account. Is the server running?</p>`;
    }
}

// Only replace the page if the user is logged in
if (token) loadAccount();