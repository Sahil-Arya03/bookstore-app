# 📚 Bookstore Application

A full-stack Bookstore Web Application built with **Spring Boot 3** (backend), **React + Vite + Tailwind CSS** (frontend), and **PostgreSQL** (database).

## ✨ Features

- **JWT Authentication** with role-based access control (ADMIN/USER)
- **Book Management** — full CRUD with search, filtering, and pagination
- **Category Management** — organize books by categories
- **Order Processing** — place orders, auto-generate invoices, track status
- **Shopping Cart** — localStorage-based cart with quantity management
- **Invoice Generation** — automatic 18% tax calculation
- **Stock Management** — auto stock deduction/restoration
- **Admin Dashboard** — manage books, orders, categories, and users
- **Swagger UI** — interactive API documentation
- **Responsive Design** — mobile-first UI with Tailwind CSS

## 🛠 Prerequisites

| Tool       | Version |
|------------|---------|
| Java       | 17+     |
| Node.js    | 18+     |
| PostgreSQL | 14+     |
| Maven      | 3.8+    |

## 🚀 Setup Instructions

### 1. Database Setup

```sql
-- Using psql or pgAdmin:
CREATE DATABASE bookstore_db;
```

The application will auto-create all tables on first run via Hibernate DDL.

### 2. Backend Setup

```bash
cd backend

# Update DB credentials in src/main/resources/application.properties if needed
# Default: postgres/postgres on localhost:5432

# Run the application
mvn spring-boot:run
```

Backend starts at: `http://localhost:8080`
Swagger UI: `http://localhost:8080/swagger-ui.html`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend starts at: `http://localhost:5173`

## 🔐 Default Credentials

| Role  | Email               | Password  |
|-------|---------------------|-----------|
| ADMIN | admin@bookstore.com | Admin@123 |
| USER  | user@bookstore.com  | User@123  |

## 📡 API Endpoints

### Authentication (Public)
| Method | Endpoint             | Description        |
|--------|----------------------|--------------------|
| POST   | `/api/auth/register` | Register new user  |
| POST   | `/api/auth/login`    | Login, get JWT     |

### Books (Public read, Admin write)
| Method | Endpoint               | Description                    |
|--------|------------------------|--------------------------------|
| GET    | `/api/books`           | Paginated list + category filter |
| GET    | `/api/books/{id}`      | Book details                   |
| GET    | `/api/books/search?q=` | Search by title/author/ISBN    |
| POST   | `/api/books`           | Add book (ADMIN)               |
| PUT    | `/api/books/{id}`      | Update book (ADMIN)            |
| DELETE | `/api/books/{id}`      | Delete book (ADMIN)            |

### Categories
| Method | Endpoint               | Description           |
|--------|------------------------|-----------------------|
| GET    | `/api/categories`      | List all              |
| GET    | `/api/categories/{id}` | Category with books   |
| POST   | `/api/categories`      | Create (ADMIN)        |
| PUT    | `/api/categories/{id}` | Update (ADMIN)        |
| DELETE | `/api/categories/{id}` | Delete (ADMIN)        |

### Orders
| Method | Endpoint                   | Description           |
|--------|----------------------------|-----------------------|
| GET    | `/api/orders`              | All orders (ADMIN)    |
| GET    | `/api/orders/my`           | Current user's orders |
| GET    | `/api/orders/{id}`         | Order detail          |
| POST   | `/api/orders`              | Place order           |
| PUT    | `/api/orders/{id}/status`  | Update status (ADMIN) |
| DELETE | `/api/orders/{id}`         | Cancel order          |

### Invoices
| Method | Endpoint                   | Description           |
|--------|----------------------------|-----------------------|
| GET    | `/api/invoices`            | All invoices (ADMIN)  |
| GET    | `/api/invoices/{orderId}`  | Invoice for order     |

### Users
| Method | Endpoint            | Description        |
|--------|---------------------|--------------------|
| GET    | `/api/users`        | All users (ADMIN)  |
| GET    | `/api/users/profile`| Own profile        |
| PUT    | `/api/users/profile`| Update profile     |

## 🏗 Project Structure

```
bookstore-app/
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/bookstore/
│       ├── BookstoreApplication.java
│       ├── config/        (SecurityConfig, CorsConfig, OpenApiConfig, DataSeeder)
│       ├── controller/    (Auth, Book, Category, Order, Invoice, User)
│       ├── dto/           (Request + Response DTOs)
│       ├── entity/        (User, Book, Category, Order, OrderItem, Invoice)
│       ├── exception/     (GlobalExceptionHandler, custom exceptions)
│       ├── repository/    (JPA repositories)
│       ├── security/      (JwtUtil, JwtAuthFilter, UserDetailsServiceImpl)
│       └── service/       (Business logic services)
├── frontend/
│   ├── package.json
│   └── src/
│       ├── components/    (Navbar, Footer, BookCard, Spinner, etc.)
│       ├── context/       (AuthContext)
│       ├── pages/         (Home, BookList, Admin pages, etc.)
│       ├── services/      (API service modules)
│       ├── utils/         (axiosInstance, formatters, validators)
│       ├── App.jsx
│       └── main.jsx
├── .gitignore
└── README.md
```

## 🧪 Running Tests

```bash
cd backend
mvn test
```

Tests cover:
- `BookServiceTest` — CRUD, search, duplicate ISBN prevention
- `OrderServiceTest` — Order placement, stock management, cancellation
- `AuthServiceTest` — Registration, login, duplicate email prevention

## 📸 Screenshots

> Add screenshots of the application UI here.

## 📄 License

This project is created for educational purposes.
