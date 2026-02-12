# Smart Campus Delivery API

A production-style RESTful backend for a campus food delivery system.

This API supports authentication, role-based access control, restaurant and menu management, order processing, and controlled order lifecycle transitions.

Built to demonstrate backend architecture, relational database design, validation layering, and clean project structure.

---

## Features

- JWT Authentication (Register / Login)
- Role-Based Access Control (Admin / Customer / Rider)
- Restaurant Management (Admin only)
- Menu Item Management
- Order Creation with Dynamic Total Calculation
- Controlled Order Status Transitions (State Machine)
- Decimal-safe money handling (No Float precision errors)
- Enum-based Roles and Order Status (DB-level integrity)
- Swagger API Documentation
- Request Validation using Zod
- PostgreSQL + Prisma ORM

---

## Architecture Overview

The project follows a clean layered architecture:

Routes → Controllers → Prisma ORM → PostgreSQL

### Structure

```
src/
  controllers/
  routes/
  middlewares/
  validators/
  prisma/
```

### Key Design Decisions

- **Enums for Role and OrderStatus**  
  Prevents invalid role/status values at the database level.

- **Decimal instead of Float for money**  
  Avoids floating-point precision issues in financial calculations.

- **Zod for request validation**  
  Separates structural validation from business logic.

- **State Machine for order lifecycle**  
  Enforces valid transitions:
  - PLACED → ACCEPTED / CANCELLED  
  - ACCEPTED → PICKED / CANCELLED  
  - PICKED → DELIVERED  
  - DELIVERED → (no change)  
  - CANCELLED → (no change)

- **Role-based middleware**  
  Ensures endpoint access control is centralized and reusable.

---

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT (jsonwebtoken)
- Zod
- Swagger (OpenAPI)
- bcrypt

---

## Environment Variables

Create a `.env` file in the root:

```
DATABASE_URL="postgresql://your_user:your_password@localhost:5432/campus_delivery"
JWT_SECRET="key_of_your_choice"
```

---

## Installation & Setup

### 1. Install dependencies

```
npm install
```

### 2. Run Prisma migrations

```
npx prisma migrate dev
```

### 3. Start development server

```
npm run dev
```

---

## Example API Requests

### Register

```
POST /auth/register
```

```json
{
  "name": "Muhammad Zuraiz",
  "email": "zuraiz@gmail.com",
  "password": "password123"
}
```

---

### Login

```
POST /auth/login
```

Returns JWT token.

---

### Create Order

```
POST /orders
Authorization: Bearer <token>
```

```json
{
  "restaurantId": 1,
  "items": [
    { "menuItemId": 1, "quantity": 2 },
    { "menuItemId": 3, "quantity": 1 }
  ]
}
```

---

## What This Project Demonstrates

- Backend API design
- Relational schema modeling
- Secure authentication
- Access control architecture
- Validation layering
- Business rule enforcement
- Proper financial data handling
- Clean separation of concerns

---

## Future Improvements

- Automated testing (Jest + Supertest)
- Rate limiting
- Payment gateway integration
- Deployment to production environment
- Caching layer (Redis)
- Pagination & filtering
- Analytics endpoints

---

## Author

Built as a backend portfolio project to demonstrate production-style API architecture and clean code practices.