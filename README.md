# Artora — Artisan Marketplace

A full-stack MERN marketplace connecting local artisans directly with buyers. No middlemen. Just art.

🌐 **Live:** http://13.201.68.25

---

## The Problem

The same handmade product sold for ₹200 at a roadside stall appears in a mall store for ₹2,000. The artisan sees none of that markup. Artora fixes this by letting artisans sell directly.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS, React Router v6 |
| Backend | Node.js, Express.js, Mongoose |
| Database | MongoDB Atlas |
| Auth | JWT + bcryptjs |
| Deployment | AWS EC2, Nginx |
| DevOps | Docker, Jenkins CI/CD |
| Process Manager | PM2 |

---

## Features

**Buyer**
- Browse products by category
- Product detail pages with artisan info
- Cart and wishlist management
- Checkout with shipping address
- Order history with live status tracking

**Seller**
- List, edit, delete products
- Dashboard with live stats
- Order fulfillment management

**Platform**
- JWT auth with role-based access control
- Protected routes on frontend and backend
- Nginx reverse proxy on AWS EC2
- Dockerized backend with Jenkins CI/CD

---

## Architecture

    Browser → Nginx (port 80) → Node.js in Docker (port 5000) → MongoDB Atlas

**CI/CD Flow:**

    Git push → Jenkins webhook → Docker build → Deploy container

---

## API Endpoints

**Auth**

    POST /api/auth/register
    POST /api/auth/login

**Products**

    GET    /api/products
    GET    /api/products/:id
    POST   /api/products          (seller only)
    PUT    /api/products/:id      (seller only)
    DELETE /api/products/:id      (seller only)
    GET    /api/products/seller/my-products

**Orders**

    POST   /api/orders            (buyer only)
    GET    /api/orders/buyer      (buyer only)
    GET    /api/orders/seller     (seller only)
    PUT    /api/orders/:id/status (seller only)

---

## Project Structure

    Artora/
    ├── artora-backend/
    │   ├── config/        # DB connection
    │   ├── controllers/   # Business logic
    │   ├── middleware/    # JWT + role guards
    │   ├── models/        # User, Product, Order
    │   ├── routes/        # API endpoints
    │   ├── Dockerfile
    │   └── server.js
    └── artora-frontend/
        └── src/
            ├── components/
            ├── pages/
            ├── services/
            └── utils/

---

## Local Setup

    git clone https://github.com/kishanraj31/Artora.git
    cd Artora

    # Backend
    cd artora-backend
    npm install
    node server.js

    # Frontend
    cd ../artora-frontend
    npm install
    npm run dev

---

## Deployment

- **Server:** AWS EC2 t3.micro — Mumbai (ap-south-1)
- **Web server:** Nginx on port 80
- **Backend:** Dockerized Node.js on port 5000
- **Database:** MongoDB Atlas M0 — Mumbai
- **CI/CD:** Jenkins pipeline — auto deploys on GitHub push

---

## Author

**Kishan Raj** — [github.com/kishanraj31](https://github.com/kishanraj31)
