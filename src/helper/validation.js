"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../utils/logger"));
const zod_1 = require("zod");
const passwordSchema = zod_1.z
    .string()
    .min(8, "Password is required")
    .max(15, "Password must be at most 15 characters")
    .refine((value) => /^[a-zA-Z0-9!@#$%^&*()_+~`|}{[\]:;?><,./-=]{1,15}$/.test(value), {
    message: "Password must be alphanumeric",
})
    .refine((value) => /[A-Z]/.test(value), {
    message: "Password must contain at least one capital letter",
})
    .refine((value) => /[!@#$%^&*()_+~`|}{[\]:;?><,./-=]/.test(value), {
    message: "Password must contain at least one special character",
});
const emailSchema = zod_1.z.string().email("Invalid email address");
const nameSchema = zod_1.z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(25, "Name must be at most 25 characters long");
function validateAttributes(value, checkType) {
    try {
        switch (checkType) {
            case "emailcheck":
                emailSchema.parse(value);
                break;
            case "passwordcheck":
                passwordSchema.parse(value);
                break;
            case "namecheck":
                nameSchema.parse(value);
                break;
            default:
                throw new Error("Invalid check type");
        }
        return true;
    }
    catch (e) {
        logger_1.default.error("error occurs", { error: e });
        return false;
    }
}
exports.default = validateAttributes;
