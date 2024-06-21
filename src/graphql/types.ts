import { GraphQLResolveInfo } from "graphql";
import Auth from "../models/auth";
type Maybe<T> = T | null;
export type Resolvers = {
  Query: {
    users: (
      parent: unknown,
      args: unknown,
      context: unknown,
      info: GraphQLResolveInfo
    ) => Promise<Auth[]>;
    user: (
      parent: unknown,
      args: { id: number },
      context: unknown,
      info: GraphQLResolveInfo
    ) => Promise<Maybe<Auth>>;
  };
  Mutation: {
    createUser: (
      parent: unknown,
      args: { username: string; password: string },
      context: unknown,
      info: GraphQLResolveInfo
    ) => Promise<Auth>;
    updateUser: (
      parent: unknown,
      args: { id: number; username?: string; password?: string },
      context: unknown,
      info: GraphQLResolveInfo
    ) => Promise<Maybe<Auth>>;
    deleteUser: (
      parent: unknown,
      args: { id: number },
      context: unknown,
      info: GraphQLResolveInfo
    ) => Promise<boolean>;
  };
};
