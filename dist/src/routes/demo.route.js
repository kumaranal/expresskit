"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const demo_controller_1 = require("../controllers/demo.controller");
const authTokenCheck_1 = __importDefault(require("../middleware/authTokenCheck"));
const router = (0, express_1.Router)();
router.get("/demo", authTokenCheck_1.default, demo_controller_1.demo);
exports.default = router;
