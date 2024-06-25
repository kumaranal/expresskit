import { checkUser, checkUserData } from "../helper/checkUserExist";
import { createCustomError } from "../utils/customError";
import { verifyRefreshToken } from "../utils/jwt";

const jwt = require('jsonwebtoken');

const authenticateRefreshToken = async (req, res, next) => {
    const incomingRefreshToken = req.cookies.refreshToken;

    if (!incomingRefreshToken) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    const user = verifyRefreshToken(incomingRefreshToken);
    if (!user || !user.username) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    const checkResult = await checkUserData(user.username);
    if (incomingRefreshToken !== checkResult.dataValues.refreshToken) {
        throw createCustomError("Refresh token is expired or used", 401);
      }
    req.checkResult=checkResult
    next(); // Proceed to the next middleware or route handler
};

export default authenticateRefreshToken;