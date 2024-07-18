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
Object.defineProperty(exports, "__esModule", { value: true });
const checkUserExist_1 = require("../helper/checkUserExist");
const customError_1 = require("../utils/customError");
const jwt_1 = require("../utils/jwt");
function isMyJwtPayload(payload) {
    return payload.username !== undefined;
}
const authenticateRefreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const incomingRefreshToken = req.cookies.refreshToken;
    if (!incomingRefreshToken) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    const user = (0, jwt_1.verifyRefreshToken)(incomingRefreshToken);
    if (!user || !isMyJwtPayload(user)) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    const checkResult = yield (0, checkUserExist_1.checkUserData)(user.username);
    if (incomingRefreshToken !== checkResult.dataValues.refreshToken) {
        throw (0, customError_1.createCustomError)("Refresh token is expired or used", 401);
    }
    req.checkResult = checkResult;
    next(); // Proceed to the next middleware or route handler
});
exports.default = authenticateRefreshToken;
