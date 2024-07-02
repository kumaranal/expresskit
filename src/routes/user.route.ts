import { Router } from "express";
import authenticateToken from "../middleware/authTokenCheck";
import {
  deleteUserDetails,
  profileDetails,
  profileDetailsByUserId,
  updateUserDetails,
  uploadFile,
} from "../controllers/user.controller";
import multer from "multer";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.put("/profile-detail/:id", authenticateToken, updateUserDetails);
router.delete("/profile-delete/:id", authenticateToken, deleteUserDetails);
router.get("/profile-details", authenticateToken, profileDetails);
router.get("/profile-detail/:id", authenticateToken, profileDetailsByUserId);
router.post(
  "/uploadFile",
  authenticateToken,
  upload.single("file"),
  uploadFile
);

export default router;
