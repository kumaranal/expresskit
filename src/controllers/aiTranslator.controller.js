"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiTranslatorfn = void 0;
const asyncHandeler_1 = __importDefault(require("../utils/asyncHandeler"));
const generative_ai_1 = require("@google/generative-ai");
const ApiResponse_1 = require("../utils/ApiResponse");
const customError_1 = require("../utils/customError");
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.AI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
});
exports.aiTranslatorfn = (0, asyncHandeler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userPrompt, language } = req.body;
        const prompt = `Translate this following into ${language} language : ${userPrompt} `;
        const result = yield model.generateContent([prompt]);
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, result.response.text()));
    }
    catch (error) {
        throw (0, customError_1.createCustomError)(error);
    }
}));
