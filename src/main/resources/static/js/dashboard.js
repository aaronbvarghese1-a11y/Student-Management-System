// 1. Protect the page: only logged-in users can see it
const loggedInUser = localStorage.getItem("loggedInUser");

if (!loggedInUser) {
    window.location.href = "login.html";
}

document.getElementById("userName").textContent = loggedInUser;

// 2. Logout
document.getElementById("logoutBtn").addEventListener("click", function (event) {
    event.preventDefault();
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
});

// 3. Safely show text inside HTML (prevents bad code in names from running)
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text == null ? "" : text;
    return div.innerHTML;
}

// 4. Load student data from the API
async function loadDashboard() {
    const tableBody = document.getElementById("studentTableBody");

    try {
        const countResponse = await fetch("/api/students/count");
        const total = await countResponse.json();
        document.getElementById("totalStudents").textContent = total;

        const response = await fetch("/api/students");
        const students = await response.json();

        const courses = new Set(
            students.map(s => s.course).filter(c => c && c.trim() !== "")
        );
        document.getElementById("totalCourses").textContent = courses.size;

        if (students.length === 0) {
            tableBody.innerHTML =
                '<tr><td colspan="5" class="empty">No students yet. Add some from the Students page.</td></tr>';
            return;
        }

        tableBody.innerHTML = students.map(s => `
            <tr>
                <td>${s.id}</td>
                <td>${escapeHtml(s.name)}</td>
                <td>${escapeHtml(s.email)}</td>
                <td>${escapeHtml(s.course)}</td>
                <td>${escapeHtml(s.phone)}</td>
            </tr>
        `).join("");

    } catch (error) {
        tableBody.innerHTML =
            '<tr><td colspan="5" class="empty">Could not load data. Is the app running?</td></tr>';
    }
}

loadDashboard();