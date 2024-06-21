import { Request, Response } from "express";
import { failResponse, successResponse } from "../helper/responseSchema";
import logger from "../utils/logger";

export const demo = async (req: Request, res: Response) => {
  try {
    const data = "abcasde";
    logger.error("Received event ", { data: data });
    return successResponse(res, "success", 201);
  } catch (error) {
    return failResponse(res, error, 500);
  }
};
