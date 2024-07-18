"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
function generateAccessToken(payload_1) {
    return __awaiter(this, arguments, void 0, function* (payload, expiresIn = "1h") {
        return jsonwebtoken_1.default.sign(payload, accessSecretKey, { expiresIn });
    });
}
function generateRefreshToken(payload_1) {
    return __awaiter(this, arguments, void 0, function* (payload, expiresIn = "5h") {
        return jsonwebtoken_1.default.sign(payload, refreshSecretKey, { expiresIn });
    });
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
