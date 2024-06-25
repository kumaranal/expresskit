import { Router } from "express";
import {
  forgotPassword,
  getAllUserData,
  resetPassword,
  signIn,
  signUp,
  signout,
} from "../controllers/auth.controller";
import authenticateToken from "../middleware/authTokenCheck";

const router = Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/forgot-password", authenticateToken, forgotPassword);
router.post("/reset-password", authenticateToken, resetPassword);
router.get("/allUser", getAllUserData)
router.get("/signout", authenticateToken, signout);
export default router;
