"use strict";
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
const fileDownloadFromSupabase = async (filePath, res) => {
    try {
        const imageName = await (0, imageName_1.default)(filePath);
        const { data, error } = await supabaseClient.storage
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
};
exports.default = fileDownloadFromSupabase;
