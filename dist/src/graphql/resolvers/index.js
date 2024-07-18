"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const merge_1 = require("@graphql-tools/merge");
const userResolver_1 = __importDefault(require("./userResolver"));
const authResolver_1 = __importDefault(require("./authResolver"));
const resolvers = (0, merge_1.mergeResolvers)([authResolver_1.default, userResolver_1.default]);
exports.default = resolvers;
