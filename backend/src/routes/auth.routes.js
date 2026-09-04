import { Router } from "express";
import { register, login, demoLogin, me, updateProfile } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/demo", demoLogin);

// Protected routes
router.get("/me", requireAuth, me);
router.put("/profile", requireAuth, updateProfile);

export default router;
