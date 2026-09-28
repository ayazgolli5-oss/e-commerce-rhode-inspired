import { API_URL } from "./product-card.js";

// ===== ADMIN DASHBOARD =====
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user") || "null");
const page = document.getElementById("admin-page");

// ----- 1. Only admins can see this page -----
// (The backend checks too: this is just so normal users don't see an empty page)
if (!token || !user || user.role !== "admin") {
    page.innerHTML = `
        <div class="py-20 text-center text-stone-500">
            <p class="mb-6 text-lg">This page is for admins only.</p>
            <a href="account.html" class="underline">Log in with an admin account</a>
        </div>`;
    throw new Error("Not an admin"); // stop the rest of this file
}

// Helper: every admin request sends the JWT token
async function api(path, options = {}) {
    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Server error");
    return data;
}

function showMessage(text, isError = false) {
    const box = document.getElementById("admin-message");
    box.textContent = text;
    box.className = `mb-6 rounded-xl px-5 py-3 text-sm ${isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-800"}`;
    setTimeout(() => box.classList.add("hidden"), 3000);
}

// ===== 2. PRODUCTS =====
let products = [];

async function loadProducts() {
    products = await fetch(`${API_URL}/products`).then((r) => r.json());
    document.getElementById("products-table").innerHTML = products.map((p) => `
        <tr class="border-b border-stone-200">
            <td class="py-3 pr-4">
            <img src="${p.image}" alt="${p.name}" style="width:48px;height:48px;object-fit:contain" class="rounded-lg bg-white mix-blend-multiply">
            </td>
            <td class="py-3 pr-4 font-semibold uppercase text-stone-700">${p.name}</td>
            <td class="py-3 pr-4 text-stone-600">${p.category}</td>
            <td class="py-3 pr-4 text-stone-800">$${Number(p.price).toFixed(2)}</td>
            <td class="py-3 pr-4 ${p.stock === 0 ? "font-bold text-red-600" : "text-stone-600"}">${p.stock}</td>
            <td class="py-3 text-right">
                <button data-edit="${p.id}" class="mr-3 text-sm underline hover:opacity-60">edit</button>
                <button data-delete="${p.id}" class="text-sm text-red-600 underline hover:opacity-60">delete</button>
            </td>
        </tr>`).join("");
}

// The form is used for both "add" and "edit"
const form = document.getElementById("product-form");
const fields = ["name", "category", "price", "stock", "image", "label", "tagline", "badge", "description"];

function fillForm(p) {
    fields.forEach((f) => (form.elements[f].value = p ? p[f] ?? "" : ""));
    form.elements.id.value = p ? p.id : "";
    document.getElementById("form-title").textContent = p ? `Edit: ${p.name}` : "Add a product";
    document.getElementById("form-cancel").classList.toggle("hidden", !p);
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const body = {};
    fields.forEach((f) => (body[f] = form.elements[f].value.trim()));
    body.price = Number(body.price);
    body.stock = Number(body.stock || 0);

    const id = form.elements.id.value;
    try {
        if (id) {
            await api(`/products/${id}`, { method: "PUT", body: JSON.stringify(body) });
            showMessage("Product updated ✓");
        } else {
            await api("/products", { method: "POST", body: JSON.stringify(body) });
            showMessage("Product added ✓");
        }
        fillForm(null);
        loadProducts();
    } catch (err) {
        showMessage(err.message, true);
    }
});

document.getElementById("form-cancel").addEventListener("click", () => fillForm(null));

document.getElementById("products-table").addEventListener("click", async (e) => {
    const editId = e.target.dataset.edit;
    const deleteId = e.target.dataset.delete;

    if (editId) {
        fillForm(products.find((p) => p.id === Number(editId)));
        form.scrollIntoView({ behavior: "smooth" });
    }

    if (deleteId && confirm("Delete this product?")) {
        try {
            await api(`/products/${deleteId}`, { method: "DELETE" });
            showMessage("Product deleted ✓");
            loadProducts();
        } catch (err) {
            showMessage(err.message, true);
        }
    }
});

// ===== 3. ORDERS =====
const STATUSES = ["pending", "shipped", "delivered", "cancelled"];

async function loadOrders() {
    const orders = await api("/admin/orders");
    document.getElementById("orders-table").innerHTML = orders.length
        ? orders.map((o) => `
            <tr class="border-b border-stone-200">
                <td class="py-3 pr-4 font-semibold text-stone-700">#${o.id}</td>
                <td class="py-3 pr-4 text-stone-600">${new Date(o.created_at).toLocaleDateString("fr-FR")}</td>
                <td class="py-3 pr-4 text-stone-600">${o.full_name}<br><span class="text-xs text-stone-400">${o.email}</span></td>
                <td class="py-3 pr-4 text-stone-600">${o.city}</td>
                <td class="py-3 pr-4 text-stone-800">$${Number(o.total).toFixed(2)}</td>
                <td class="py-3">
                    <select data-order="${o.id}" class="rounded-full border border-stone-300 bg-white px-3 py-1 text-sm">
                        ${STATUSES.map((s) => `<option value="${s}" ${s === o.status ? "selected" : ""}>${s}</option>`).join("")}
                    </select>
                </td>
            </tr>`).join("")
        : `<tr><td colspan="6" class="py-6 text-center text-stone-500">No orders yet.</td></tr>`;
}

document.getElementById("orders-table").addEventListener("change", async (e) => {
    const orderId = e.target.dataset.order;
    if (!orderId) return;
    try {
        await api(`/admin/orders/${orderId}/status`, {
            method: "PUT",
            body: JSON.stringify({ status: e.target.value }),
        });
        showMessage(`Order #${orderId} is now "${e.target.value}" ✓`);
    } catch (err) {
        showMessage(err.message, true);
    }
});

// ===== 4. Start =====
loadProducts();
loadOrders().catch((err) => showMessage(err.message, true));