# Employee Management System

A full-stack Employee Management System built using **Django REST Framework** and **Vanilla JavaScript**, featuring dynamic form creation, employee management, JWT authentication, and user-specific data isolation.

---

## 🚀 Features

- User Authentication (Register, Login, JWT)
- Profile Management & Change Password
- Dynamic Form Builder (Drag & Drop Fields)
- Create Employees based on selected Form Designs
- View, Edit, Delete Employees
- Modal-based UI for viewing details
- User-specific data isolation (each user sees only their data)

---

## 🛠 Tech Stack

### Backend
- Python
- Django
- Django REST Framework
- JWT Authentication
- SQLite

### Frontend
- HTML
- CSS
- Vanilla JavaScript
- Axios

---

## 📂 Project Structure

employee-management-system/
│
├── backend/
│   ├── accounts/
│   ├── forms/
│   ├── employee/
│   ├── core/
│   ├── manage.py
│
├── frontend/
│   ├── css/
│   ├── js/
│   ├── login.html
│   ├── register.html
│   ├── employee-list.html
│   ├── employee-create.html
│   ├── form-builder.html
│   ├── profile.html
│
└── README.md

---

## ⚙️ Backend Setup Instructions

### 1. Create Virtual Environment

python -m venv venv  
source venv/bin/activate

### 2. Install Dependencies

pip install django djangorestframework djangorestframework-simplejwt django-cors-headers

### 3. Run Migrations

python manage.py makemigrations  
python manage.py migrate

### 4. Start Backend Server

python manage.py runserver

Backend runs at:  
http://127.0.0.1:8000/

---

## 🌐 Frontend Setup Instructions

### 1. Open Frontend Folder

cd frontend


### 2. Run Frontend

python -m http.server 5500

### Entry Pages

- login.html → Login
- register.html → Register
- employee-list.html → Dashboard

---

## 🔐 Authentication Flow

- JWT stored in localStorage
- Protected routes redirect unauthenticated users
- Logout clears token
- Password change forces re-login

---

## 📌 Notes

- Users can access only their own forms and employees
- Backend enforces ownership-based access control
- SQLite is used for simplicity

---

## 👩‍💻 Author

**Rispa Joseph**  
Python / Full Stack Developer