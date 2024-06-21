import { gql } from "graphql-tag";
const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    password: String!
    unique_id_key: String!
  }
  type Query {
    users: [User]
    user(id: ID!): User
  }
  type Mutation {
    createUser(username: String!, password: String!): User
    updateUser(id: ID!, username: String, password: String): User
    deleteUser(id: ID!): Boolean
  }
`;
export default typeDefs;
