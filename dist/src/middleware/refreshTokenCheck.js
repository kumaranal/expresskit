"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkUserExist_1 = require("../helper/checkUserExist");
const customError_1 = require("../utils/customError");
const jwt_1 = require("../utils/jwt");
function isMyJwtPayload(payload) {
    return payload.username !== undefined;
}
const authenticateRefreshToken = async (req, res, next) => {
    const incomingRefreshToken = req.cookies.refreshToken;
    if (!incomingRefreshToken) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    const user = (0, jwt_1.verifyRefreshToken)(incomingRefreshToken);
    if (!user || !isMyJwtPayload(user)) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    const checkResult = await (0, checkUserExist_1.checkUserData)(user.username);
    if (incomingRefreshToken !== checkResult.dataValues.refreshToken) {
        throw (0, customError_1.createCustomError)("Refresh token is expired or used", 401);
    }
    req.checkResult = checkResult;
    next(); // Proceed to the next middleware or route handler
};
exports.default = authenticateRefreshToken;
