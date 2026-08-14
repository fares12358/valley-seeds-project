import { Router } from "express";
import { get, update, getEmailConfig, updateEmailConfig } from "./settings.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", get);                      // public — website
router.put("/", authMiddleware, update);   // protected — dashboard

router.get("/email", authMiddleware, getEmailConfig);   // protected — SMTP config, never public
router.put("/email", authMiddleware, updateEmailConfig);

export default router;
