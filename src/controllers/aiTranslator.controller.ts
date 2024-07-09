import { Request, Response } from "express";
import asyncHandeler from "../utils/asyncHandeler";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ApiResponse } from "../utils/ApiResponse";
import { createCustomError } from "../utils/customError";

const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest",
});

export const aiTranslatorfn = asyncHandeler(
  async (req: Request, res: Response) => {
    try {
      const { userPrompt, language } = req.body;
      const prompt = `Translate this following into ${language} language : ${userPrompt} `;
      const result = await model.generateContent([prompt]);
      return res.status(200).json(new ApiResponse(200, result.response.text()));
    } catch (error) {
      throw createCustomError(error);
    }
  }
);
