"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCustomError = createCustomError;
function createCustomError(message, status) {
    const error = new Error(message);
    if (status) {
        error.status = status;
    }
    return error;
}
