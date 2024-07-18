"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
exports.verifyToken = verifyToken;
exports.verifyRefreshToken = verifyRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const accessSecretKey = process.env.JWT_SECRET_KEY_ACCESS;
const refreshSecretKey = process.env.JWT_SECRET_KEY_REFRESH;
async function generateAccessToken(payload, expiresIn = "1h") {
    return jsonwebtoken_1.default.sign(payload, accessSecretKey, { expiresIn });
}
async function generateRefreshToken(payload, expiresIn = "5h") {
    return jsonwebtoken_1.default.sign(payload, refreshSecretKey, { expiresIn });
}
function verifyToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, accessSecretKey);
    }
    catch (error) {
        throw new Error("Invalid or expired token");
    }
}
function verifyRefreshToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, refreshSecretKey);
    }
    catch (error) {
        throw new Error("Invalid or expired token");
    }
}
