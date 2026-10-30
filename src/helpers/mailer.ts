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

        const domain = process.env.domain || "http://localhost:3000";
        const link = `${domain}/verifyemail?token=${encodeURIComponent(hashedToken)}`;
        const action = emailType === "VERIFY" ? "Verify your mail" : "Reset your password";

        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: process.env.EMAIL_FROM || "onboarding@resend.dev",
                to: email,
                subject:
                    emailType === "VERIFY"
                        ? "Verify your email"
                        : "Reset your password",
                html: `<p>Click <a href="${link}">here</a> to ${action}
                or copy paste the link below in your browser <br> ${link}
                </p>`,
            }),
        });

        if (!response.ok) {
            throw new Error(`Resend ${response.status}: ${await response.text()}`);
        }

        return await response.json();
    } catch (error: any) {
        throw new Error(error.message);
    }
};
