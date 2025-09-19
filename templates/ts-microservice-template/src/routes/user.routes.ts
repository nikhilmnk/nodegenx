import { Router } from "express";
import { getUserController } from "../controllers/user.controller";

const router = Router();
router.get("/user/:id", getUserController);

export default router;