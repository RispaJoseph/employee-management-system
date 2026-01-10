// Get JWT token
const token = localStorage.getItem("access");

// Get container AFTER DOM is loaded (script is at bottom of HTML)
const container = document.getElementById("fieldsContainer");

/**
 * Add a new field row (Label + Input Type)
 */
function addField() {
    const div = document.createElement("div");
    div.className = "field-row";

    div.innerHTML = `
        <input type="text" placeholder="Label" />
        <select>
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="date">Date</option>
            <option value="password">Password</option>
        </select>
    `;

    container.appendChild(div);
}

/**
 * Save form and fields
 */
function saveForm() {
    const formName = document.getElementById("formName").value;

    if (!formName) {
        alert("Form name required");
        return;
    }

    // 1️⃣ Create Form
    axios.post(
            "http://127.0.0.1:8000/api/forms/", { name: formName }, { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(res => {
            const formId = res.data.id;
            const rows = document.querySelectorAll(".field-row");

            if (rows.length === 0) {
                alert("Please add at least one field");
                return Promise.reject();
            }

            // 2️⃣ Create Fields
            const requests = [];

            rows.forEach((row, index) => {
                const label = row.children[0].value;
                const fieldType = row.children[1].value;

                if (!label) return;

                requests.push(
                    axios.post(
                        "http://127.0.0.1:8000/api/forms/fields/", {
                            form: formId,
                            label: label,
                            field_type: fieldType,
                            order: index + 1 // Order from drag & drop position
                        }, { headers: { Authorization: `Bearer ${token}` } }
                    )
                );
            });

            return Promise.all(requests);
        })
        .then(() => {
            alert("Form saved successfully");
            // ✅ Redirect to employee list page
            window.location.href = "employee-list.html";
        })
        .catch(err => {
            console.error(err);
            alert("Error saving form");
        });
}

// 🔥 Enable drag & drop sorting
new Sortable(container, {
    animation: 150,
    ghostClass: "sortable-ghost"
});

// 🔹 Add one field by default on page load
addField();


function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = "employee-list.html";
    }
}


function logout() {
    localStorage.removeItem("access");
    window.location.href = "login.html";
}