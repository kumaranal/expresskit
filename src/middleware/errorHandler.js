"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = require("../utils/ApiError");
const errorHandlerfn = (err, req, res, next) => {
    const status = err instanceof ApiError_1.ApiError ? err.statusCode : err.status || 500;
    const message = err.message.toLowerCase() || "An unexpected error occurred";
    const errors = err instanceof ApiError_1.ApiError ? err.errors : [];
    res.status(status).json({
        status: "Fail",
        message: message,
        errors: errors,
    });
};
exports.default = errorHandlerfn;
