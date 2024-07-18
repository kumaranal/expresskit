"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessAndRefereshTokens = void 0;
const auth_1 = __importDefault(require("../../models/auth"));
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const validation_1 = __importDefault(require("../../helper/validation"));
const asyncHandelerForGraphql_1 = __importDefault(require("../../utils/asyncHandelerForGraphql"));
const customError_1 = require("../../utils/customError");
const jwt_1 = require("../../utils/jwt");
const checkUserExist_1 = require("../../helper/checkUserExist");
const logger_1 = __importDefault(require("../../utils/logger"));
const user_1 = __importDefault(require("../../models/user"));
const events_1 = require("events");
const transport_1 = __importDefault(require("../../helper/transport"));
const staticConfig_1 = __importDefault(require("../../helper/staticConfig"));
const options = {
    httpOnly: true,
    secure: true,
};
const generateAccessAndRefereshTokens = async (username, unique_id_key) => {
    try {
        const accessToken = await (0, jwt_1.generateAccessToken)({ username });
        const refreshToken = await (0, jwt_1.generateRefreshToken)({ username });
        await auth_1.default.update({ refreshToken: refreshToken }, { where: { unique_id_key: unique_id_key } });
        return { accessToken, refreshToken };
    }
    catch (error) {
        logger_1.default.error(error);
        throw (0, customError_1.createCustomError)("Something went wrong while generating referesh and access token", 500);
    }
};
exports.generateAccessAndRefereshTokens = generateAccessAndRefereshTokens;
const authResolver = {
    Query: {
        users: (0, asyncHandelerForGraphql_1.default)(async (parent, args, context) => {
            if (!context.user) {
                throw (0, customError_1.createCustomError)("Unauthorized");
            }
            const users = await auth_1.default.findAll({
                include: {
                    model: user_1.default,
                    as: "user",
                },
                raw: true,
            });
            const result = users.map((auth) => ({
                id: auth.id,
                username: auth.username,
                password: auth.password,
                unique_id_key: auth.unique_id_key,
                user: {
                    id: auth["user.id"],
                    username: auth["user.username"],
                    image: auth["user.image"],
                    email: auth["user.email"],
                },
            }));
            return result;
        }),
        user: (0, asyncHandelerForGraphql_1.default)(async (_, { id }, context) => {
            if (!context.user) {
                throw (0, customError_1.createCustomError)("Unauthorized");
            }
            const users = await auth_1.default.findByPk(id);
            return users;
        }),
    },
    Mutation: {
        signUp: (0, asyncHandelerForGraphql_1.default)(async (_, { username, password }, context) => {
            const uniqueIdKey = (0, uuid_1.v4)();
            if (!(0, validation_1.default)(username, "emailcheck")) {
                throw (0, customError_1.createCustomError)("Invalid username");
            }
            if (!(0, validation_1.default)(password, "passwordcheck")) {
                throw (0, customError_1.createCustomError)("Invalid password");
            }
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            await auth_1.default.create({
                username,
                password: hashedPassword,
                unique_id_key: uniqueIdKey,
            });
            const { accessToken, refreshToken } = await (0, exports.generateAccessAndRefereshTokens)(username, uniqueIdKey);
            context.res
                .cookie("accessToken", accessToken, options)
                .cookie("refreshToken", refreshToken, options);
            let eventEmitter = new events_1.EventEmitter();
            eventEmitter.on("emailSent", (data) => {
                (0, transport_1.default)(data);
            });
            // Emit the 'emailSent' event with the necessary data
            eventEmitter.emit("emailSent", {
                senderEmail: username,
                subject: staticConfig_1.default.signUpEmail.subject,
                text: staticConfig_1.default.signUpEmail.text,
            });
            return { message: "successfully signed up", token: accessToken };
        }),
        updateUser: (0, asyncHandelerForGraphql_1.default)(async (_, { id, username, password }, context) => {
            if (!context.user) {
                throw (0, customError_1.createCustomError)("Unauthorized");
            }
            if (!(0, validation_1.default)(username, "emailcheck")) {
                throw (0, customError_1.createCustomError)("Invalid username");
            }
            if (!(0, validation_1.default)(password, "passwordcheck")) {
                throw (0, customError_1.createCustomError)("Invalid password");
            }
            const user = await auth_1.default.findByPk(id);
            if (user) {
                user.username = username ?? user.username;
                user.password = password
                    ? await bcrypt_1.default.hash(password, 10)
                    : await bcrypt_1.default.hash(user.password, 10);
                await user.save();
                return user;
            }
            throw (0, customError_1.createCustomError)("User not found");
        }),
        deleteUser: (0, asyncHandelerForGraphql_1.default)(async (_, { id }, context) => {
            if (!context.user) {
                throw (0, customError_1.createCustomError)("Unauthorized");
            }
            const user = await auth_1.default.findByPk(id);
            if (user) {
                await user.destroy();
                return true;
            }
            return false;
        }),
        signIn: (0, asyncHandelerForGraphql_1.default)(async (_, { username, password }, context) => {
            if (!(0, validation_1.default)(username, "emailcheck")) {
                throw (0, customError_1.createCustomError)("Invalid username");
            }
            if (!(0, validation_1.default)(password, "passwordcheck")) {
                throw (0, customError_1.createCustomError)("Invalid password");
            }
            const user = await auth_1.default.findOne({ where: { username } });
            if (!user ||
                !(await bcrypt_1.default.compare(password, user?.dataValues.password))) {
                throw (0, customError_1.createCustomError)("Invalid username or password");
            }
            const { accessToken, refreshToken } = await (0, exports.generateAccessAndRefereshTokens)(username, user?.dataValues.unique_id_key);
            context.res
                .cookie("accessToken", accessToken, options)
                .cookie("refreshToken", refreshToken, options);
            return { message: "successfully signed in", token: accessToken };
        }),
        refreshAccessTokenChanger: (0, asyncHandelerForGraphql_1.default)(async (_, args, context) => {
            const incomingRefreshToken = context.req.cookies.refreshToken;
            if (!incomingRefreshToken) {
                throw (0, customError_1.createCustomError)("Unauthorized: No token provided");
            }
            const user = (0, jwt_1.verifyRefreshToken)(incomingRefreshToken);
            if (!user || !isMyJwtPayload(user)) {
                throw (0, customError_1.createCustomError)("Unauthorized: Invalid token");
            }
            const checkResult = await (0, checkUserExist_1.checkUserData)(user.username);
            if (incomingRefreshToken !== checkResult.dataValues.refreshToken) {
                throw (0, customError_1.createCustomError)("Refresh token is expired or used", 401);
            }
            const { accessToken, refreshToken } = await (0, exports.generateAccessAndRefereshTokens)(checkResult.username, checkResult.unique_id_key);
            context.res
                .cookie("accessToken", accessToken, options)
                .cookie("refreshToken", refreshToken, options);
            return { message: "Access token refreshed", token: accessToken };
        }),
        resetPassword: (0, asyncHandelerForGraphql_1.default)(async (_, { unique_id_key, password }, context) => {
            if (!(0, validation_1.default)(password, "passwordcheck")) {
                throw (0, customError_1.createCustomError)("Invalid password");
            }
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            const user = await auth_1.default.update({ password: hashedPassword }, { where: { unique_id_key: unique_id_key } });
            if (!user) {
                throw (0, customError_1.createCustomError)("Invalid uuid", 401);
            }
            return { message: "Reset Data Successfully" };
        }),
        forgotPassword: (0, asyncHandelerForGraphql_1.default)(async (_, { username }, context) => {
            if (!(0, validation_1.default)(username, "emailcheck")) {
                throw (0, customError_1.createCustomError)("Invalid username");
            }
            const user = await auth_1.default.findOne({ where: { username: username } });
            if (!user) {
                throw (0, customError_1.createCustomError)("User not found");
            }
            let eventEmitter = new events_1.EventEmitter();
            eventEmitter.on("emailSent", (data) => {
                (0, transport_1.default)(data);
            });
            // Emit the 'emailSent' event with the necessary data
            eventEmitter.emit("emailSent", {
                senderEmail: username,
                subject: staticConfig_1.default.forgotPasswordEmail.subject,
                text: `${staticConfig_1.default.forgotPasswordEmail.text} https://localhost:3000/reset/?uuid=${user.dataValues.unique_id_key}`,
            });
            return {
                url: `https://localhost:3000/reset/?uuid=${user.dataValues.unique_id_key}`,
            };
        }),
    },
};
function isMyJwtPayload(payload) {
    return payload.username !== undefined;
}
exports.default = authResolver;
