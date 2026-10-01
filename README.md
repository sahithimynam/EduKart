# EduKart • Educational E-Commerce Platform

> **Fullstack MERN Application (MongoDB • Express.js • React.js • Node.js)**  
> Developed by **[Sahithi Mynam](https://github.com/sahithimynam)**

EduKart is a high-performance educational e-commerce web platform engineered for engineering students and academics. It features a curated 25-item catalog across 5 specialized categories, secure JWT-based user authentication, cart and wishlist management...

---

## 🌟 Key Highlights

- **MERN Stack Architecture**: Fully decoupled REST API (Express + Node.js + Mongoose) with a reactive Single Page Application (React 18 + Vite + Tailwind CSS).
- **Curated 25-Item Academic Catalog**:
  1. **Books**: Data Structures & Algorithms, DBMS Concepts, Operating Systems, Computer Networks, Java Programming.
  2. **Stationery**: Notebooks, Pens, Highlighters, Sticky Notes, Geometry Box.
  3. **Electronics**: Scientific Calculator, Wireless Mouse, Keyboard, USB Flash Drive, Laptop Stand.
  4. **Study Accessories**: Study Lamp, Backpack, Desk Organizer, Water Bottle, Headphones.
  5. **Exam Preparation**: GATE CSE Preparation Book, CAT Preparation Guide, GRE Study Material, UPSC Preparation Book, Aptitude & Reasoning Book.
- **Secure User Authentication**:
  - User Registration (Sign Up)
  - User Login (Sign In)
  - Password Hashing using bcrypt
  - JWT Token-Based Authentication
  - Protected Routes for Cart, Wishlist and Orders.
- **Protected E-Commerce Workflow**:
  - Wishlist, Cart, and Order operations require authenticated user access.
  - Responsive Sign Up and Sign In interfaces with form validation and secure authentication.
- **Unified Full-Stack Deployment**:
  - Express serves both API endpoints and the compiled React production bundle, enabling single-service hosting on cloud platforms like Render or Railway.

---

## 🔐 Authentication Features

- User Registration (Sign Up)
- User Login (Sign In)
- JWT Authentication
- Password Hashing using bcrypt
- Protected Routes
- Persistent User Sessions

---

## 🛠️ Technology Stack

| Layer | Technology | Usage |
| :--- | :--- | :--- |
| **Frontend** | **React 18** + **Vite** | Dynamic Single Page Application |
| **Styling** | **Tailwind CSS** + **Lucide Icons** | Clean UI & icon system |
| **State Management** | **React Context API** | Global Auth, Cart, & Wishlist state |
| **Backend** | **Express.js** + **Node.js** | Modular REST API and static asset server |
| **Database** | **MongoDB** + **Mongoose** | Document data store with schema validation |
| **Security** | **JWT** + **bcryptjs** | Token-based auth & salted password hashing |

---

## 🚀 Running Locally

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB running locally on `mongodb://127.0.0.1:27017` (or MongoDB Atlas connection string)

### 2. Installation
Clone the repository and install all dependencies:
```bash
git clone https://github.com/sahithimynam/EduKart.git
cd EduKart
npm run install:all
```

### 3. Seed Database
Populate the 25 curated products and default accounts:
```bash
npm run seed
```

### 4. Build & Start
```bash
npm run build
npm start
```

---

## 📡 REST API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Server health check | No |
| `POST` | `/api/auth/login` | Student / Admin sign in | No |
| `POST` | `/api/auth/register` | Register student account | No |
| `GET` | `/api/auth/me` | Fetch authenticated profile | Yes (JWT) |
| `GET` | `/api/products` | Browse catalog with category filter & search | No |
| `GET` | `/api/products/:id` | Get individual product details | No |
| `POST` | `/api/products` | Create new product | Yes (Admin) |
| `DELETE`| `/api/products/:id` | Delete product | Yes (Admin) |
| `GET` | `/api/orders/mine` | View student order history | Yes (JWT) |
| `POST` | `/api/orders` | Checkout and place new order | Yes (JWT) |
| `GET` | `/api/wishlist` | Retrieve student wishlist items | Yes (JWT) |
| `POST` | `/api/wishlist` | Add product to wishlist | Yes (JWT) |
| `DELETE`| `/api/wishlist/:id` | Remove product from wishlist | Yes (JWT) |

---

## 👩‍💻 Author

**Sahithi Mynam**  
GitHub: [@sahithimynam](https://github.com/sahithimynam)

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).

##Live Demo

https://edukart-1.onrender.com/
