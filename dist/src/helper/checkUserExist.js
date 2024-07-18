"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUser = checkUser;
exports.checkUserData = checkUserData;
const auth_1 = __importDefault(require("../models/auth"));
async function checkUser(username) {
    const user = await auth_1.default.findOne({ where: { username } });
    if (!user) {
        return false;
    }
    return true;
}
async function checkUserData(username) {
    const user = await auth_1.default.findOne({ where: { username } });
    if (!user) {
        return null;
    }
    return user;
}
