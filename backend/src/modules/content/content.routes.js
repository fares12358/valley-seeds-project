import { Router } from "express";
import { getAll, getOne, update } from "./content.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/",         getAll);           // public — website
router.get("/:section", getOne);           // public — website
router.put("/:section", authMiddleware, update); // protected — dashboard

export default router;
