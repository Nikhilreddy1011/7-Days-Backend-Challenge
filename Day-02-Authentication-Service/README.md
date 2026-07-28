# 🔐 Authentication & Authorization Service

A secure RESTful Authentication & Authorization API built using **Node.js**, **Express.js**, **MongoDB**, **JWT**, and **bcryptjs**.

This project demonstrates modern backend authentication practices including user registration, login, password hashing, JWT authentication, protected routes, role-based authorization, request validation, and centralized error handling.

---

# 🚀 Features

- User Registration
- User Login
- Password Hashing using bcryptjs
- JWT Authentication
- Protected Routes
- Role-Based Authorization (Admin/User)
- Input Validation using express-validator
- Global Error Handling
- MongoDB Integration with Mongoose
- Environment Variable Configuration

---

# 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- express-validator
- dotenv
- Nodemon

---

# 📂 Project Structure

```
Day-02-Authentication-Service
│
├── config
│   └── db.js
│
├── controllers
│   ├── authController.js
│   └── userController.js
│
├── middleware
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   └── errorMiddleware.js
│
├── models
│   └── User.js
│
├── routes
│   ├── authRoutes.js
│   └── userRoutes.js
│
├── utils
│   └── generateToken.js
│
├── .env.example
├── app.js
├── package.json
└── README.md
```

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/7-Days-Backend-Challenge.git
```

Move to the project folder

```bash
cd 7-Days-Backend-Challenge/Day-02-Authentication-Service
```

Install dependencies

```bash
npm install
```

Create a `.env` file using `.env.example`

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

JWT_EXPIRES_IN=1d
```

Start the development server

```bash
npm run dev
```

Server

```
http://localhost:5000
```

---

# 📌 API Endpoints

## Register

```
POST /api/auth/register
```

Body

```json
{
    "name":"Nikhil",
    "email":"nikhil@gmail.com",
    "password":"123456"
}
```

---

## Login

```
POST /api/auth/login
```

Body

```json
{
    "email":"nikhil@gmail.com",
    "password":"123456"
}
```

---

## Logout

```
POST /api/auth/logout
```

---

## Get Profile

```
GET /api/users/profile
```

Header

```
Authorization: Bearer YOUR_TOKEN
```

---

## Get All Users (Admin Only)

```
GET /api/users
```

Header

```
Authorization: Bearer YOUR_TOKEN
```

---

# 🔑 Authentication Flow

```
User Register
        │
        ▼
Password Hashed using bcrypt
        │
        ▼
Stored in MongoDB
        │
        ▼
User Login
        │
        ▼
Password Verification
        │
        ▼
JWT Generated
        │
        ▼
Client Stores Token
        │
        ▼
Protected Routes
        │
        ▼
JWT Verification
        │
        ▼
Access Granted
```

---

# 🗄 Database Schema

```
User
│
├── name
├── email
├── password
├── role
├── createdAt
└── updatedAt
```

---

# 🔒 Security Features

- Password Hashing using bcryptjs
- JWT Authentication
- Environment Variables
- Protected Routes
- Role-Based Authorization
- Input Validation
- Global Error Handling

---

# 🧪 Testing

Use Postman or Thunder Client.

### Register

```
POST /api/auth/register
```

### Login

```
POST /api/auth/login
```

### Profile

```
GET /api/users/profile
```

### Admin

```
GET /api/users
```

---

# 📚 Concepts Learned

- Express Routing
- MVC Architecture
- MongoDB CRUD
- Authentication
- Authorization
- JWT
- bcrypt
- Middleware
- Request Validation
- Error Handling
- REST API Design

---

# 🚀 Future Improvements

- Refresh Tokens
- Email Verification
- Forgot Password
- Reset Password
- OTP Authentication
- Swagger Documentation
- Docker Support
- Unit Testing
- Rate Limiting
- Cookie-Based Authentication

---

# 👨‍💻 Author

**Nikhil Reddy Modugu**

GitHub: https://github.com/Nikhilreddy1011/

---

# ⭐ If you found this project useful, consider giving it a star!