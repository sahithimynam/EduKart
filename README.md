# Edukart • Modern Educational E-Commerce Platform

> **Revamped Fullstack MERN Application (MongoDB • Express.js • React.js • Node.js)**

Edukart is a high-performance educational e-commerce web application engineered for students, educators, and engineers. It offers a catalog of programming textbooks, fullstack video masterclasses, hands-on robotics kits, IoT hardware, and engineering stationery.

Originally started as a static prototype, Edukart has now been completely modernized into a production-grade **MERN Stack** architecture featuring a reactive **Vite + React + Tailwind CSS** frontend, robust **Express & Mongoose REST API**, JWT authentication, persistent database shopping workflows, and an administrative management dashboard.

---

## 🚀 Live Demo & Quick Evaluation

The application is actively running on your local machine:
- **Web App & API**: [http://localhost:5000](http://localhost:5000)
- **Health Check**: [http://localhost:5000/health](http://localhost:5000/health)

### 🔑 Pre-Seeded Demo Credentials

You can use the **1-Click Demo Buttons** in the navigation bar and sign-in page, or enter these credentials:

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Demo Student** | `student@edukart.com` | `student123` | Browse catalog, persistent cart & wishlist, place orders, track order history |
| **Demo Admin** | `admin@edukart.com` | `admin123` | Full access + Admin Dashboard, sales KPIs, inventory management, update order statuses |

---

## 🌟 Key Features

### 🛒 Student E-Commerce Experience
- **Interactive Catalog**: Instant live search, category tabs (*Books, Courses, Kits, Stationery*), price range filter, minimum rating filter (4★+), and sorting (*Featured, Price Low-High, Price High-Low, Newest*).
- **Product Details & Quick Preview**: High-res image gallery, stock availability counters, curriculum highlights, related category recommendations, and 1-click **Buy Now** instant checkout.
- **Cart & Discount Engine**:
  - Cart item counter with persistent local & server sync.
  - Promo code support:
    - `LEARN20` — 20% Student Discount
    - `EDUFREESHIP` — Free Delivery on any order
    - `FLAT100` — Flat ₹100 Off
  - Free shipping threshold (auto-applied on orders above ₹499).
- **Simulated Instant Checkout**:
  - Multi-method sandbox payment selection: **UPI / QR Code**, **Credit/Debit Card**, **NetBanking**, or **Cash on Delivery**.
  - Address pre-filling from student profile.
- **Order Tracking & Invoices**: Real-time order progress timeline (*Placed ➔ Confirmed ➔ Shipped ➔ Delivered*) with order reference receipts.
- **Persistent Wishlist**: Save favorite learning materials with 1-click "Move to Cart".

### 🛡️ Admin Management Dashboard
- **Store KPIs**: Real-time gross sales volume, total orders count, catalog items count, and registered student count.
- **Inventory Control**: Add new educational courses or hardware kits with image preview, price, stock, tags, and highlights. Delete out-of-stock items.
- **Order Management**: View recent customer orders, inspect customer shipping details, and advance order status (*Placed ➔ Confirmed ➔ Shipped ➔ Delivered*).

---

## 🛠️ Tech Stack

```
           Frontend                     Backend                     Database
     ┌──────────────────┐         ┌──────────────────┐         ┌────────────────┐
     │  React 18 (Vite) │ <=====> │    Express.js    │ <=====> │ MongoDB 8.x    │
     │  Tailwind CSS    │  REST   │    Node.js       │ Mongoose│ (Local/Atlas)  │
     │  Lucide Icons    │  APIs   │    JWT + Bcrypt  │ Schemas │ Collections:   │
     │  React Router v6 │         │  Static Server   │         │ Users, Products│
     └──────────────────┘         └──────────────────┘         │ Orders         │
                                                               └────────────────┘
```

- **M — MongoDB**: Scalable NoSQL document store with schemas for `User`, `Product`, and `Order` with indexes and population.
- **E — Express.js**: RESTful API framework handling authentication, order processing, catalog filtering, and SPA client routing.
- **R — React.js**: High-speed Vite-powered single page application styled with Tailwind CSS, context state providers (`AuthContext`, `CartContext`), and micro-interactions.
- **N — Node.js**: Unified JavaScript runtime powering both API endpoints and production asset delivery.

---

## 📂 Project Architecture

```
edukart/
├── package.json               # Root automation scripts (install, build, seed, start)
├── README.md                  # Comprehensive platform documentation
├── backend/
│   ├── .env                   # Environment config (Port, Mongo URI, JWT Secret)
│   ├── package.json           # Express dependencies
│   └── src/
│       ├── server.js          # Express app entry & static production server
│       ├── config/db.js       # Resilient MongoDB connection handler
│       ├── models/            # Mongoose data models (User, Product, Order)
│       ├── controllers/       # Business logic (auth, products, orders, wishlist, stats)
│       ├── middleware/        # JWT auth, admin guard, error handler
│       ├── routes/            # REST API route definitions
│       └── scripts/seed.js    # Catalog seeder with 12+ educational items
└── frontend/
    ├── package.json           # Vite + React + Tailwind dependencies
    ├── vite.config.js         # Vite config with API proxy
    ├── tailwind.config.js     # Custom educational brand colors & theme
    └── src/
        ├── App.jsx            # React router & global shell
        ├── main.jsx           # DOM mounting
        ├── context/           # AuthContext & CartContext
        ├── components/        # Navbar, Footer, ProductCard, QuickViewModal, ProtectedRoute
        ├── pages/             # Home, ProductDetail, Cart, Checkout, OrderSuccess, Orders, Wishlist, Auth, Admin
        └── services/api.js    # Centralized API fetch client
```

---

## ⚡ Quick Start & Run Commands

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Running locally on `127.0.0.1:27017` or a MongoDB Atlas URI)

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Seed Database
Populate the database with 12+ educational products, test students, and admin accounts:
```bash
npm run seed
```

### 3. Build & Run Production Full-Stack Server
Builds the React frontend and launches the unified Express server on port 5000:
```bash
npm run build
npm start
```
Now visit [http://localhost:5000](http://localhost:5000)!

### 4. Development Mode (Hot Reload)
To run backend and frontend separately during active development:
- **Terminal 1 (Backend)**:
  ```bash
  npm run server
  ```
- **Terminal 2 (Frontend)**:
  ```bash
  npm run client
  ```
  Vite will run on `http://localhost:5173` with instant hot-module replacement and automated API proxying to `http://localhost:5000`.

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Server health check | No |
| `POST` | `/api/auth/register` | Register student account | No |
| `POST` | `/api/auth/login` | Student / Admin sign in | No |
| `POST` | `/api/auth/demo` | Instant 1-click demo login (`role: "user"` or `"admin"`) | No |
| `GET` | `/api/auth/me` | Get current user profile | Yes |
| `GET` | `/api/products` | Browse catalog (supports `q`, `category`, `sort`, `minRating`, `maxPrice`) | No |
| `GET` | `/api/products/:id` | Get product details & related items | No |
| `POST` | `/api/products` | Create catalog item | Yes (Admin) |
| `DELETE` | `/api/products/:id` | Delete catalog item | Yes (Admin) |
| `POST` | `/api/orders` | Place order & checkout | Yes |
| `GET` | `/api/orders/mine` | List customer past orders | Yes |
| `GET` | `/api/orders` | List all customer orders | Yes (Admin) |
| `PATCH`| `/api/orders/:id/status` | Update order delivery status | Yes (Admin) |
| `GET` | `/api/wishlist` | Fetch student saved wishlist | Yes |
| `POST` | `/api/wishlist` | Add product to wishlist | Yes |
| `DELETE`| `/api/wishlist/:id` | Remove from wishlist | Yes |
| `GET` | `/api/stats` | Retrieve store KPIs and sales revenue | Yes (Admin) |

---

## 📄 License
This project is licensed under the MIT License.
