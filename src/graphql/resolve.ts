import Auth from "../models/auth";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import validateAttributes from "../helper/validation";
import supabase from "../../supabase";
import { generateToken } from "../utils/jwt";
// import { GraphQLUpload, FileUpload } from 'graphql-upload/GraphQLUpload.mjs';

const resolvers = {
  // Upload: GraphQLUpload,
  Query: {
    users: async (parent, args, context) => {
      if (!context.user) {
        throw new Error("Unauthorized");
      }
      const users = await Auth.findAll();
      return users;
    },
    user: async (_, { id },context) =>{       
      if (!context.user) {
      throw new Error("Unauthorized");
      }
      const users = await Auth.findByPk(id)
      return users;
    },

  },
  Mutation: {
    signUp: async (_, { username, password }) => {
      const uniqueIdKey = uuidv4();
      if (!validateAttributes(username, "emailcheck")) {
        throw new Error("Invalid username");
      }

      if (!validateAttributes(password, "passwordcheck")) {
        throw new Error("Invalid password");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await Auth.create({
        username,
        password: hashedPassword,
        unique_id_key: uniqueIdKey,
      });
      const token = await generateToken({ username, uniqueIdKey });
      return { message: "successfully signed up", token: token };
    },
    updateUser: async (_, { id, username, password },context) => {
      if (!context.user) {
        throw new Error("Unauthorized");
      }
      if (!validateAttributes(username, "emailcheck")) {
        throw new Error("Invalid username");
      }

      if (!validateAttributes(password, "passwordcheck")) {
        throw new Error("Invalid password");
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
      throw new Error("User not found");
    },
    deleteUser: async (_, { id },context) => {
      if (!context.user) {
        throw new Error("Unauthorized");
      }
      const user = await Auth.findByPk(id);
      if (user) {
        await user.destroy();
        return true;
      }
      return false;
    },
    signIn: async (_, { username, password }) => {
      try {
        if (!validateAttributes(username, "emailcheck")) {
          throw new Error("Invalid username");
        }

        if (!validateAttributes(password, "passwordcheck")) {
          throw new Error("Invalid password");
        }
        const user = await Auth.findOne({ where: { username } });
        if (!user) {
          throw new Error("Invalid username or password");
        }
        if (
          !user ||
          !(await bcrypt.compare(password, user?.dataValues.password))
        ) {
          throw new Error("Invalid username or password");
        }
        const token = await generateToken({
          username,
          unique_id_key: user?.dataValues.unique_id_key,
        });
        return { message: "successfully signed up", token: token };
      } catch (error) {
        throw new Error("Internal Server Error");
      }
    },
    uploadFile: async (_, { file }) => {
      const { createReadStream, filename, mimetype } = await file;
      const stream = createReadStream();
      const uniqueFilename = `${uuidv4()}-${filename}`;
      try {
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
      } catch (error) {
        throw new Error("Internal Server Error");
      }
    },
  },
};
export default resolvers;
