"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../controllers/payment.controller");
const express_2 = __importDefault(require("express"));
const router = (0, express_1.Router)();
router.post("/webhook", express_2.default.raw({ type: "application/json" }), payment_controller_1.PaymentWebhook);
router.post("/verification", express_2.default.raw({ type: "application/json" }));
exports.default = router;
