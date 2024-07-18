"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFromToken = getUserFromToken;
const checkUserExist_1 = require("../helper/checkUserExist");
const customError_1 = require("../utils/customError");
const jwt_1 = require("../utils/jwt");
// Type guard to check if the payload is of type MyJwtPayload
function isMyJwtPayload(payload) {
    return payload.username !== undefined;
}
function getUserFromToken(token) {
    try {
        const user = (0, jwt_1.verifyToken)(token);
        if (isMyJwtPayload(user)) {
            const checkResult = (0, checkUserExist_1.checkUser)(user.username);
            if (!checkResult) {
                throw new Error("user not find");
            }
            return user;
        }
        else {
            throw (0, customError_1.createCustomError)("username is undefined");
        }
    }
    catch (error) {
        return null;
    }
}
