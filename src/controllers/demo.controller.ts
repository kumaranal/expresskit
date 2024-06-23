import { NextFunction, Request, Response } from "express";
import { failResponse, successResponse } from "../helper/responseSchema";
import logger from "../utils/logger";
import { createCustomError } from "../utils/customError";

export const demo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = "abcasde";
    const errorData = createCustomError("My Custom Error", 401);
    throw errorData;
    // throw new Error("My Custom Error 123");
    return successResponse(res, "success", 200);
  } catch (error) {
    next(error);
  }
};
