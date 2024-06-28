import { gql } from "apollo-server-express";

const authSchema = gql`
  scalar Upload

  type UploadFile {
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
  type Query {
    users: [User]
    user(id: ID!): User
    forgotPassword(username: String!): User
  }
  type Mutation {
    signUp(username: String!, password: String!): AuthenticationData
    updateUser(id: ID!, username: String, password: String): User
    deleteUser(id: ID!): Boolean
    signIn(username: String!, password: String!): AuthenticationData
    uploadFile(file: Upload!): UploadFile
    refreshAccessTokenChanger: AuthenticationData
    resetPassword(unique_id_key: String!, password: String!): User
  }
`;
export default authSchema;
