"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const customError_1 = require("../utils/customError");
const getImageName = async (filePath) => {
    try {
        const parts = filePath.split("/image/")[1];
        return parts;
    }
    catch (error) {
        throw (0, customError_1.createCustomError)(error);
    }
};
exports.default = getImageName;
