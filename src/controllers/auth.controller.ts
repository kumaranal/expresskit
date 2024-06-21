import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import validateAttributes from "../helper/validation";
import { failResponse, successResponse } from "../helper/responseSchema";
import Auth from "../models/auth";

export const signUp = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const usernameCheck = validateAttributes(username, "emailcheck");
    if (!usernameCheck) {
      return failResponse(res, "invalid emailId", 401);
    }
    const passwordCheck = validateAttributes(password, "passwordcheck");
    if (!passwordCheck) {
      return failResponse(res, "invalid password", 401);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const uniqueIdKey = uuidv4();

    const user = await Auth.create({
      username: username,
      password: hashedPassword,
      unique_id_key: uniqueIdKey,
    });
    return successResponse(res, user, 201);
  } catch (error) {
    return failResponse(res, error, 500);
  }
};

export const signIn = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await Auth.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user?.dataValues.password))) {
      return failResponse(res, "Invalid username or password", 401);
    }
    return successResponse(res, "Signin successful", 200);
  } catch (error) {
    return failResponse(res, "Internal Server Error", 500);
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { username } = req.body;
  try {
    const user = await Auth.findOne({ where: { username } });
    if (!user) {
      return failResponse(res, "Invalid username", 401);
    }
    return successResponse(
      res,
      `https://localhost:3000/reset/?uuid=${user.dataValues.unique_id_key}`,
      200
    );
  } catch (error) {
    return failResponse(res, "Internal Server Error", 500);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { uuid, password } = req.body;
    const passwordCheck = validateAttributes(password, "passwordcheck");
    if (!passwordCheck) {
      return failResponse(res, "invalid password", 401);
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const [user] = await Auth.update(
      { password: hashedPassword },
      { where: { unique_id_key: uuid } }
    );

    if (!user) {
      return failResponse(res, "Invalid uuid", 401);
    }

    return successResponse(res, user, 201);
  } catch (error) {
    return failResponse(res, error, 500);
  }
};
