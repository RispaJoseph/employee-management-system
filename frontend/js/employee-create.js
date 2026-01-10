// 🔐 Auth check
const token = localStorage.getItem("access");
if (!token) {
    window.location.href = "login.html";
}

const selector = document.getElementById("formSelector");
const formEl = document.getElementById("employeeForm");

let forms = [];
let selectedForm = null;

/* ==============================
   FETCH FORMS
============================== */
axios.get("http://127.0.0.1:8000/api/forms/", {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
        console.log("FORMS:", res.data); // 🔍 DEBUG

        forms = res.data;

        if (!forms.length) {
            alert("No forms available. Please create a form first.");
            window.location.href = "form-builder.html";
            return;
        }

        forms.forEach(form => {
            const option = document.createElement("option");
            option.value = form.id;
            option.textContent = form.name;
            selector.appendChild(option);
        });
    })
    .catch(err => {
        console.error("FORM FETCH ERROR:", err);
        alert("Failed to load forms");
    });


/* ==============================
   FORM CHANGE HANDLER
============================== */
selector.addEventListener("change", function() {
    const formId = this.value;
    selectedForm = forms.find(f => f.id == formId);

    formEl.innerHTML = ""; // clear previous fields

    if (!selectedForm) return;

    selectedForm.fields.forEach(field => {
        const wrapper = document.createElement("div");
        wrapper.className = "form-group";

        const label = document.createElement("label");
        label.textContent = field.label;

        const input = document.createElement("input");
        input.type = field.field_type;
        input.placeholder = field.label;
        input.dataset.fieldId = field.id;

        wrapper.appendChild(label);
        wrapper.appendChild(input);
        formEl.appendChild(wrapper);
    });
});


/* ==============================
   SUBMIT EMPLOYEE
============================== */
function submitEmployee() {
    if (!selectedForm) {
        alert("Please select a form");
        return;
    }

    const data = [];

    document.querySelectorAll("#employeeForm input").forEach(input => {
        data.push({
            field: input.dataset.fieldId,
            value: input.value
        });
    });

    axios.post(
            "http://127.0.0.1:8000/api/employees/create/", { form: selectedForm.id, data }, { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(() => {
            alert("Employee created successfully");
            window.location.href = "employee-list.html";
        })
        .catch(err => {
            console.error(err);
            alert("Error creating employee");
        });
}

function goBack() {
    window.history.back();
}

function logout() {
    localStorage.removeItem("access");
    window.location.href = "login.html";
}