# 📚 Book Review API (Node.js + Express)

A secure and scalable RESTful API for a Book Review system built using Node.js, Express, and MongoDB. This project demonstrates strong fundamentals in backend development, JWT-based authentication, and clean API architecture with modular structure. It supports user management, CRUD operations for books and reviews, search functionality, and token blacklist for secure logout.

---

## 🚀 Features

### 🔐 Authentication
- **JWT-based authentication**
- Secure password hashing using **bcrypt**
- Token **blacklisting** on logout for added security
- **Cookie-based** token storage for improved security and usability

### 👤 User Routes
| Method | Endpoint         | Description                        |
|--------|------------------|------------------------------------|
| POST   | `/api/auth/signup` | Register a new user                |
| POST   | `/api/auth/login`  | Authenticate and get JWT token     |
| GET    | `/api/auth/login`| Authenticate and Fetch user profile |
|GET| `/api/auth/logout`| Authenticate and Logout user and blacklist token |

### 📚 Books

| Method | Endpoint           | Description                                               |
|--------|--------------------|-----------------------------------------------------------|
| POST   | `/api/books`         | Add a new book *(requires authentication)*              |
| GET    | `/api/books`         | Authenticated and Get all books (with pagination and filters by author/genre) |
| GET    | `/api/books/:id`     | Authenticated and Get a book by ID (includes avg rating + reviews with pagination)     |
| PUT    | `/api/books/:id`     | Update book details (Authenticated, soft delete supported)     |
| DELETE    | `/api/books/:id`     | Soft delete a book (Authenticated)     |
| POST   | `/api/books/:id/reviews` | Authenticated and Submit a review for a book *(1 review per user per book)* |

### ✏️ Reviews

| Method | Endpoint         | Description                            |
|--------|------------------|----------------------------------------|
| PUT    | `/api/reviews/:id` | Update your own review                 |
| DELETE | `/api/reviews/:id` | Delete your own review                 |

### 🔍 Search

| Method | Endpoint      | Description                                |
|--------|---------------|--------------------------------------------|
| GET    | `/api/search?q=term` | Search by book title or author (partial match) |

---

## 🧠 Advanced Features

- **Soft Delete** for books using a flag (no hard deletion)
- **JWT Blacklisting** using a `BlacklistedToken` model (expires in 24h)
- **Cookie Support** for secure JWT handling
- **Express Validator** for validation
- **Modular Services Layer**:
  - User creation logic in `/services/userService.js`
  - Book creation logic in `/services/bookService.js`

---

## 📁 Project Structure

 server
  - contollers
      - book.controller.js
      -  review.controller.js
     - search.controller.js
     - user.controller.js
  - middlewares
    - auth.middleware.js
  - modles
    - blacklistToken.model.js
    - book.modle.js
    - review.model.js
    - user.model.js
  - routes
    - book.routes.js
    - review.routes.js
    - search.routes.js
    - user.routes.js
  - services
    - book.service.js
    - user.service.js
  - config
    - index.js
    - .env
    - db.js
    - README.md


---

## 📬 API Requests (via Postman)

### 🔐 Auth Routes

#### 📌 Signup  
**POST** `/api/signup`  
**Body (JSON):**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure123"
}
```
#### 📌 Login  
**POST** `/api/login`  
**Body (JSON):**
```json
{
  "email": "john@example.com",
  "password": "secure123"
}
```
#### 📌 Get User Profile  
**GET** `/api/profile`  
**Header:**
```json
Cookie: token=your_jwt_token 
```
#### 📌 Logout 
**GET** `/api/logout`  
**Header:**
```json
Cookie: token=your_jwt_token 
```
####  📘 Books Routes 
##### 📌 Add New Book
**POST** `/api/books`  
**Header:**
```json
Cookie: token=your_jwt_token 
```
**Body(JSON):**
```json
{
  "title": "The Alchemist",
  "author": "Paulo Coelho",
  "genre": "Fiction",
  "description": "A journey of self-discovery"
} 
```
##### 📌 Get All Books (with filters)
**GET** `/api/books?page=1&limit=10&author=Paulo Coelho&genre=Fiction`  
##### 📌  Get Book by ID (with average rating and reviews with pagination)
**GET** `/api/books/:id`  
##### 📌 Update Book
**PUT** `/api/books/:id`  
**Header:**
```json
Cookie: token=your_jwt_token 
```
**Body(JSON):**
```json
{
  "title": "Updated Title",
  "genre": "Adventure"
}
```
#### 📌 Soft Delete Book 
**DELETE** `/api/books/:id`  
**Header:**
```json
Cookie: token=your_jwt_token 
```
####  📝 Review Routes 
##### 📌 Add Review to a Book
**POST** `/api/books/:id/reviews`  
**Header:**
```json
Cookie: token=your_jwt_token 
```
**Body(JSON):**
```json
{
  "rating": 5,
  "comment": "Loved the book!"
}
```
##### 📌 Update a Review
**PUT** `/api/reviews/:id`  
**Header:**
```json
Cookie: token=your_jwt_token 
```
**Body(JSON):**
```json
{
  "rating": 4,
  "comment": "Updated comment."
}
```
##### 📌 Delete a Review
**DELETE** `/api/reviews/:id`  
**Header:**
```json
Cookie: token=your_jwt_token 
```
#### 🔍 Search Route
##### 📌 Delete a Review
**GET** `/api/search` 

---
#### 🛠️ Setup Instructions
1. Clone the Repository
```
git clone https://github.com/your-username/book-review-api.git
cd book-review-api/server
```
2. Install Dependencies
```
npm install
```
3. Setup Environment Variables
  - create a `.env` file:
```
PORT=5000
MONGODB_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
```
4. Run the Server
```
npm run dev
```

---
###🧾 Database Schema\
**User**
```
{
  "username": "String",
  "email": "String",
  "password": "Hashed String"
}
```

**Books**
```
{
  "title": "String",
  "author": "String",
  "genre": "String",
  "description": "String",
  "uploadedBy": "UserID",
  "isDeleted": "Boolean (for soft delete)"
  "timestamps"
}
```

**Review**
```
{
  "book": "BookID",
  "user": "UserID",
  "rating": "1 to 5",
  "comment": "String"
}
```

**Blacklisted Token**
```
{
  "token": "JWT Token String",
  "createdAt": "Date (auto-expire after 24h)"
}
```
---
### 💡 Design Decisions
- Used cookie-parser for secure cookie handling of JWT

- Implemented token blacklist for proper logout flow

- Applied soft delete to preserve data integrity

- Modularized services for clean logic separation (e.g., createUser, bookService)

- Used Express 5 for future-proof routing enhancements
---
### 📦 Dependencies
```
"dependencies": {
  "bcrypt": "^6.0.0",
  "cookie-parser": "^1.4.7",
  "dotenv": "^16.5.0",
  "express": "^5.1.0",
  "express-validator": "^7.2.1",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.15.0",
  "nodemon": "^3.1.10"
}
```