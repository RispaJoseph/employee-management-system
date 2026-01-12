// 🔐 Protect page
const token = localStorage.getItem("access");
if (!token) {
    window.location.href = "login.html";
}

const EMPLOYEE_API = "http://127.0.0.1:8000/api/employees/";
const FORM_API = "http://127.0.0.1:8000/api/forms/";

let selectedEmployeeId = null;
let selectedFormId = null;

/* =====================================================
   LOAD EMPLOYEES (WITH OPTIONAL SEARCH)
===================================================== */

function loadEmployees(search = "") {
    let url = EMPLOYEE_API;

    if (search) {
        url += `?search=${encodeURIComponent(search)}`;
    }

    axios.get(url, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            renderEmployees(res.data);
        })
        .catch(() => {
            alert("Failed to load employees");
        });
}

/* =====================================================
   RENDER EMPLOYEES
===================================================== */

function renderEmployees(employees) {
    const list = document.getElementById("employeeList");
    list.innerHTML = "";

    if (!employees.length) {
        list.innerHTML = "<li>No employees found</li>";
        return;
    }

    employees.forEach((emp, index) => {
        const nameField =
            emp.data.find(d =>
                d.field_label &&
                d.field_label.toLowerCase().includes("name")
            ) || emp.data[0];

        const li = document.createElement("li");
        li.className = "employee-card";

        li.innerHTML = `
            <span class="serial-no">${index + 1}.</span>
            <span class="employee-name" onclick='openEmployeeModal(${JSON.stringify(emp)})'>
                ${nameField.value}
            </span>
        `;

        list.appendChild(li);
    });
}

/* =====================================================
   🔍 LIVE SEARCH (SERVER SIDE)
===================================================== */

function onSearchInput(e) {
    const query = e.target.value.trim();
    loadEmployees(query);
}

/* =====================================================
   FETCH FORMS (RIGHT SECTION)
===================================================== */

axios.get(FORM_API, {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
        const formList = document.getElementById("formList");
        formList.innerHTML = "";

        if (!res.data.length) {
            formList.innerHTML = "<li>No forms created</li>";
            return;
        }

        res.data.forEach((form, index) => {
            const li = document.createElement("li");
            li.className = "form-card";

            li.innerHTML = `
            <span class="serial-no">${index + 1}.</span>
            <span class="employee-name">${form.name}</span>
        `;

            li.onclick = () => openFormModal(form);
            formList.appendChild(li);
        });
    });

/* =====================================================
   EMPLOYEE MODAL
===================================================== */

function openEmployeeModal(employee) {
    selectedEmployeeId = employee.id;
    document.getElementById("employeeModal").style.display = "block";

    const nameField =
        employee.data.find(d =>
            d.field_label &&
            d.field_label.toLowerCase().includes("name")
        ) || employee.data[0];

    document.getElementById("modalEmployeeName").innerText = nameField.value;

    const detailsDiv = document.getElementById("modalEmployeeDetails");
    detailsDiv.innerHTML = "";

    employee.data.forEach(item => {
        detailsDiv.innerHTML += `
            <div class="employee-field">
                <strong>${item.field_label}:</strong> ${item.value}
            </div>
        `;
    });

    document.getElementById("deleteBtn").onclick =
        () => deleteEmployee(selectedEmployeeId);

    document.getElementById("editBtn").onclick =
        () => editEmployee(employee);
}

function closeModal() {
    document.getElementById("employeeModal").style.display = "none";
}

/* =====================================================
   FORM MODAL
===================================================== */

function openFormModal(form) {
    selectedFormId = form.id;
    document.getElementById("formModal").style.display = "block";

    document.getElementById("modalFormName").innerText = form.name;

    const fieldsDiv = document.getElementById("modalFormFields");
    fieldsDiv.innerHTML = "";

    if (!form.fields || !form.fields.length) {
        fieldsDiv.innerHTML = "<p>No fields available</p>";
        return;
    }

    form.fields.forEach((field, index) => {
        fieldsDiv.innerHTML += `
            <div class="form-field-row">
                <strong>${index + 1}. ${field.label}</strong>
                <span> (${field.field_type})</span>
            </div>
        `;
    });

    document.getElementById("deleteFormBtn").onclick = deleteForm;
}

function closeFormModal() {
    document.getElementById("formModal").style.display = "none";
    selectedFormId = null;
}

function deleteForm() {
    if (!confirm("Are you sure you want to delete this form?")) return;

    axios.delete(`${FORM_API}${selectedFormId}/delete/`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            alert("Form deleted successfully");
            closeFormModal();
            loadEmployees();
        })
        .catch(() => {
            alert("Failed to delete form");
        });
}

/* =====================================================
   DELETE / EDIT EMPLOYEE
===================================================== */

function deleteEmployee(id) {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    axios.delete(`${EMPLOYEE_API}${id}/delete/`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            alert("Employee deleted");
            closeModal();
            loadEmployees();
        })
        .catch(() => {
            alert("Failed to delete employee");
        });
}

function editEmployee(employee) {
    sessionStorage.setItem("editEmployee", JSON.stringify(employee));
    window.location.href = "employee-create.html";
}

/* =====================================================
   NAVIGATION
===================================================== */

function goToCreate() {
    window.location.href = "employee-create.html";
}

function goToProfile() {
    window.location.href = "profile.html";
}

function logout() {
    localStorage.removeItem("access");
    window.location.href = "login.html";
}

/* =====================================================
   INITIAL LOAD
===================================================== */

loadEmployees();