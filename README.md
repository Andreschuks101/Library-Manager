# School Library Management API

A production-ready RESTful API for managing a school library, built with **Node.js**, **Express**, and **MongoDB**.

## 🚀 Features

- **Book Management**: Full CRUD for books with unique ISBN tracking.
- **Author Module**: Manage book authors with bio and personal details.
- **Student & Attendant Registration**: Tracking for both library members and staff.
- **Borrow & Return System**: Automated book status updates (`IN`/`OUT`) and reference tracking.
- **JWT Authentication**: Secure endpoints for staff/admin operations.
- **Search & Pagination**: Find books by title or author with paginated results.
- **Overdue Tracking**: Real-time `isOverdue` status for borrowed books.
- **Clean Architecture**: Follows MVC pattern and uses systematic validation middleware.

---

## 🛠️ Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (using [Mongoose](https://mongoosejs.com/))
- **Security**: [bcryptjs](https://www.npmjs.com/package/bcryptjs) (Hashing), [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) (Auth)
- **Logging**: [morgan](https://www.npmjs.com/package/morgan)
- **Security Middleware**: [helmet](https://helmetjs.github.io/)

---

## ⚙️ Setup & Installation

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally or a MongoDB Atlas URI.

### 2. Clone the Repository
```bash
git clone https://github.com/Andreschuks101/Library-Manager.git
cd Library-Manager
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Environment Variables
Create a `.env` file in the root directory and add the following:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/librarydb
JWT_SECRET=your_jwt_secret_key
```

### 5. Start the Server
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
node app.js
```

---

## 📖 API Documentation

### 🔐 Authentication
*   **POST** `/api/auth/register`: Create a new staff/admin account.
*   **POST** `/api/auth/login`: Log in and receive a Bearer Token.

> [!NOTE]
> All protected routes require the `Authorization` header: `Bearer <your_token>`

### 📚 Books
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/books` | List books (Search & Pagination) | No |
| `GET` | `/api/books/:id` | Get book details (Populates authors/borrower) | No |
| `POST` | `/api/books` | Add a new book | Yes |
| `PUT` | `/api/books/:id` | Update book details | Yes |
| `DELETE` | `/api/books/:id` | Remove a book | Yes |
| `POST` | `/api/books/:id/borrow` | Borrow a book | Yes |
| `POST` | `/api/books/:id/return` | Return a book | Yes |

#### Search & Pagination Examples:
- **Search by title**: `/api/books?search=Lord Of The Rings`
- **Search by author**: `/api/books?author=Tolkien`
- **Paginate**: `/api/books?page=1&limit=5`

---

### ✍️ Authors
*   **GET** `/api/authors`: List all authors. (Public)
*   **GET** `/api/authors/:id`: Get author details. (Public)
*   **POST** `/api/authors`: Add an author. (Protected)
*   **PUT** `/api/authors/:id`: Update author info. (Protected)
*   **DELETE** `/api/authors/:id`: Remove an author. (Protected)

---

### 🎓 Students & Attendants
*   **POST** `/api/students`: Register a student (Protected).
*   **GET** `/api/students`: List registered students (Protected).
*   **POST** `/api/attendants`: Register a library attendant (Protected).
*   **GET** `/api/attendants`: List all attendants (Protected).

---

## 🧐 Bonus Logic

### Overdue Check
The `Book` model includes a virtual property `isOverdue`. If a book is `OUT` and the `returnDate` is earlier than the current time, the API response will automatically include `"isOverdue": true`.

### Duplicate ISBN Prevention
The system strictly enforces unique ISBNs in the database. Any attempt to create or update a book with an existing ISBN will result in a `400 Bad Request` error.

---

## 📄 License
[MIT](LICENSE)
