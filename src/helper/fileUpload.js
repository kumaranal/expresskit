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
exports.uploadFileToSupabaseBase64 = exports.uploadFileToSupabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const customError_1 = require("../utils/customError");
const SUPABASE_URL = process.env.NEW_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SECRETKEY;
const BUCKET_NAME = process.env.SUPABASE_BUCKET;
const supabaseClient = (0, supabase_js_1.createClient)(SUPABASE_URL, SUPABASE_KEY);
const uploadFileToSupabase = (filePath, fileName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const date = new Date().toISOString();
        const { data, error } = yield supabaseClient.storage
            .from(BUCKET_NAME)
            .upload(date, Buffer.from(filePath), {
            upsert: true,
            contentType: fileName,
        });
        if (error) {
            throw (0, customError_1.createCustomError)(error.message, 400);
        }
        const { data: publicURL } = supabaseClient.storage
            .from(BUCKET_NAME)
            .getPublicUrl(date);
        return publicURL.publicUrl;
    }
    catch (error) {
        throw (0, customError_1.createCustomError)(error.message, 400);
    }
});
exports.uploadFileToSupabase = uploadFileToSupabase;
const uploadFileToSupabaseBase64 = (filePath, fileName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const date = new Date().toISOString();
        const { data, error } = yield supabaseClient.storage
            .from(BUCKET_NAME)
            .upload(date, filePath, {
            contentType: fileName,
            upsert: true,
        });
        if (error) {
            throw (0, customError_1.createCustomError)(error.message, 400);
        }
        const { data: publicURL } = supabaseClient.storage
            .from(BUCKET_NAME)
            .getPublicUrl(date);
        return publicURL.publicUrl;
    }
    catch (error) {
        throw (0, customError_1.createCustomError)(error.message, 400);
    }
});
exports.uploadFileToSupabaseBase64 = uploadFileToSupabaseBase64;
