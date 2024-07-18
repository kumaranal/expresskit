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
const supabase_js_1 = require("@supabase/supabase-js");
const customError_1 = require("../utils/customError");
const imageName_1 = __importDefault(require("./imageName"));
const SUPABASE_URL = process.env.NEW_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SECRETKEY;
const BUCKET_NAME = process.env.SUPABASE_BUCKET;
const supabaseClient = (0, supabase_js_1.createClient)(SUPABASE_URL, SUPABASE_KEY);
const fileDownloadFromSupabase = (filePath, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imageName = yield (0, imageName_1.default)(filePath);
        const { data, error } = yield supabaseClient.storage
            .from(BUCKET_NAME)
            .download(imageName);
        if (error) {
            throw (0, customError_1.createCustomError)(error.message, 401);
        }
        const mimeType = data.type || "application/octet-stream";
        return { imageName, mimeType, data };
    }
    catch (error) {
        throw (0, customError_1.createCustomError)(error.message, 500);
    }
});
exports.default = fileDownloadFromSupabase;
