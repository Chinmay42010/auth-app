import { connect } from "@/dbConfig/dbConfig";
import User from "@/src/models/user.model.js";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
    try {
        await connect();
        const reqbody = await request.json();
        const { email, password } = reqbody;

        // console.log(reqbody);

        // check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: "User does not exist" },
                { status: 400 },
            );
        }

        const validPassword = await bcryptjs.compare(password, user.password);

        if (!validPassword) {
            return NextResponse.json(
                { error: "Password Invalid" },
                { status: 400 },
            );
        }

        //create token data
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email,
        };

        //create token
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, {
            expiresIn: "1h",
        });

        const response = NextResponse.json({
            message: "Login successful",
            status: 200,
        });

        response.cookies.set("token", token, { httpOnly: false });

        return response;
        // Check if the passord is correct
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
