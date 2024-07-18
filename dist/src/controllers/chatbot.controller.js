"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatfn = void 0;
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.AI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
});
const chatfn = async (req, res) => {
    try {
        const { message } = req.body;
        const result = await model.generateContent(message);
        if (!result || !result.response || !result.response.candidates) {
            return res.status(400).json({ message: "No result found" });
        }
        return res.status(200).json({
            reply: result.response.candidates[0].content.parts[0].text?.replace(/\n/g, ""),
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
exports.chatfn = chatfn;
