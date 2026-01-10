const token = localStorage.getItem("access");

// 🔐 Protect page
if (!token) {
    window.location.href = "login.html";
}

// Load profile data
axios.get("http://127.0.0.1:8000/api/auth/profile/", {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
        document.getElementById("username").innerText = res.data.username;
        document.getElementById("email").innerText = res.data.email;
    });

// ---------- MODAL CONTROLS ----------

function openPasswordModal() {
    document.getElementById("passwordModal").style.display = "block";
}

function closePasswordModal() {
    document.getElementById("passwordModal").style.display = "none";
    document.getElementById("oldPassword").value = "";
    document.getElementById("newPassword").value = "";
}

// ---------- CHANGE PASSWORD ----------

function changePassword() {
    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;

    if (!oldPassword || !newPassword) {
        alert("Please fill all fields");
        return;
    }

    axios.put(
            "http://127.0.0.1:8000/api/auth/change-password/", {
                old_password: oldPassword,
                new_password: newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            }
        )
        .then(() => {
            alert("Password changed successfully. Please login again.");
            localStorage.removeItem("access");
            window.location.href = "login.html";
        })
        .catch(err => {
            let message = "Password change failed";
            if (err.response && err.response.data) {
                if (err.response.data.old_password) {
                    message = err.response.data.old_password[0];
                } else if (err.response.data.new_password) {
                    message = err.response.data.new_password[0];
                }
            }
            alert(message);
        });
}

function goEmployee() {
    window.location.href = "employee-list.html";
}

function goBack() {
    window.history.back();
}