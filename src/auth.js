// Address of YOUR backend (server.js)
const API_URL = "http://localhost:3000/api";

const errorMsg = document.getElementById("auth-error");

// Shows a red error message under the form
function showError(message) {
    errorMsg.textContent = message;
    errorMsg.classList.remove("hidden");
}

// ===== LOGIN (account.html) =====
const loginForm = document.getElementById("login-form");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // stops the page from reloading

        const email = document.getElementById("email-input").value;
        const password = document.getElementById("password-input").value;

        try {
            // Send email + password to the backend
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            // The backend said no (wrong email or password)
            if (!response.ok) {
                showError(data.error);
                return;
            }

            // Save the token so the user stays logged in
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            window.location.href = "index.html";
        } catch (error) {
            showError("Cannot reach the server. Is it running?");
        }
    });
}

// ===== SIGN UP (signup.html) =====
const signupForm = document.getElementById("signup-form");

if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email-input").value;
        const password = document.getElementById("password-input").value;

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (!response.ok) {
                showError(data.error);
                return;
            }

            // Account created -> go to the login page
            alert("Account created! You can now log in.");
            window.location.href = "account.html";
        } catch (error) {
            showError("Cannot reach the server. Is it running?");
        }
    });
}