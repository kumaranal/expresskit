"use strict";
// graphql/schema/index.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const auth_schema_1 = __importDefault(require("./auth.schema"));
const user_schema_1 = __importDefault(require("./user.schema"));
const rootSchema = (0, apollo_server_express_1.gql) `
  scalar Upload
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
`;
exports.default = [rootSchema, auth_schema_1.default, user_schema_1.default];
