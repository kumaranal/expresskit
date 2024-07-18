"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandeler = (requestHandeler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandeler(req, res, next)).catch((err) => next(err));
    };
};
exports.default = asyncHandeler;
