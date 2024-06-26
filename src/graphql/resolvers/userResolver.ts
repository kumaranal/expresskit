import Auth from "../../models/auth";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import validateAttributes from "../../helper/validation";
import supabase from "../../../supabase";
import asyncHandler from "../../utils/asyncHandelerForGraphql";
import { createCustomError } from "../../utils/customError";
import { generateAccessAndRefereshTokens } from "../../controllers/auth.controller";
// import { GraphQLUpload, FileUpload } from 'graphql-upload/GraphQLUpload.mjs';
const options = {
  httpOnly: true,
  secure: true
}

const authResolver = {
  // Upload: GraphQLUpload,
  Query: {
    users: asyncHandler(async (parent, args, context) => {
      if (!context.user) {
        throw createCustomError("Unauthorized")
      }
      const users = await Auth.findAll();
      return users;
    }),
    user: asyncHandler(async (_, { id }, context) => {
      if (!context.user) {
        throw createCustomError("Unauthorized")
      }
      const users = await Auth.findByPk(id)
      return users;
    }),
  },
  Mutation: {
    signUp: asyncHandler(async (_, { username, password }, context) => {
      const uniqueIdKey = uuidv4();
      if (!validateAttributes(username, "emailcheck")) {
        throw createCustomError("Invalid username")
      }
      if (!validateAttributes(password, "passwordcheck")) {
        throw createCustomError("Invalid password")
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await Auth.create({
        username,
        password: hashedPassword,
        unique_id_key: uniqueIdKey,
      });
      const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(username, uniqueIdKey)
      context.res
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
      return { message: "successfully signed up", token: accessToken };
    }),
    updateUser: asyncHandler(async (_, { id, username, password }, context) => {
      if (!context.user) {
        throw createCustomError("Unauthorized")
      }
      if (!validateAttributes(username, "emailcheck")) {
        throw createCustomError("Invalid username")
      }

      if (!validateAttributes(password, "passwordcheck")) {
        throw createCustomError("Invalid password")
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
      throw createCustomError("User not found")
    }),
    deleteUser: asyncHandler(async (_, { id }, context) => {
      if (!context.user) {
        throw createCustomError("Unauthorized")
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
        throw createCustomError("Invalid username")
      }

      if (!validateAttributes(password, "passwordcheck")) {
        throw createCustomError("Invalid password")
      }
      const user = await Auth.findOne({ where: { username } });
      if (
        !user ||
        !(await bcrypt.compare(password, user?.dataValues.password))
      ) {
        throw createCustomError("Invalid username or password")
      }
      const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(username, user?.dataValues.unique_id_key)
      context.res
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
      return { message: "successfully signed in", token: accessToken };
    }),
    uploadFile: asyncHandler(async (_, { file }) => {
      const { createReadStream, filename, mimetype } = await file;
      const stream = createReadStream();
      const uniqueFilename = `${uuidv4()}-${filename}`;
      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from("your-bucket-name")
        .upload(uniqueFilename, stream, {
          contentType: mimetype,
        });

      if (error) {
        throw new Error(`Failed to upload file: ${error.message}`);
      }

      const { data: fileUrl } = supabase.storage
        .from("your-bucket-name")
        .getPublicUrl(uniqueFilename);

      return {
        url: fileUrl.publicUrl,
      };
    }),
  },
};
export default authResolver;
