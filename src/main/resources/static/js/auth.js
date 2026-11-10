// Shows a red (error) or green (success) message box
function showMessage(text, type) {
    const box = document.getElementById("message");
    box.textContent = text;
    box.className = "message " + type;
}

// ---------- LOGIN ----------
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;

        if (username.length < 3) {
            showMessage("Username must be at least 3 characters", "error");
            return;
        }
        if (password.length < 6) {
            showMessage("Password must be at least 6 characters", "error");
            return;
        }

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: username, password: password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("loggedInUser", data.username);
                window.location.href = "dashboard.html";
            } else {
                showMessage(data.error, "error");
            }
        } catch (error) {
            showMessage("Cannot connect to the server. Is the app running?", "error");
        }
    });
}

// ---------- REGISTER ----------
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (username.length < 3) {
            showMessage("Username must be at least 3 characters", "error");
            return;
        }
        if (password.length < 6) {
            showMessage("Password must be at least 6 characters", "error");
            return;
        }
        if (password !== confirmPassword) {
            showMessage("Passwords do not match", "error");
            return;
        }

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: username, password: password })
            });

            const data = await response.json();

            if (response.ok) {
                showMessage("Registration successful! Redirecting to login...", "success");
                setTimeout(function () {
                    window.location.href = "login.html";
                }, 1500);
            } else {
                showMessage(data.error, "error");
            }
        } catch (error) {
            showMessage("Cannot connect to the server. Is the app running?", "error");
        }
    });
}