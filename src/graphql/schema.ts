import { gql } from "apollo-server-express";

const typeDefs = gql`
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
  }
  type Mutation {
    signUp(username: String!, password: String!): AuthenticationData
    updateUser(id: ID!, username: String, password: String): User
    deleteUser(id: ID!): Boolean
    signIn(username: String!, password: String!): AuthenticationData
    uploadFile(file: Upload!): UploadFile
  }
`;
export default typeDefs;
