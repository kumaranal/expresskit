import { GoogleGenerativeAI } from "@google/generative-ai";
import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY as string);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest",
});

export const chatfn = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const result = await model.generateContent(message);
    if (!result || !result.response || !result.response.candidates) {
      return res.status(400).json({ message: "No result found" });
    }
    return res.status(200).json({
      reply: result.response.candidates[0].content.parts[0].text?.replace(
        /\n/g,
        ""
      ),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
