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
        getUsers: (0, asyncHandelerForGraphql_1.default)((parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            if (!context.user) {
                throw (0, customError_1.createCustomError)("Unauthorized");
            }
            const users = yield user_1.default.findAll();
            return users;
        })),
        getUser: (0, asyncHandelerForGraphql_1.default)((_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            if (!context.user) {
                throw (0, customError_1.createCustomError)("Unauthorized");
            }
            const users = yield user_1.default.findByPk(id);
            return users;
        })),
    },
    Mutation: {
        updateUser: (0, asyncHandelerForGraphql_1.default)((_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id, username, email, image }, context) {
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
            yield user_1.default.update({
                username,
                email,
                image,
            }, { where: { id: id } });
            return { message: "update successfully" };
        })),
        deleteUser: (0, asyncHandelerForGraphql_1.default)((_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { id }, context) {
            if (!context.user) {
                throw (0, customError_1.createCustomError)("Unauthorized");
            }
            const user = yield user_1.default.findByPk(id);
            if (user) {
                yield user.destroy();
                return true;
            }
            return false;
        })),
        uploadFile: (0, asyncHandelerForGraphql_1.default)((_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { file }, context) {
            if (!context.user) {
                throw (0, customError_1.createCustomError)("Unauthorized");
            }
            const RETRY_LIMIT = 3;
            const { createReadStream, filename, mimetype, encoding } = yield file;
            const stream = createReadStream();
            let attempt = 1;
            while (attempt <= RETRY_LIMIT) {
                try {
                    const publicUrl = yield (0, fileUpload_1.uploadFileToSupabase)(stream, filename);
                    const [updated] = yield user_1.default.update({
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
        })),
    },
};
exports.default = userResolver;
