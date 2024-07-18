"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-var-requires */
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const crypto_1 = require("crypto");
const { combine, timestamp, printf, colorize } = winston_1.default.format;
// Define custom log format
const logFormat = printf(({ level, message, timestamp, ...data }) => {
    const ENV = process.env.NODE_ENV || "development";
    const deviceInfo = `Hostname: ${require("os").hostname()}, Platform: ${require("os").platform()}, Arch: ${require("os").arch()}`;
    const generateLogId = () => (0, crypto_1.randomBytes)(16).toString("hex");
    const appVersion = process.env.npm_package_version || "unknown";
    const proccessId = process.pid.toString() || "unknown";
    const response = {
        level,
        logId: generateLogId(),
        timestamp,
        appInfo: {
            deviceInfo,
            appVersion,
            environment: ENV,
            proccessId: proccessId,
        },
        message,
        data,
    };
    return JSON.stringify(response);
});
// Define custom log format for console
const consoleLogFormat = printf(({ level, message, timestamp, metadata }) => {
    const dataString = metadata && Object.keys(metadata).length > 0
        ? JSON.stringify(metadata)
        : "";
    return `${timestamp} ${level}: ${message} : ${dataString}`;
});
// Configure Winston logger
const logger = winston_1.default.createLogger({
    level: "info",
    format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), colorize(), winston_1.default.format.metadata({ fillExcept: ["message", "level", "timestamp"] })),
    transports: [
        new winston_1.default.transports.Console({
            format: combine(colorize(), consoleLogFormat),
        }),
        new winston_daily_rotate_file_1.default({
            filename: "logs/combined-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            level: "silly",
            maxSize: "20m",
            maxFiles: "14d",
            format: combine(logFormat),
        }),
        new winston_daily_rotate_file_1.default({
            filename: "logs/warning-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            level: "warn",
            maxSize: "20m",
            maxFiles: "14d",
            format: combine(logFormat),
        }),
        new winston_daily_rotate_file_1.default({
            filename: "logs/info-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            level: "info",
            maxSize: "20m",
            maxFiles: "14d",
        }),
        new winston_daily_rotate_file_1.default({
            filename: "logs/error-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            level: "error",
            maxSize: "20m",
            maxFiles: "14d",
        }),
    ],
});
exports.default = logger;
