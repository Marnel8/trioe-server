"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const sendMail = async (options) => {
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });
    const { email, subject, template, data, attachments } = options;
    const templatePath = path_1.default.join(__dirname, "../mails", template);
    const html = await ejs_1.default.renderFile(templatePath, data);
    const mailOptions = {
        from: process.env.MAIL,
        to: email,
        subject,
        html,
        attachments,
    };
    await transporter.sendMail(mailOptions);
};
exports.default = sendMail;
