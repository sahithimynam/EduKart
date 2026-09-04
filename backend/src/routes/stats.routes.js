import { Router } from "express";
import { getAdminStats } from "../controllers/stats.controller.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, requireAdmin, getAdminStats);

export default router;
