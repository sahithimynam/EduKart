import { Router } from "express";
import {
  createOrder,
  myOrders,
  getOrderById,
  allOrders,
  updateOrderStatus
} from "../controllers/orders.controller.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

// User routes
router.post("/", requireAuth, createOrder);
router.get("/mine", requireAuth, myOrders);
router.get("/my-orders", requireAuth, myOrders);
router.get("/:id", requireAuth, getOrderById);

// Admin routes
router.get("/", requireAuth, requireAdmin, allOrders);
router.patch("/:id/status", requireAuth, requireAdmin, updateOrderStatus);

export default router;
