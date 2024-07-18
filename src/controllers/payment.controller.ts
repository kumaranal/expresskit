import { Request, Response } from "express";
import { Stripe } from "stripe";
import logger from "../utils/logger";
import asyncHandeler from "../utils/asyncHandeler";
import { createCustomError } from "../utils/customError";
import Razorpay from "razorpay";
import crypto from "crypto";

//stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-04-10",
});

const webhookSecretKey = process.env.STRIPE_WEBHOOK_SECRET as string | "";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_SECRET_KEYID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

export const PaymentWebhook = asyncHandeler(
  async (req: Request, res: Response) => {
    const signature = req.headers["stripe-signature"];
    if (!signature) {
      throw createCustomError("invalid signature", 400);
    }
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      webhookSecretKey
    );

    logger.info("stripe event", { event: event });
    switch (event.type) {
      case "checkout.session.completed": {
        break;
      }
      case "payment_intent.succeeded": {
        logger.info(`PaymentIntent was successful!`);
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
        logger.error("unhandled event type", { event: event.type });
        break;
    }
  }
);

export const RazorPayWebhook = asyncHandeler(
  async (req: Request, res: Response) => {
    const secret = process.env.RAZORPAY_SECRET;

    const receivedSignature = req.headers["x-razorpay-signature"];

    if (!receivedSignature) {
      throw createCustomError("Invalid signature", 400);
    }

    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (generatedSignature !== receivedSignature) {
      throw createCustomError("Signature verification failed", 400);
    }

    const event = req.body;
    switch (event.type) {
      case "checkout.session.completed": {
        break;
      }
      case "payment_intent.succeeded": {
        logger.info(`PaymentIntent was successful!`);
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
        logger.error("unhandled event type", { event: event.type });
        break;
    }
  }
);
