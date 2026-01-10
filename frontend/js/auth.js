function login() {
    axios.post('http://127.0.0.1:8000/api/auth/login/', {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        })
        .then(res => {
            localStorage.setItem('access', res.data.access);
            alert("Login successful");
            window.location.href = "employee-list.html";
        })
        .catch(() => {
            alert("Invalid credentials");
        });
}

function register() {
    axios.post('http://127.0.0.1:8000/api/auth/register/', {
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            password2: document.getElementById('password2').value
        })
        .then(() => {
            alert("Registration successful. Please login.");
            window.location.href = "login.html";
        })
        .catch(err => {
            alert("Registration failed");
        });
}