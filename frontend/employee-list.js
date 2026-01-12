// 🔐 Protect page
const token = localStorage.getItem("access");
if (!token) {
    window.location.href = "login.html";
}

const EMPLOYEE_API = "http://127.0.0.1:8000/api/employees/";
const FORM_API = "http://127.0.0.1:8000/api/forms/";

let allEmployees = [];
let currentEmployee = null;
let selectedEmployeeId = null;
let selectedFormId = null;
let isEditing = false;

/* ===========================
   HELPERS
=========================== */

function getEmployeeName(employee) {
    if (!employee || !employee.data || !employee.data.length) {
        return "Employee";
    }

    const nameField = employee.data.find(item =>
        String(item.field_label || "").toLowerCase().includes("name")
    );

    return nameField && nameField.value ? nameField.value : "Employee";
}

/* ===========================
   LOAD EMPLOYEES
=========================== */

function loadEmployees() {
    axios.get(EMPLOYEE_API, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            allEmployees = res.data || [];
            renderEmployees(allEmployees);
        })
        .catch(() => {
            alert("Failed to load employees");
        });
}

/* ===========================
   RENDER EMPLOYEES
=========================== */

function renderEmployees(employees) {
    const list = document.getElementById("employeeList");
    list.innerHTML = "";

    if (!employees.length) {
        list.innerHTML = "<li>No employees found</li>";
        return;
    }

    employees.forEach((emp, index) => {
        const li = document.createElement("li");
        li.className = "employee-card";

        li.innerHTML = `
            <span class="serial-no">${index + 1}.</span>
            <span class="employee-name">${getEmployeeName(emp)}</span>
        `;

        li.onclick = () => openEmployeeModal(emp);
        list.appendChild(li);
    });
}

/* ===========================
   🔍 LIVE SEARCH (ANY FIELD)
=========================== */

function onSearchInput(e) {
    const query = e.target.value.toLowerCase().trim();

    if (!query) {
        renderEmployees(allEmployees);
        return;
    }

    const filtered = allEmployees.filter(emp =>
        emp.data.some(item =>
            String(item.value || "").toLowerCase().includes(query)
        )
    );

    renderEmployees(filtered);
}

/* ===========================
   FETCH FORMS
=========================== */

axios.get(FORM_API, {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
        const formList = document.getElementById("formList");
        formList.innerHTML = "";

        const forms = res.data || [];

        if (!forms.length) {
            formList.innerHTML = "<li>No forms created</li>";
            return;
        }

        forms.forEach((form, index) => {
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

/* ===========================
   EMPLOYEE MODAL
=========================== */

function openEmployeeModal(employee) {
    currentEmployee = employee;
    selectedEmployeeId = employee.id;
    isEditing = false;

    document.getElementById("employeeModal").style.display = "block";
    document.getElementById("modalEmployeeName").innerText =
        getEmployeeName(employee);

    renderEmployeeDetails(employee.data, false);

    document.getElementById("editBtn").style.display = "inline-block";
    document.getElementById("saveBtn").style.display = "none";

    document.getElementById("editBtn").onclick = enableEditMode;
    document.getElementById("saveBtn").onclick = saveEmployeeChanges;
    document.getElementById("deleteBtn").onclick = () =>
        deleteEmployee(selectedEmployeeId);
}

function renderEmployeeDetails(data, editable) {
    const container = document.getElementById("modalEmployeeDetails");
    container.innerHTML = "";

    data.forEach(item => {
        const label = item.field_label || "Field";
        const value = item.value || "";

        if (editable) {
            container.innerHTML += `
                <div class="employee-field">
                    <label>${label}</label>
                    <input
                        type="text"
                        value="${value}"
                        data-field-id="${item.field}"
                    />
                </div>
            `;
        } else {
            container.innerHTML += `
                <div class="employee-field">
                    <strong>${label}:</strong> ${value}
                </div>
            `;
        }
    });
}

function enableEditMode() {
    isEditing = true;
    renderEmployeeDetails(currentEmployee.data, true);

    document.getElementById("editBtn").style.display = "none";
    document.getElementById("saveBtn").style.display = "inline-block";
}

function saveEmployeeChanges() {
    const updatedData = [];

    document.querySelectorAll("#modalEmployeeDetails input").forEach(input => {
        updatedData.push({
            field: input.dataset.fieldId,
            value: input.value
        });
    });

    axios.put(
            `${EMPLOYEE_API}${selectedEmployeeId}/update/`, { data: updatedData }, { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(() => {
            alert("Employee updated successfully");
            closeModal();
            loadEmployees();
        })
        .catch(() => {
            alert("Failed to update employee");
        });
}

function closeModal() {
    document.getElementById("employeeModal").style.display = "none";
}

/* ===========================
   FORM MODAL
=========================== */

function openFormModal(form) {
    selectedFormId = form.id;
    document.getElementById("formModal").style.display = "block";
    document.getElementById("modalFormName").innerText = form.name;

    const container = document.getElementById("modalFormFields");
    container.innerHTML = "";

    if (!form.fields || !form.fields.length) {
        container.innerHTML = "<p>No fields available</p>";
        return;
    }

    form.fields.forEach((field, index) => {
        container.innerHTML += `
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
    if (!confirm("Delete this form?")) return;

    axios.delete(`${FORM_API}${selectedFormId}/delete/`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            alert("Form deleted");
            closeFormModal();
            loadEmployees();
        });
}

/* ===========================
   DELETE EMPLOYEE
=========================== */

function deleteEmployee(id) {
    if (!confirm("Delete this employee?")) return;

    axios.delete(`${EMPLOYEE_API}${id}/delete/`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            alert("Employee deleted");
            closeModal();
            loadEmployees();
        });
}

/* ===========================
   NAVIGATION
=========================== */

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

/* ===========================
   INIT
=========================== */

loadEmployees();