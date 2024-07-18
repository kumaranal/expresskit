"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSuccessResponse = createSuccessResponse;
function createSuccessResponse(res, data, statusCode) {
    if (typeof data === "string") {
        data = data.toLocaleLowerCase();
    }
    const response = { message: "SUCCESS", data };
    const statuscode = statusCode || 200;
    res.status(statuscode).json(response);
}
