import { Router } from "express";
import authController from "../controllers/authController.mjs";

const router = Router();

router.post("/api/register", authController.register);
router.post("/api/login", authController.login);

export default router;
