import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/error.js";

// Route imports
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/products.routes.js";
import orderRoutes from "./routes/orders.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import statsRoutes from "./routes/stats.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB(process.env.MONGODB_URI);

// CORS configuration supporting Vite dev server & production
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:5000",
      "http://127.0.0.1:5000",
      process.env.CLIENT_ORIGIN
    ].filter(Boolean),
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoints
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "Edukart MERN API",
    timestamp: new Date().toISOString()
  });
});
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "Edukart MERN API",
    timestamp: new Date().toISOString()
  });
});

// Register API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/stats", statsRoutes);

// Resolve paths for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static image assets directly
const backendPublicImages = path.resolve(__dirname, "../public/images");
if (fs.existsSync(backendPublicImages)) {
  app.use("/images", express.static(backendPublicImages));
}
const frontendPublicImages = path.resolve(__dirname, "../../frontend/public/images");
if (fs.existsSync(frontendPublicImages)) {
  app.use("/images", express.static(frontendPublicImages));
}

// Serve frontend build (if built)
const frontendDistPath = path.resolve(__dirname, "../../frontend/dist");

if (fs.existsSync(frontendDistPath)) {
  console.log(`📁 Serving frontend static build from ${frontendDistPath}`);
  app.use(express.static(frontendDistPath));

  // SPA Fallback for client-side routing
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

// Centralized error handler
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`🚀 Edukart Backend running on http://localhost:${PORT}`);
});

export default app;
