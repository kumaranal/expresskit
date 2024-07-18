"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const customError_1 = require("./customError");
const asyncHandler = (resolver) => {
    return async (parent, args, context, info) => {
        try {
            return await resolver(parent, args, context, info);
        }
        catch (error) {
            // return "moka"
            // throw new Error(error.message)
            throw (0, customError_1.createCustomError)(error.message, error.staus || 500);
        }
    };
};
exports.default = asyncHandler;
