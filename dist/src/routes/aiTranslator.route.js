"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aiTranslator_controller_1 = require("../controllers/aiTranslator.controller");
const router = (0, express_1.Router)();
router.post("/aiTranslator", aiTranslator_controller_1.aiTranslatorfn);
exports.default = router;
