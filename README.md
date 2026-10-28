# Course & Category REST API (Modular MVC Architecture)

A complete REST API built with **Express.js**, following **Modular MVC Architecture** principles. Includes User Authentication, Category CRUD, and Course CRUD operations.

---

## 📁 Modular MVC Architecture

Unlike flat MVC structures, Modular MVC organizes code by domain feature/module. Each module encapsulates its own routes, controller, and data model:

```text
express-modular-api/
├── .env                              # Environment configuration
├── .gitignore                        # Git ignore rules
├── package.json                      # Project dependencies & scripts
├── server.js                         # Application entry point
├── postman_collection.json           # Pre-configured Postman test collection
└── src/
    ├── config/
    │   └── db.js                     # MongoDB connection with safe test fallback
    ├── middlewares/
    │   ├── auth.middleware.js        # JWT token verification
    │   └── error.middleware.js       # 404 route handler & global error handler
    └── modules/
        ├── auth/
        │   ├── auth.controller.js    # Register & Login logic
        │   ├── auth.routes.js        # /api/auth endpoints
        │   └── user.model.js         # User schema & storage
        ├── category/
        │   ├── category.controller.js# Category CRUD logic
        │   ├── category.routes.js    # /api/categories endpoints
        │   └── category.model.js     # Category schema & storage
        └── course/
            ├── course.controller.js  # Course CRUD logic
            ├── course.routes.js      # /api/courses endpoints
            └── course.model.js       # Course schema & storage
```

---

## 🚀 Quick Setup & Running

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
The default `.env` is already configured:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/course_portal
JWT_SECRET=my_simple_secret_key_12345
JWT_EXPIRE=7d
```
> **Note:** If local MongoDB is running, it connects automatically. If MongoDB is not installed or running, the API automatically uses in-memory mode so you can test all endpoints in Postman immediately without any configuration errors!

### 3. Start the Server
```bash
npm start
```
The server will start at `http://localhost:5000`.

---

## 📌 API Endpoints Overview

### 1. Authentication Module (`/api/auth`)
| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user (name, email, password) | `201 Created` / `400 Bad Request` |
| `POST` | `/api/auth/login` | Login user and obtain JWT token | `200 OK` / `400 Bad Request` |
| `GET` | `/api/auth/profile` | Get current logged-in user (Protected) | `200 OK` / `401 Unauthorized` |

### 2. Category Module (`/api/categories`)
| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/categories` | Create category (name required) | `201 Created` / `400 Bad Request` |
| `GET` | `/api/categories` | Get all categories | `200 OK` |
| `GET` | `/api/categories/:id`| Get single category by ID | `200 OK` / `404 Not Found` |
| `PUT` | `/api/categories/:id`| Update category by ID | `200 OK` / `404 Not Found` |
| `DELETE`| `/api/categories/:id`| Delete category by ID | `200 OK` / `404 Not Found` |

### 3. Course Module (`/api/courses`)
| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/courses` | Create course (title, description, price, category) | `201 Created` / `400 Bad Request` |
| `GET` | `/api/courses` | Get all courses | `200 OK` |
| `GET` | `/api/courses/:id` | Get single course by ID | `200 OK` / `404 Not Found` |
| `PUT` | `/api/courses/:id` | Update course by ID | `200 OK` / `404 Not Found` |
| `DELETE`| `/api/courses/:id` | Delete course by ID | `200 OK` / `404 Not Found` |

---

## 📸 Postman Evidence Guide (The 5 Mandatory Screenshots)

Import `postman_collection.json` directly into Postman (**File -> Import**).

1. **Screenshot 1: Successful `/register` and `/login`**
   - **Register:** `POST http://localhost:5000/api/auth/register`
     - Body (JSON): `{"name": "Ali Khan", "email": "ali@example.com", "password": "pass1234"}`
     - Status: `201 Created`
   - **Login:** `POST http://localhost:5000/api/auth/login`
     - Body (JSON): `{"email": "ali@example.com", "password": "pass1234"}`
     - Status: `200 OK`

2. **Screenshot 2: `POST /api/categories` with 201 Created**
   - Method & URL: `POST http://localhost:5000/api/categories`
   - Body (JSON): `{"name": "Web Development", "description": "Frontend and Backend courses"}`
   - Status: `201 Created`

3. **Screenshot 3: `GET /api/categories` with 200 OK**
   - Method & URL: `GET http://localhost:5000/api/categories`
   - Status: `200 OK`

4. **Screenshot 4: 400 Bad Request validation error (Missing required field)**
   - Method & URL: `POST http://localhost:5000/api/categories`
   - Body (JSON): `{"description": "No name provided here"}`
   - Status: `400 Bad Request`
   - Response: `{"success": false, "message": "Category name is required."}`

5. **Screenshot 5: 404 Route Not Found error (Invalid ID or unknown URL)**
   - Method & URL: `GET http://localhost:5000/api/categories/invalid-id-999`
   - Status: `404 Not Found`
   - Response: `{"success": false, "message": "Category not found with id: invalid-id-999"}`
   - *(Alternative)* `GET http://localhost:5000/api/unknown-url` -> Status `404 Not Found`
