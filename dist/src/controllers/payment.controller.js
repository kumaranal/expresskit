"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RazorPayWebhook = exports.PaymentWebhook = void 0;
const stripe_1 = require("stripe");
const logger_1 = __importDefault(require("../utils/logger"));
const asyncHandeler_1 = __importDefault(require("../utils/asyncHandeler"));
const customError_1 = require("../utils/customError");
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
//stripe
const stripe = new stripe_1.Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-04-10",
});
const webhookSecretKey = process.env.STRIPE_WEBHOOK_SECRET;
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_SECRET_KEYID,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
});
exports.PaymentWebhook = (0, asyncHandeler_1.default)(async (req, res) => {
    const signature = req.headers["stripe-signature"];
    if (!signature) {
        throw (0, customError_1.createCustomError)("invalid signature", 400);
    }
    const event = stripe.webhooks.constructEvent(req.body, signature, webhookSecretKey);
    logger_1.default.info("stripe event", { event: event });
    switch (event.type) {
        case "checkout.session.completed": {
            break;
        }
        case "payment_intent.succeeded": {
            logger_1.default.info(`PaymentIntent was successful!`);
            break;
        }
        case "customer.subscription.deleted": {
            break;
        }
        case "customer.subscription.updated": {
            break;
        }
        case "charge.succeeded": {
            break;
        }
        default:
            logger_1.default.error("unhandled event type", { event: event.type });
            break;
    }
});
exports.RazorPayWebhook = (0, asyncHandeler_1.default)(async (req, res) => {
    const secret = process.env.RAZORPAY_SECRET;
    const receivedSignature = req.headers["x-razorpay-signature"];
    if (!receivedSignature) {
        throw (0, customError_1.createCustomError)("Invalid signature", 400);
    }
    const generatedSignature = crypto_1.default
        .createHmac("sha256", secret)
        .update(JSON.stringify(req.body))
        .digest("hex");
    if (generatedSignature !== receivedSignature) {
        throw (0, customError_1.createCustomError)("Signature verification failed", 400);
    }
    const event = req.body;
    switch (event.type) {
        case "checkout.session.completed": {
            break;
        }
        case "payment_intent.succeeded": {
            logger_1.default.info(`PaymentIntent was successful!`);
            break;
        }
        case "customer.subscription.deleted": {
            break;
        }
        case "customer.subscription.updated": {
            break;
        }
        case "charge.succeeded": {
            break;
        }
        default:
            logger_1.default.error("unhandled event type", { event: event.type });
            break;
    }
});
