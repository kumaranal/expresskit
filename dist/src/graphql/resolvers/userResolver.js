"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validation_1 = __importDefault(require("../../helper/validation"));
const asyncHandelerForGraphql_1 = __importDefault(require("../../utils/asyncHandelerForGraphql"));
const customError_1 = require("../../utils/customError");
const user_1 = __importDefault(require("../../models/user"));
const fileUpload_1 = require("../../helper/fileUpload");
const options = {
    httpOnly: true,
    secure: true,
};
const userResolver = {
    Query: {
        getUsers: (0, asyncHandelerForGraphql_1.default)(async (parent, args, context) => {
            if (!context.user) {
                throw (0, customError_1.createCustomError)("Unauthorized");
            }
            const users = await user_1.default.findAll();
            return users;
        }),
        getUser: (0, asyncHandelerForGraphql_1.default)(async (_, { id }, context) => {
            if (!context.user) {
                throw (0, customError_1.createCustomError)("Unauthorized");
            }
            const users = await user_1.default.findByPk(id);
            return users;
        }),
    },
    Mutation: {
        updateUser: (0, asyncHandelerForGraphql_1.default)(async (_, { id, username, email, image }, context) => {
            if (!context.user) {
                throw (0, customError_1.createCustomError)("Unauthorized");
            }
            if (!(0, validation_1.default)(email, "emailcheck")) {
                throw (0, customError_1.createCustomError)("Invalid username");
            }
            if (!(0, validation_1.default)(username, "namecheck")) {
                throw (0, customError_1.createCustomError)("Invalid username");
            }
            if (!id) {
                throw (0, customError_1.createCustomError)("id is required");
            }
            await user_1.default.update({
                username,
                email,
                image,
            }, { where: { id: id } });
            return { message: "update successfully" };
        }),
        deleteUser: (0, asyncHandelerForGraphql_1.default)(async (_, { id }, context) => {
            if (!context.user) {
                throw (0, customError_1.createCustomError)("Unauthorized");
            }
            const user = await user_1.default.findByPk(id);
            if (user) {
                await user.destroy();
                return true;
            }
            return false;
        }),
        uploadFile: (0, asyncHandelerForGraphql_1.default)(async (_, { file }, context) => {
            if (!context.user) {
                throw (0, customError_1.createCustomError)("Unauthorized");
            }
            const RETRY_LIMIT = 3;
            const { createReadStream, filename, mimetype, encoding } = await file;
            const stream = createReadStream();
            let attempt = 1;
            while (attempt <= RETRY_LIMIT) {
                try {
                    const publicUrl = await (0, fileUpload_1.uploadFileToSupabase)(stream, filename);
                    const [updated] = await user_1.default.update({
                        image: publicUrl,
                    }, {
                        where: {
                            username: context.user.username,
                        },
                    });
                    if (updated) {
                        return {
                            status: 200,
                            message: "File uploaded successfully",
                        };
                    }
                    else {
                        return {
                            status: 404,
                            message: "User not found",
                        };
                    }
                }
                catch (error) {
                    console.error(`Attempt ${attempt} failed:`, error);
                    if (attempt === RETRY_LIMIT) {
                        throw new Error("All attempts to upload the file failed");
                    }
                }
                attempt += 1;
            }
        }),
    },
};
exports.default = userResolver;
