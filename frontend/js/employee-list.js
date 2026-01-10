// 🔐 Protect page
const token = localStorage.getItem("access");
if (!token) {
    window.location.href = "login.html";
}

let selectedEmployeeId = null;

/* =====================================================
   FETCH EMPLOYEES (LEFT SECTION)
===================================================== */

axios.get("http://127.0.0.1:8000/api/employees/", {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
        const list = document.getElementById("employeeList");
        list.innerHTML = "";

        if (res.data.length === 0) {
            list.innerHTML = "<li>No employees found</li>";
            return;
        }

        res.data.forEach((emp, index) => {
            // Find employee name field (label contains 'name')
            const nameField =
                emp.data.find(d =>
                    d.field_label && d.field_label.toLowerCase().includes("name")
                ) || emp.data[0];

            const li = document.createElement("li");
            li.className = "employee-card";

            li.innerHTML = `
            <span class="serial-no">${index + 1}.</span>
            <span class="employee-name"
                  onclick='openModal(${JSON.stringify(emp)})'>
                ${nameField.value}
            </span>
        `;

            list.appendChild(li);
        });
    })
    .catch(err => {
        console.error(err);
        alert("Failed to load employees");
    });


/* =====================================================
   FETCH FORMS (RIGHT SECTION)
===================================================== */

axios.get("http://127.0.0.1:8000/api/forms/", {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
        const formList = document.getElementById("formList");
        formList.innerHTML = "";

        if (res.data.length === 0) {
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

    })
    .catch(err => {
        console.error(err);
    });



/* =====================================================
   MODAL LOGIC
===================================================== */

function openModal(employee) {
    selectedEmployeeId = employee.id;

    document.getElementById("employeeModal").style.display = "block";

    const nameField =
        employee.data.find(d =>
            d.field_label && d.field_label.toLowerCase().includes("name")
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
   FORM MODAL LOGIC
===================================================== */

let selectedFormId = null;

function openFormModal(form) {
    selectedFormId = form.id;

    document.getElementById("formModal").style.display = "block";

    document.getElementById("modalFormName").innerText = form.name;

    const fieldsDiv = document.getElementById("modalFormFields");
    fieldsDiv.innerHTML = "";

    if (!form.fields || form.fields.length === 0) {
        fieldsDiv.innerHTML = "<p>No fields available</p>";
    } else {
        form.fields.forEach((field, index) => {
            fieldsDiv.innerHTML += `
                <div class="form-field-row">
                    <strong>${index + 1}. ${field.label}</strong>
                    <span> (${field.field_type})</span>
                </div>
            `;
        });
    }

    document.getElementById("deleteFormBtn").onclick = deleteForm;
}


function closeFormModal() {
    document.getElementById("formModal").style.display = "none";
    selectedFormId = null;
}


function deleteForm() {
    if (!selectedFormId) return;

    if (!confirm("Are you sure you want to delete this form?")) return;

    axios.delete(`http://127.0.0.1:8000/api/forms/${selectedFormId}/delete/`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            alert("Form deleted successfully");
            closeFormModal();
            location.reload();
        })
        .catch(err => {
            console.error(err);
            alert("Error deleting form");
        });
}




/* =====================================================
   DELETE EMPLOYEE
===================================================== */

function deleteEmployee(id) {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    axios.delete(`http://127.0.0.1:8000/api/employees/${id}/delete/`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            alert("Employee deleted");
            closeModal();
            location.reload();
        })
        .catch(err => {
            console.error(err);
            alert("Error deleting employee");
        });
}


/* =====================================================
   EDIT EMPLOYEE
===================================================== */

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