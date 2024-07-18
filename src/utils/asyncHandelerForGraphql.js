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
const customError_1 = require("./customError");
const asyncHandler = (resolver) => {
    return (parent, args, context, info) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield resolver(parent, args, context, info);
        }
        catch (error) {
            // return "moka"
            // throw new Error(error.message)
            throw (0, customError_1.createCustomError)(error.message, error.staus || 500);
        }
    });
};
exports.default = asyncHandler;
