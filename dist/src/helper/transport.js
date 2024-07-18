"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../utils/logger"));
const staticConfig_1 = __importDefault(require("./staticConfig"));
const nodemailer_1 = __importDefault(require("nodemailer"));
async function getSMTPTransporter() {
    let transporter = nodemailer_1.default.createTransport({
        service: staticConfig_1.default.smtpTransporter.service,
        auth: {
            user: staticConfig_1.default.smtpTransporter.email, // your email address to send from
            pass: staticConfig_1.default.smtpTransporter.password, // your Gmail account password
        },
    });
    return transporter;
}
async function sendingMail(mailDetails) {
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
    const transporter = await getSMTPTransporter();
    // Send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return logger_1.default.error("error", error);
        }
        logger_1.default.info("Message sent: %s", info.messageId);
    });
}
exports.default = sendingMail;
