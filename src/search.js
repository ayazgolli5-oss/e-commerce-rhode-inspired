const overlay = document.getElementById("search-overlay");
const openBtn = document.getElementById("search-open");
const closeBtn = document.getElementById("search-close");

if (overlay && openBtn && closeBtn) {
    openBtn.addEventListener("click", (e) => {
        e.preventDefault();
        overlay.classList.remove("hidden");
    });

    closeBtn.addEventListener("click", () => {
        overlay.classList.add("hidden");
    });
}