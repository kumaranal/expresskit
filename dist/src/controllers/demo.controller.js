"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.demo = void 0;
const asyncHandeler_1 = __importDefault(require("../utils/asyncHandeler"));
const createSuccessResponse_1 = require("../utils/createSuccessResponse");
exports.demo = (0, asyncHandeler_1.default)(async (req, res) => {
    const data = "abcasde";
    return (0, createSuccessResponse_1.createSuccessResponse)(res, "VJVJHV");
});
