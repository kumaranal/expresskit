import { Router } from "express";
import authenticateToken from "../middleware/authTokenCheck";
import {
  deleteUserDetails,
  profileDetails,
  profileDetailsByUserId,
  updateUserDetails,
} from "../controllers/user.controller";

const router = Router();

router.put("/profile-detail/:id", authenticateToken, updateUserDetails);
router.delete("/profile-delete/:id", authenticateToken, deleteUserDetails);
router.get("/profile-details", authenticateToken, profileDetails);
router.get("/profile-detail/:id", authenticateToken, profileDetailsByUserId);

export default router;
