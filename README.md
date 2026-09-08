# EduKart • Educational E-Commerce Platform

> **Fullstack MERN Application (MongoDB • Express.js • React.js • Node.js)**  
> Developed by **[Sahithi Mynam](https://github.com/sahithimynam)**

EduKart is a high-performance educational e-commerce web platform engineered for engineering students and academics. It features a curated 25-item catalog across 5 specialized categories, roll-number-based student authentication, cart and wishlist management, and a unified full-stack architecture.

---

## 🌟 Key Highlights

- **MERN Stack Architecture**: Fully decoupled REST API (Express + Node.js + Mongoose) with a reactive Single Page Application (React 18 + Vite + Tailwind CSS).
- **Curated 25-Item Academic Catalog**:
  1. **Books**: Data Structures & Algorithms, DBMS Concepts, Operating Systems, Computer Networks, Java Programming.
  2. **Stationery**: Notebooks, Pens, Highlighters, Sticky Notes, Geometry Box.
  3. **Electronics**: Scientific Calculator, Wireless Mouse, Keyboard, USB Flash Drive, Laptop Stand.
  4. **Study Accessories**: Study Lamp, Backpack, Desk Organizer, Water Bottle, Headphones.
  5. **Exam Preparation**: GATE CSE Preparation Book, CAT Preparation Guide, GRE Study Material, UPSC Preparation Book, Aptitude & Reasoning Book.
- **College Student Roll Number Authentication**:
  - Valid Email Format: `23501a05xx@edukart.com`
  - Permitted Roll Ranges: `01` to `99`, `A0` to `A9`, `B0` to `B9`, ... up to `J3`.
  - Default Password: `student123`
  - Instant Auto-Provisioning on sign-in.
- **Protected E-Commerce Workflow**:
  - Wishlist and Cart operations strictly require student authentication before adding or saving items.
  - Streamlined, minimalist Sign In form with email and password.
- **Unified Full-Stack Deployment**:
  - Express serves both API endpoints and the compiled React production bundle, enabling single-service hosting on cloud platforms like Render or Railway.

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
