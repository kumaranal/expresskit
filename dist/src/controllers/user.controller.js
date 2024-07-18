"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageBase64 = exports.userNotification = exports.downloadFile = exports.uploadFile = exports.refreshAccessToken = exports.signout = exports.getAllUserData = exports.resetPassword = exports.profileDetailsByUserId = exports.profileDetails = exports.deleteUserDetails = exports.updateUserDetails = void 0;
const sendNotification_1 = require("../helper/sendNotification");
const bcrypt_1 = __importDefault(require("bcrypt"));
const validation_1 = __importDefault(require("../helper/validation"));
const auth_1 = __importDefault(require("../models/auth"));
const asyncHandeler_1 = __importDefault(require("../utils/asyncHandeler"));
const customError_1 = require("../utils/customError");
const jwt_1 = require("../utils/jwt");
const ApiResponse_1 = require("../utils/ApiResponse");
const logger_1 = __importDefault(require("../utils/logger"));
const user_1 = __importDefault(require("../models/user"));
const multer_1 = __importDefault(require("multer"));
const fileUpload_1 = require("../helper/fileUpload");
const fileDownload_1 = __importDefault(require("../helper/fileDownload"));
const fs_1 = __importDefault(require("fs"));
const util_1 = __importDefault(require("util"));
const options = {
    httpOnly: true,
    secure: true,
};
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
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
exports.updateUserDetails = (0, asyncHandeler_1.default)(async (req, res) => {
    const { username, image, email } = req.body;
    const unique_id_key = req.params.id;
    if (!unique_id_key) {
        throw (0, customError_1.createCustomError)("unique_id_key is required", 400);
    }
    const emailCheck = (0, validation_1.default)(email, "emailcheck");
    if (!emailCheck) {
        throw (0, customError_1.createCustomError)("invalid emailId", 401);
    }
    const userNameCheck = (0, validation_1.default)(username, "namecheck");
    if (!userNameCheck) {
        throw (0, customError_1.createCustomError)("invalid username", 401);
    }
    const [user] = await user_1.default.update({
        username: username,
        email: email,
        image: image,
    }, {
        where: { id: unique_id_key },
    });
    if (!user) {
        throw (0, customError_1.createCustomError)("Invalid uuid", 401);
    }
    return res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, "User update successfully"));
});
exports.deleteUserDetails = (0, asyncHandeler_1.default)(async (req, res) => {
    const uniqueIdKey = req.params.id;
    if (!uniqueIdKey) {
        throw (0, customError_1.createCustomError)("unique_id_key is required", 400);
    }
    const user = await user_1.default.destroy({ where: { id: uniqueIdKey } });
    if (!user) {
        throw (0, customError_1.createCustomError)("Invalid unique_id_key", 401);
    }
    const auths = await auth_1.default.destroy({ where: { unique_id_key: uniqueIdKey } });
    if (!auths) {
        throw (0, customError_1.createCustomError)("Invalid unique_id_key", 401);
    }
    return res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, "User deleted successfully"));
});
exports.profileDetails = (0, asyncHandeler_1.default)(async (req, res) => {
    const users = await user_1.default.findAll();
    if (Array.isArray(users) && !users.length) {
        throw (0, customError_1.createCustomError)("No user found", 404);
    }
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, "Users found", {
        users: users,
    }));
});
exports.profileDetailsByUserId = (0, asyncHandeler_1.default)(async (req, res) => {
    const uniqueIdKey = req.params.id;
    const user = await user_1.default.findOne({ where: { id: uniqueIdKey } });
    if (!user) {
        throw (0, customError_1.createCustomError)("No user found", 404);
    }
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, "User found", {
        user: user,
    }));
});
exports.resetPassword = (0, asyncHandeler_1.default)(async (req, res) => {
    const { uuid, password } = req.body;
    const passwordCheck = (0, validation_1.default)(password, "passwordcheck");
    if (!passwordCheck) {
        throw (0, customError_1.createCustomError)("Invalid password", 401);
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const [user] = await auth_1.default.update({ password: hashedPassword }, { where: { unique_id_key: uuid } });
    if (!user) {
        throw (0, customError_1.createCustomError)("Invalid uuid", 401);
    }
    return res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, "Reset Data Successfully", user));
});
exports.getAllUserData = (0, asyncHandeler_1.default)(async (req, res) => {
    const users = await auth_1.default.findAll();
    return res
        .status(200)
        .json(new ApiResponse_1.ApiResponse(200, "User data retrieved Successfully", users));
});
exports.signout = (0, asyncHandeler_1.default)(async (req, res) => {
    res.clearCookie("token", { httpOnly: true, secure: true });
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, "Logged out successfully"));
});
exports.refreshAccessToken = (0, asyncHandeler_1.default)(async (req, res) => {
    const user = req.checkResult;
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user.username, user.unique_id_key);
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse_1.ApiResponse(200, "Access token refreshed", {
        accessToken,
        refreshToken: refreshToken,
    }));
});
exports.uploadFile = (0, asyncHandeler_1.default)(async (req, res) => {
    const RETRY_LIMIT = 3;
    for (let attempt = 1; attempt <= RETRY_LIMIT; attempt++) {
        try {
            const file = req.file;
            logger_1.default.info("file", file);
            const fileBuffer = req.file.buffer;
            if (!file) {
                return res.status(400).json({ error: "No file uploaded" });
            }
            const publicUrl = await (0, fileUpload_1.uploadFileToSupabase)(fileBuffer, file.filename);
            const [updated] = await user_1.default.update({
                image: publicUrl,
            }, {
                where: {
                    username: req["user"].username,
                },
            });
            if (updated) {
                fs_1.default.unlink(file.path, (err) => {
                    if (err) {
                        throw (0, customError_1.createCustomError)("Failed to delete temporary file:", 400);
                    }
                    else {
                        return res
                            .status(200)
                            .json(new ApiResponse_1.ApiResponse(200, "File uploaded successfully"));
                    }
                });
            }
            else {
                return res.status(404).json(new ApiResponse_1.ApiResponse(200, "User not found"));
            }
        }
        catch (error) {
            logger_1.default.error(`Attempt ${attempt} failed:`, error);
            if (attempt === RETRY_LIMIT) {
                throw new Error("All attempts to upload the file failed");
            }
        }
    }
});
exports.downloadFile = (0, asyncHandeler_1.default)(async (req, res) => {
    const RETRY_LIMIT = 3;
    for (let attempt = 1; attempt <= RETRY_LIMIT; attempt++) {
        try {
            const user = await user_1.default.findOne({
                where: {
                    id: req["user"].unique_id_key,
                },
            });
            if (user) {
                const { imageName, mimeType, data } = await (0, fileDownload_1.default)(user.image, res);
                res.setHeader("Content-Disposition", `attachment; filename="${imageName}"`);
                res.setHeader("Content-Type", mimeType);
                res.setHeader("Content-Length", data.size);
                // Send the data as a stream
                data.arrayBuffer().then((buffer) => {
                    res.send(Buffer.from(buffer));
                });
                break;
            }
            else {
                return res.status(404).json(new ApiResponse_1.ApiResponse(404, "User not found"));
            }
        }
        catch (error) {
            logger_1.default.error(`Attempt ${attempt} failed:`, error);
            if (attempt === RETRY_LIMIT) {
                throw new Error("All attempts to upload the file failed");
            }
        }
    }
});
exports.userNotification = (0, asyncHandeler_1.default)(async (req, res) => {
    try {
        const { token, title, body } = req.body;
        const notification = await (0, sendNotification_1.sendNotification)(token, title, body);
        if (notification) {
            return res
                .status(200)
                .json(new ApiResponse_1.ApiResponse(200, "Send notification successfully"));
        }
        else {
            return res
                .status(401)
                .json(new ApiResponse_1.ApiResponse(401, "Send notification unsuccessfully"));
        }
    }
    catch (error) { }
});
exports.uploadImageBase64 = (0, asyncHandeler_1.default)(async (req, res) => {
    const writeFileAsync = util_1.default.promisify(fs_1.default.writeFile);
    const readFileAsync = util_1.default.promisify(fs_1.default.readFile);
    const unlinkAsync = util_1.default.promisify(fs_1.default.unlink);
    const RETRY_LIMIT = 3;
    for (let attempt = 1; attempt <= RETRY_LIMIT; attempt++) {
        try {
            const { image, base64 } = req.body;
            if (!image) {
                return res.status(400).json({ error: "No file uploaded" });
            }
            await writeFileAsync("image.png", base64, { encoding: "base64" });
            const buffer = await readFileAsync("image.png");
            const publicUrl = await (0, fileUpload_1.uploadFileToSupabaseBase64)(buffer, image);
            const [updated] = await user_1.default.update({
                image: publicUrl,
            }, {
                where: {
                    username: req["user"].username,
                },
            });
            await unlinkAsync("image.png");
            logger_1.default.info("Deleted image file");
            if (updated) {
                return res
                    .status(200)
                    .json(new ApiResponse_1.ApiResponse(200, "File uploaded successfully"));
            }
            else {
                return res.status(404).json(new ApiResponse_1.ApiResponse(200, "User not found"));
            }
        }
        catch (error) {
            logger_1.default.error(`Attempt ${attempt} failed:`, error);
            if (attempt === RETRY_LIMIT) {
                throw new Error("All attempts to upload the file failed");
            }
        }
    }
});
