"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const authSchema = (0, apollo_server_express_1.gql) `
  type UrlResponse {
    url: String!
  }
  type CheckResponse {
    message: String
    statusCode: Int
  }
  type User {
    id: ID!
    username: String!
    password: String!
    unique_id_key: String!
  }
  type AuthenticationData {
    message: String!
    token: String!
  }

  type ResponseMessage {
    message: String!
  }

  type MyUser {
    id: ID!
    username: String!
    email: String
    image: String
  }

  type Auth {
    id: ID!
    username: String!
    user: MyUser
  }

  type Query {
    users: [Auth]
    user(id: ID!): User
  }
  type Mutation {
    signUp(username: String!, password: String!): AuthenticationData
    updateUser(id: ID!, username: String, password: String): User
    deleteUser(id: ID!): Boolean
    signIn(username: String!, password: String!): AuthenticationData
    refreshAccessTokenChanger: AuthenticationData
    resetPassword(unique_id_key: String!, password: String!): ResponseMessage
    forgotPassword(username: String!): UrlResponse
  }
`;
exports.default = authSchema;
