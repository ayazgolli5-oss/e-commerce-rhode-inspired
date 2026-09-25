
const products = [
    {
        name: "pearl",
        title: "POCKET PEARL",
        subtitle: "The mini shimmery flush",
        price: "$16.00",
        image: "/images/charmm.png",
        badge: "only at rhode"
    },
    {
        name: "tint",
        title: "PEPTIDE LIP TINT",
        subtitle: "Designed with Alexandra Leclerc",
        price: "$20.00",
        image: "/images/tintt.png",
        badge: "only at rhode",
    },
    {
        name: "charm",
        title: "FLUTTER CHARM",
        subtitle: "Designed with Alexandra Leclerc",
        price: "$8.00",
        image: "/images/charm.png",
        badge: "only at rhode"
    },
    {
        name: "pocket blush",
        title:"POCKET BLUSH",
        subtitle:"the natural flush",
        price:"$25.00",
        image:"/images/blushgirl.png",
    },
    {
        name: "brush",
        title:"POCKET BRUSH",
        subtitle:"Double-ended makeup brush",
        price:"$27.00",
        image:"/images/brushh.png",

    },
    {
        name:"Highlight",
        title:"HIGHLIGHT MILK",
        subtitle:"multipurpose luminizer",
        price:"$28.00",
        image:"/images/highlighter.png",
    },

];

const grid = document.getElementById("product-grid");

products.forEach(product => {
    const card = document.createElement("div");
    card.className = "relative flex min-h-[400px] flex-col justify-between rounded-2xl bg-[#f4f4f2] p-6";

    card.innerHTML = `
        <div class="flex items-start justify-between">
            <h2 class="text-4xl font-black lowercase tracking-tighter text-stone-600">${product.name}</h2>
            ${product.badge ? `<span class="rounded-full bg-stone-700 px-3 py-1 text-xs font-semibold text-white">${product.badge}</span>` : ""}
        </div>

        <div class="my-auto flex justify-center">
            <img src="${product.image}" alt="${product.title}" class="h-48 w-auto object-contain">
        </div>

        <div>
            ${product.rating ? `<p class="mb-2 text-sm text-stone-500">${product.rating}</p>` : ""}
            <div class="flex items-baseline justify-between">
                <h3 class="text-lg font-bold text-stone-700">${product.title}</h3>
                <span class="text-lg font-bold text-stone-700">${product.price}</span>
            </div>
            <p class="text-sm text-stone-500">${product.subtitle}</p>
                    <button class="w-full rounded-full border-2 border-stone-700 py-2 text-sm font-semibold uppercase tracking-wide text-stone-700 transition hover:bg-stone-700 hover:text-white">
            Add to Cart
        </button>

        </div>

    `;

    grid.appendChild(card);
});