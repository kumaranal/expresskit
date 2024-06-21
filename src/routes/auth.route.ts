import { Router } from "express";
import {
  forgotPassword,
  resetPassword,
  signIn,
  signUp,
} from "../controllers/auth.controller";

const router = Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
