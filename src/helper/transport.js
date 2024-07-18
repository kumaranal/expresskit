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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../utils/logger"));
const staticConfig_1 = __importDefault(require("./staticConfig"));
const nodemailer_1 = __importDefault(require("nodemailer"));
function getSMTPTransporter() {
    return __awaiter(this, void 0, void 0, function* () {
        let transporter = nodemailer_1.default.createTransport({
            service: staticConfig_1.default.smtpTransporter.service,
            auth: {
                user: staticConfig_1.default.smtpTransporter.email, // your email address to send from
                pass: staticConfig_1.default.smtpTransporter.password, // your Gmail account password
            },
        });
        return transporter;
    });
}
function sendingMail(mailDetails) {
    return __awaiter(this, void 0, void 0, function* () {
        let mailOptions = {};
        if (mailDetails.htmlTemplate) {
            mailOptions = {
                from: staticConfig_1.default.smtpTransporter.email, // sender address
                to: mailDetails.senderEmail, // list of receivers
                subject: mailDetails.subject, // Subject line
                html: mailDetails.htmlTemplate, // html body
            };
        }
        else {
            mailOptions = {
                from: staticConfig_1.default.smtpTransporter.email, // sender address
                to: mailDetails.senderEmail, // list of receivers
                subject: mailDetails.subject, // Subject line
                text: mailDetails.text, // plain text body
            };
        }
        const transporter = yield getSMTPTransporter();
        // Send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return logger_1.default.error("error", error);
            }
            logger_1.default.info("Message sent: %s", info.messageId);
        });
    });
}
exports.default = sendingMail;
