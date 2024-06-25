import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import validateAttributes from "../helper/validation";
import Auth from "../models/auth";
import asyncHandeler from "../utils/asyncHandeler";
import { createCustomError } from "../utils/customError";
import { createSuccessResponse } from "../utils/createSuccessResponse";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { checkUser } from "../helper/checkUserExist";
import logger from "../utils/logger";


const options = {
  httpOnly: true,
  secure: true
}


const generateAccessAndRefereshTokens = async (username: string, unique_id_key: number) => {
  try {
    const accessToken = await generateAccessToken({ username });
    const refreshToken = await generateRefreshToken({ username });
    await Auth.update(
      { refreshToken: refreshToken },
      { where: { unique_id_key: unique_id_key } }
    );
    return { accessToken, refreshToken }

  } catch (error) {
    logger.error(error)
    throw createCustomError("Something went wrong while generating referesh and access token", 500);
  }
}


export const signUp = asyncHandeler(async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const usernameCheck = validateAttributes(username, "emailcheck");
  if (!usernameCheck) {
    throw createCustomError("invalid emailId", 401);
  }
  const passwordCheck = validateAttributes(password, "passwordcheck");
  if (!passwordCheck) {
    throw createCustomError("invalid password", 401);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const uniqueIdKey = uuidv4();
  const user = await Auth.create({
    username: username,
    password: hashedPassword,
    unique_id_key: uniqueIdKey,
  });
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(username, user?.dataValues.unique_id_key)

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        "Sign-up Successfully",
        { accessToken, refreshToken: refreshToken }

      )
    )
});

export const signIn = asyncHandeler(async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await Auth.findOne({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user?.dataValues.password))) {
    throw createCustomError("Invalid username or password", 401);
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(username, user?.dataValues.unique_id_key)

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        "Sign in Successfully",
        { accessToken, refreshToken: refreshToken }

      )
    )
});

export const forgotPassword = asyncHandeler(
  async (req: Request, res: Response) => {
    const { username } = req.body;
    const user = await Auth.findOne({ where: { username } });
    if (!user) {
      throw createCustomError("Invalid username", 401);
    }
    return res.status(200).json(
      new ApiResponse(200, "https://localhost:3000/reset/?uuid=${user.dataValues.unique_id_key}")
    )
  }
);

export const resetPassword = asyncHandeler(
  async (req: Request, res: Response) => {
    const { uuid, password } = req.body;
    const passwordCheck = validateAttributes(password, "passwordcheck");
    if (!passwordCheck) {
      throw createCustomError("Invalid password", 401);
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const [user] = await Auth.update(
      { password: hashedPassword },
      { where: { unique_id_key: uuid } }
    );

    if (!user) {
      throw createCustomError("Invalid uuid", 401);
    }

    return res.status(200).json(
      new ApiResponse(200, "Reset Data Successfully", user)
    )
  }
);

export const getAllUserData = asyncHandeler(async (req: Request, res: Response) => {
  const users = await Auth.findAll();
  return res.status(200).json(
    new ApiResponse(200, "User data retrieved Successfully", users)
  )

});

export const signout = asyncHandeler(async (req: Request, res: Response) => {
  res.clearCookie('token', { httpOnly: true, secure: true });
  return res.status(200).json(
    new ApiResponse(200, 'Logged out successfully')
  )
});


declare global {
  namespace Express {
    interface Request {
      checkResult?: any; // Replace `any` with a specific type if you have a User type defined
    }
  }
}

export const refreshAccessToken = asyncHandeler(async (req: Request, res: Response) => {
  const user =req.checkResult
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user.username, user.unique_id_key)

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        "Access token refreshed",
        { accessToken, refreshToken: refreshToken }

      )
    )
}
)


