"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const staticConfig = {
    smtpTransporter: {
        email: "mayankxotiv@gmail.com",
        password: "rfmi zucd lwjx qsch",
        service: "gmail",
    },
    forgotPasswordEmail: {
        subject: "Reset Password",
        text: "Your reset password link ",
    },
    signUpEmail: {
        subject: "Welcome to our website",
        text: "Your account has been created",
    },
    notifications: {
        title: "Welcome to our Expresskit",
        body: "Your most welcome to our Expresskit",
    },
};
exports.default = staticConfig;
