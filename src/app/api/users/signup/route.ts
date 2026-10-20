import { connect } from "@/dbConfig/dbConfig";
import User from "@/src/models/user.model.js";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

await connect();
export async function POST(request: NextRequest) {
    try {
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
