import Auth from "../../models/auth";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import validateAttributes from "../../helper/validation";
import supabase from "../../../supabase";
import asyncHandler from "../../utils/asyncHandelerForGraphql";
import { createCustomError } from "../../utils/customError";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";
import { checkUserData } from "../../helper/checkUserExist";
import { UUID } from "crypto";
import logger from "../../utils/logger";
const options = {
  httpOnly: true,
  secure: true,
};

export const generateAccessAndRefereshTokens = async (
  username: string,
  unique_id_key: UUID | string
) => {
  try {
    const accessToken = await generateAccessToken({ username });
    const refreshToken = await generateRefreshToken({ username });
    await Auth.update(
      { refreshToken: refreshToken },
      { where: { unique_id_key: unique_id_key } }
    );
    return { accessToken, refreshToken };
  } catch (error) {
    logger.error(error);
    throw createCustomError(
      "Something went wrong while generating referesh and access token",
      500
    );
  }
};

const authResolver = {
  Query: {
    users: asyncHandler(async (parent, args, context) => {
      if (!context.user) {
        throw createCustomError("Unauthorized");
      }
      const users = await Auth.findAll();
      return users;
    }),
    user: asyncHandler(async (_, { id }, context) => {
      if (!context.user) {
        throw createCustomError("Unauthorized");
      }
      const users = await Auth.findByPk(id);
      return users;
    }),
    forgotPassword: asyncHandler(async (_, { email }, context) => {
      if (!context.user) {
        throw createCustomError("Unauthorized");
      }
      const user = await Auth.findOne({ where: { email } });

      if (!user) {
        throw createCustomError("User not found");
      }

      return `https://localhost:3000/reset/?uuid=${user.dataValues.unique_id_key}`;
    }),
  },
  Mutation: {
    signUp: asyncHandler(async (_, { username, password }, context) => {
      const uniqueIdKey = uuidv4();
      if (!validateAttributes(username, "emailcheck")) {
        throw createCustomError("Invalid username");
      }
      if (!validateAttributes(password, "passwordcheck")) {
        throw createCustomError("Invalid password");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await Auth.create({
        username,
        password: hashedPassword,
        unique_id_key: uniqueIdKey,
      });
      const { accessToken, refreshToken } =
        await generateAccessAndRefereshTokens(username, uniqueIdKey);
      context.res
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options);
      return { message: "successfully signed up", token: accessToken };
    }),
    updateUser: asyncHandler(async (_, { id, username, password }, context) => {
      if (!context.user) {
        throw createCustomError("Unauthorized");
      }
      if (!validateAttributes(username, "emailcheck")) {
        throw createCustomError("Invalid username");
      }

      if (!validateAttributes(password, "passwordcheck")) {
        throw createCustomError("Invalid password");
      }
      const user = await Auth.findByPk(id);
      if (user) {
        user.username = username ?? user.username;
        user.password = password
          ? await bcrypt.hash(password, 10)
          : await bcrypt.hash(user.password, 10);
        await user.save();
        return user;
      }
      throw createCustomError("User not found");
    }),
    deleteUser: asyncHandler(async (_, { id }, context) => {
      if (!context.user) {
        throw createCustomError("Unauthorized");
      }
      const user = await Auth.findByPk(id);
      if (user) {
        await user.destroy();
        return true;
      }
      return false;
    }),
    signIn: asyncHandler(async (_, { username, password }, context) => {
      if (!validateAttributes(username, "emailcheck")) {
        throw createCustomError("Invalid username");
      }

      if (!validateAttributes(password, "passwordcheck")) {
        throw createCustomError("Invalid password");
      }
      const user = await Auth.findOne({ where: { username } });
      if (
        !user ||
        !(await bcrypt.compare(password, user?.dataValues.password))
      ) {
        throw createCustomError("Invalid username or password");
      }
      const { accessToken, refreshToken } =
        await generateAccessAndRefereshTokens(
          username,
          user?.dataValues.unique_id_key
        );
      context.res
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options);
      return { message: "successfully signed in", token: accessToken };
    }),
    refreshAccessTokenChanger: asyncHandler(async (_, args, context) => {
      const incomingRefreshToken = context.req.cookies.refreshToken;

      if (!incomingRefreshToken) {
        throw createCustomError("Unauthorized: No token provided");
      }
      const user = verifyRefreshToken(incomingRefreshToken);
      if (!user || !user.username) {
        throw createCustomError("Unauthorized: Invalid token");
      }
      const checkResult = await checkUserData(user.username);
      if (incomingRefreshToken !== checkResult.dataValues.refreshToken) {
        throw createCustomError("Refresh token is expired or used", 401);
      }
      const { accessToken, refreshToken } =
        await generateAccessAndRefereshTokens(
          checkResult.username,
          checkResult.unique_id_key
        );
      context.res
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options);
      return { message: "Access token refreshed", token: accessToken };
    }),
    resetPassword: asyncHandler(
      async (_, { uniqueKeyId, password }, context) => {
        if (context.user) {
          throw createCustomError("Unauthorized");
        }

        if (!validateAttributes(password, "passwordcheck")) {
          throw createCustomError("Invalid password");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await Auth.update(
          { password: hashedPassword },
          { where: { unique_id_key: uniqueKeyId } }
        );

        if (!user) {
          throw createCustomError("Invalid uuid", 401);
        }
        return { message: "Reset Data Successfully", user };
      }
    ),
  },
};
export default authResolver;
