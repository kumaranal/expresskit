import Auth from "../../models/auth";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import validateAttributes from "../../helper/validation";
import supabase from "../../../supabase";
import asyncHandler from "../../utils/asyncHandelerForGraphql";
import { createCustomError } from "../../utils/customError";
import { generateAccessAndRefereshTokens } from "../../controllers/auth.controller";
import User from "../../models/user";
const options = {
  httpOnly: true,
  secure: true,
};

const userResolver = {
  Query: {
    getUsers: asyncHandler(async (parent, args, context) => {
      if (!context.user) {
        throw createCustomError("Unauthorized");
      }
      const users = await User.findAll();
      return users;
    }),
    getUser: asyncHandler(async (_, { id }, context) => {
      if (!context.user) {
        throw createCustomError("Unauthorized");
      }
      const users = await User.findByPk(id);
      return users;
    }),
  },
  Mutation: {
    updateUser: asyncHandler(
      async (_, { id, username, email, image }, context) => {
        if (!context.user) {
          throw createCustomError("Unauthorized");
        }
        if (!validateAttributes(email, "emailcheck")) {
          throw createCustomError("Invalid username");
        }
        if (!validateAttributes(username, "namecheck")) {
          throw createCustomError("Invalid username");
        }

        if (!id) {
          throw createCustomError("id is required");
        }

        await User.update(
          {
            username,
            email,
            image,
          },
          { where: { id: id } }
        );
        return { message: "update successfully" };
      }
    ),
    deleteUser: asyncHandler(async (_, { id }, context) => {
      if (!context.user) {
        throw createCustomError("Unauthorized");
      }
      const user = await User.findByPk(id);
      if (user) {
        await user.destroy();
        return true;
      }
      return false;
    }),
  },
};
export default userResolver;
