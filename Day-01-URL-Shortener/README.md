# 🚀 Day 1 - URL Shortener API

A simple and efficient REST API that converts long URLs into short, easy-to-share links. The project is built using **Node.js**, **Express.js**, and **MongoDB**, and stores each generated short URL along with its original link and click statistics.

This project is a great introduction to backend development, covering REST APIs, database operations, request validation, and error handling.

---

## 📌 Technologies Used

* **Node.js** – JavaScript runtime for building the backend.
* **Express.js** – Framework for creating REST APIs.
* **MongoDB** – Database used to store URL information.
* **Mongoose** – ODM for interacting with MongoDB.
* **NanoID** – Generates unique and short URL codes.

---

## ✨ Features

* Generate short URLs from long URLs.
* Redirect users to the original website using the short link.
* Validate URLs before storing them.
* Track the number of times each short URL is visited.
* Prevent duplicate entries by reusing existing short URLs for the same link.
* Global error handling for better API responses.

---

## 📁 API Endpoints

### Create a Short URL

```http
POST /api/shorten
```

Creates a new short URL for the provided long URL.

---

### Redirect to Original URL

```http
GET /:shortCode
```

Redirects the user to the original URL associated with the given short code.

---

## ▶️ Run the Project Locally

### Install Dependencies

```bash
npm install
```

### Start the Development Server

```bash
npm run dev
```

The server will start on the configured port and the API will be ready to accept requests.

---

## 🎯 Learning Outcomes

Through this project, you'll learn how to:

* Build REST APIs using Express.js.
* Connect a Node.js application with MongoDB.
* Perform CRUD operations using Mongoose.
* Generate unique identifiers with NanoID.
* Handle request validation and errors.
* Implement URL redirection and click tracking.

---

## 👨‍💻 Author

**Nikhil Reddy**

Backend Developer | MERN Stack Developer

**7 Days Backend Challenge** 🚀
