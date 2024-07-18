"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordTemplate = void 0;
exports.default = sendEmail;
function sendEmail(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const transporter = yield getTransporter();
        return transporter.sendMail(config);
    });
}
function getTransporter() {
    // if (isTest()) {
    //   return getMockMailTransporter();
    // }
    // if (!configuration.production) {
    //   return getEtherealMailTransporter();
    // }
    return getSMTPTransporter();
}
function getSMTPTransporter() {
    return __awaiter(this, void 0, void 0, function* () {
        const nodemailer = yield Promise.resolve().then(() => __importStar(require("nodemailer")));
        const user = process.env.EMAIL_USER;
        const pass = process.env.EMAIL_PASSWORD;
        const host = process.env.EMAIL_HOST;
        const port = Number(process.env.EMAIL_PORT);
        // const secure = port === 465 && !configuration.production;
        const secure = port === 465;
        // validate that we have all the required configuration
        if (!user || !pass || !host || !port) {
            throw new Error(`Missing email configuration. Please add the following environment variables:
      EMAIL_USER
      EMAIL_PASSWORD
      EMAIL_HOST
      EMAIL_PORT
      `);
        }
        return nodemailer.createTransport({
            host,
            port,
            secure,
            auth: {
                user,
                pass,
            },
        });
    });
}
function getEtherealMailTransporter() {
    return __awaiter(this, void 0, void 0, function* () {
        const nodemailer = yield Promise.resolve().then(() => __importStar(require("nodemailer")));
        const testAccount = yield getEtherealTestAccount();
        const host = "smtp.ethereal.email";
        const port = 587;
        return nodemailer.createTransport({
            host,
            port,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    });
}
function getMockMailTransporter() {
    return {
        sendMail(params) { },
    };
}
function getEtherealTestAccount() {
    return __awaiter(this, void 0, void 0, function* () {
        const user = process.env.ETHEREAL_EMAIL;
        const pass = process.env.ETHEREAL_PASSWORD;
        // if we have added an Ethereal account, we reuse these credentials to
        // send the email
        if (user && pass) {
            return {
                user,
                pass,
            };
        }
        // Otherwise, we create a new account and recommend to add the credentials
        // to the configuration file
        return createEtherealTestAccount();
    });
}
function createEtherealTestAccount() {
    return __awaiter(this, void 0, void 0, function* () {
        const nodemailer = yield Promise.resolve().then(() => __importStar(require("nodemailer")));
        const newAccount = yield nodemailer.createTestAccount();
        return newAccount;
    });
}
function isTest() {
    return process.env.IS_CI === "true";
}
const resetPasswordTemplate = (baseUrl, uniqueId) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #dddddd;
      border-radius: 10px;
    }
    .header {
      text-align: center;
      padding: 10px;
      background-color: #f4f4f4;
      border-bottom: 1px solid #dddddd;
    }
    .content {
      padding: 20px;
    }
    .footer {
      text-align: center;
      padding: 10px;
      background-color: #f4f4f4;
      border-top: 1px solid #dddddd;
    }
    a {
      color: #3498db;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      font-size: 16px;
      color: #ffffff;
      background-color: #3498db;
      border-radius: 5px;
      text-decoration: none;
    }
    .button:hover {
      background-color: #2980b9;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Password Reset Request</h2>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>We received a request to reset your password. You can reset your password by clicking one of the links below:</p>
      <p>
        <a href="${baseUrl}/?uuid=${uniqueId}" class="button">Reset Password</a>
      </p>
      <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
      <p>Thanks,</p>
      <p>The MyApp Team</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 MyApp. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
exports.resetPasswordTemplate = resetPasswordTemplate;
