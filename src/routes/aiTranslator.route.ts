import { Router } from "express";
import { aiTranslatorfn } from "../controllers/aiTranslator.controller";

const router = Router();

router.post("/aiTranslator", aiTranslatorfn);

export default router;
