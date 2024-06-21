import { Router } from "express";
import { demo } from "../controllers/demo.controller";

const router = Router();

router.post("/demo", demo);

export default router;
