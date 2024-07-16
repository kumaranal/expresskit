import { Router } from "express";
import { chatfn } from "../controllers/chatbot.controller";

const router = Router();

router.post("/chat", chatfn);

export default router;
