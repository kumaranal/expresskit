"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const authTokenCheck_1 = __importDefault(require("../middleware/authTokenCheck"));
const refreshTokenCheck_1 = __importDefault(require("../middleware/refreshTokenCheck"));
const router = (0, express_1.Router)();
router.post("/signup", auth_controller_1.signUp);
router.post("/signin", auth_controller_1.signIn);
router.post("/forgot-password", auth_controller_1.forgotPassword);
router.post("/reset-password", auth_controller_1.resetPassword);
router.get("/allUser", authTokenCheck_1.default, auth_controller_1.getAllUserData);
router.get("/signout", authTokenCheck_1.default, auth_controller_1.signout);
router.get("/refreshAccessToken", refreshTokenCheck_1.default, auth_controller_1.refreshAccessToken);
exports.default = router;
