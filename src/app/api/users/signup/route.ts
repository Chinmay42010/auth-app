import { connect } from "@/dbConfig/dbConfig";
import User from "@/src/models/user.model.js";
import { sendEmail } from "@/src/helpers/mailer";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        await connect();
        const reqBody = await request.json();

        if (!reqBody?.email || !reqBody?.password || !reqBody?.username) {
            return NextResponse.json(
                {
                    error: "Missing required fields (email, password, username)",
                },
                { status: 400 },
            );
        }

        const { username, email, password } = reqBody;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists with this email" },
                { status: 409 },
            );
        }

        const salt = await bcryptjs.genSalt(12);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();

        // Verification email is best-effort: a mail outage should not fail signup
        try {
            await sendEmail({
                email,
                emailType: "VERIFY",
                userId: savedUser._id,
            });
        } catch (mailError) {
            console.error("Verification email failed:", mailError);
        }

        const { password: _, ...userWithoutPassword } = savedUser.toObject();

        return NextResponse.json(
            {
                message: "User created successfully",
                status: 201,
                success: true,
                user: userWithoutPassword,
            },
            { status: 201 },
        );
    } catch (error: any) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 },
        );
    }
}
