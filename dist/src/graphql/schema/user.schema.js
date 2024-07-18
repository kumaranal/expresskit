"use strict";
// userSchema.ts
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const userSchema = (0, apollo_server_express_1.gql) `
  type User {
    id: ID!
    username: String!
    email: String
    image: String
  }

  type AuthenticationData {
    message: String!
    token: String!
  }

  type ApiResponse {
    status: Int!
    message: String!
  }

  extend type Query {
    getUsers: [User]
    getUser(id: ID!): User
  }

  extend type Mutation {
    createUser(username: String!, password: String!): AuthenticationData
    updateUser(id: ID!, username: String, password: String): User
    deleteUser(id: ID!): Boolean
    uploadFile(file: Upload!): ApiResponse!
  }
`;
exports.default = userSchema;
