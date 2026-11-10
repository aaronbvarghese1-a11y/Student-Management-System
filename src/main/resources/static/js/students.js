// ---------- 1. Protect the page and logout ----------
const loggedInUser = localStorage.getItem("loggedInUser");

if (!loggedInUser) {
    window.location.href = "login.html";
}

document.getElementById("userName").textContent = loggedInUser;

document.getElementById("logoutBtn").addEventListener("click", function (event) {
    event.preventDefault();
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
});

// ---------- 2. Helpers ----------
const API_URL = "/api/students";
let students = [];        // the list currently shown
let editingId = null;     // null = adding, a number = editing that student

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text == null ? "" : text;
    return div.innerHTML;
}

function showToast(text, type) {
    const toast = document.getElementById("toast");
    toast.textContent = text;
    toast.className = "toast show " + type;
    setTimeout(function () {
        toast.className = "toast";
    }, 2500);
}

// ---------- 3. Show students in the table ----------
function renderTable() {
    const tableBody = document.getElementById("studentTableBody");

    if (students.length === 0) {
        tableBody.innerHTML =
            '<tr><td colspan="6" class="empty">No students found.</td></tr>';
        return;
    }

    tableBody.innerHTML = students.map(s => `
        <tr>
            <td>${s.id}</td>
            <td>${escapeHtml(s.name)}</td>
            <td>${escapeHtml(s.email)}</td>
            <td>${escapeHtml(s.course)}</td>
            <td>${escapeHtml(s.phone)}</td>
            <td>
                <button class="btn btn-small btn-edit" data-action="edit" data-id="${s.id}">Edit</button>
                <button class="btn btn-small btn-delete" data-action="delete" data-id="${s.id}">Delete</button>
            </td>
        </tr>
    `).join("");
}

// ---------- 4. Load all students (READ) ----------
async function loadStudents() {
    try {
        const response = await fetch(API_URL);
        students = await response.json();
        renderTable();
    } catch (error) {
        document.getElementById("studentTableBody").innerHTML =
            '<tr><td colspan="6" class="empty">Could not load data. Is the app running?</td></tr>';
    }
}

// ---------- 5. Search ----------
let searchTimer;

document.getElementById("searchInput").addEventListener("input", function () {
    clearTimeout(searchTimer);
    const keyword = this.value.trim();

    // wait 300 ms after typing stops, so we don't call the server on every key
    searchTimer = setTimeout(async function () {
        if (keyword === "") {
            loadStudents();
            return;
        }
        try {
            const response = await fetch(API_URL + "/search?keyword=" + encodeURIComponent(keyword));
            students = await response.json();
            renderTable();
        } catch (error) {
            showToast("Search failed", "error");
        }
    }, 300);
});

// ---------- 6. Open and close the pop-up form ----------
const modal = document.getElementById("studentModal");
const form = document.getElementById("studentForm");

function showFormMessage(text) {
    const box = document.getElementById("formMessage");
    box.textContent = text;
    box.className = text ? "message error" : "message";
}

function openModal(student) {
    form.reset();
    showFormMessage("");

    if (student) {
        editingId = student.id;
        document.getElementById("modalTitle").textContent = "Edit Student";
        document.getElementById("name").value = student.name || "";
        document.getElementById("email").value = student.email || "";
        document.getElementById("course").value = student.course || "";
        document.getElementById("phone").value = student.phone || "";
    } else {
        editingId = null;
        document.getElementById("modalTitle").textContent = "Add Student";
    }
    modal.classList.add("open");
}

function closeModal() {
    modal.classList.remove("open");
}

document.getElementById("addBtn").addEventListener("click", function () {
    openModal(null);
});

document.getElementById("cancelBtn").addEventListener("click", closeModal);

// ---------- 7. Save: ADD (POST) or UPDATE (PUT) ----------
form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const student = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        course: document.getElementById("course").value.trim(),
        phone: document.getElementById("phone").value.trim()
    };

    // Validation
    if (student.name.length < 2) {
        showFormMessage("Name must be at least 2 characters");
        return;
    }
    if (!/^\d{10}$/.test(student.phone)) {
        showFormMessage("Phone must be exactly 10 digits");
        return;
    }

    const isEditing = editingId !== null;
    const url = isEditing ? API_URL + "/" + editingId : API_URL;
    const method = isEditing ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(student)
        });

        if (response.ok) {
            closeModal();
            showToast(isEditing ? "Student updated" : "Student added", "success");
            document.getElementById("searchInput").value = "";
            loadStudents();
        } else {
            showFormMessage("Could not save the student");
        }
    } catch (error) {
        showFormMessage("Cannot connect to the server");
    }
});

// ---------- 8. Edit and Delete buttons in the table ----------
document.getElementById("studentTableBody").addEventListener("click", async function (event) {
    const button = event.target.closest("button");
    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;

    if (action === "edit") {
        const student = students.find(s => s.id === id);
        openModal(student);
    }

    if (action === "delete") {
        if (!confirm("Are you sure you want to delete this student?")) {
            return;
        }
        try {
            const response = await fetch(API_URL + "/" + id, { method: "DELETE" });
            if (response.ok) {
                showToast("Student deleted", "success");
                document.getElementById("searchInput").value = "";
                loadStudents();
            } else {
                showToast("Could not delete the student", "error");
            }
        } catch (error) {
            showToast("Cannot connect to the server", "error");
        }
    }
});

// ---------- 9. Start ----------
loadStudents();
