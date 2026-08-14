import { Router } from "express";
import { submit, getAll, markRead, remove } from "./contact.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import { contactSubmitLimiter } from "../../middlewares/rateLimiter.js";

const router = Router();

// Public — rate-limited to 5/hr per IP (spam + email quota protection)
router.post(  "/",             contactSubmitLimiter, submit);

// Protected — dashboard only, no rate limit (admin JWT required)
router.get(   "/messages",     authMiddleware, getAll);
router.patch( "/messages/:id", authMiddleware, markRead);
router.delete("/messages/:id", authMiddleware, remove);

export default router;
