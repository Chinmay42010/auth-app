import nodemailer from "nodemailer";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {
        // Create hashed token
        const hashedToken = await bcryptjs.hash(userId.toString(), 11);

        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 3600000,
            });
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId, {
                forgotPasswordToken: hashedToken,
                forgotPasswordTokenExpiry: Date.now() + 3600000,
            });
        }

        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.NODEMAILER_USER_ID,
                pass: process.env.NODEMAILER_PASSWORD,
            },
        });

        const domain = process.env.domain || "http://localhost:3000";
        const link = `${domain}/verifyemail?token=${encodeURIComponent(hashedToken)}`;
        const action = emailType === "VERIFY" ? "Verify your mail" : "Reset your password";

        const mailOptions = {
            from: "kbchinmay004@gmail.com",
            to: email,
            subject:
                emailType === "VERIFY"
                    ? "Verify your email"
                    : "Reset your password",
            html: `<p>Click <a href="${link}">here</a> to ${action}
            or copy paste the link below in your browser <br> ${link}
            </p>`,
        };

        const mailResponse = await transport.sendMail(mailOptions);
        return mailResponse;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
