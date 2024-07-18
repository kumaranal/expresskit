"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    constructor(statusCode, message = "Success", data) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.status = statusCode < 400;
    }
}
exports.ApiResponse = ApiResponse;
