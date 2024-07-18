"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFileToSupabaseBase64 = exports.uploadFileToSupabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const customError_1 = require("../utils/customError");
const SUPABASE_URL = process.env.NEW_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SECRETKEY;
const BUCKET_NAME = process.env.SUPABASE_BUCKET;
const supabaseClient = (0, supabase_js_1.createClient)(SUPABASE_URL, SUPABASE_KEY);
const uploadFileToSupabase = async (filePath, fileName) => {
    try {
        const date = new Date().toISOString();
        const { data, error } = await supabaseClient.storage
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
};
exports.uploadFileToSupabase = uploadFileToSupabase;
const uploadFileToSupabaseBase64 = async (filePath, fileName) => {
    try {
        const date = new Date().toISOString();
        const { data, error } = await supabaseClient.storage
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
};
exports.uploadFileToSupabaseBase64 = uploadFileToSupabaseBase64;
