import { Router } from "express";
import {
  listProducts,
  getProduct,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/products.controller.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

// Public routes
router.get("/categories", getCategories);
router.get("/", listProducts);
router.get("/:id", getProduct);

// Admin-only routes
router.post("/", requireAuth, requireAdmin, createProduct);
router.put("/:id", requireAuth, requireAdmin, updateProduct);
router.delete("/:id", requireAuth, requireAdmin, deleteProduct);

export default router;
