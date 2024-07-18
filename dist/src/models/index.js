"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = require('sequelize');
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const env = process.env.NODE_ENV || 'development';
const config = {
    "username": process.env.CONFIG_USERNAME || "",
    "password": process.env.CONFIG_PASSWORD || "",
    "database": process.env.CONFIG_DATABASE || "",
    "host": process.env.CONFIG_HOST || "",
    "dialect": process.env.CONFIG_DIALECT || ""
};
let sequelize;
if (config.username || config.password || config.database) {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}
else {
    throw new Error("database variable not exist");
}
exports.default = sequelize;
