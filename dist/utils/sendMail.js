import nodemailer from "nodemailer";
import path from "path";
import ejs from "ejs";
const sendMail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });
    const { email, subject, template, data, attachments } = options;
    const templatePath = path.join(__dirname, "../mails", template);
    const html = await ejs.renderFile(templatePath, data);
    const mailOptions = {
        from: process.env.MAIL,
        to: email,
        subject,
        html,
        attachments,
    };
    await transporter.sendMail(mailOptions);
};
export default sendMail;
