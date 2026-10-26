import { getdataFromToken } from "@/src/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/src/models/user.model.js";
import { connect } from "@/dbConfig/dbConfig";
import { nextRequestInsights } from "next/dist/cli/next-request-insights";

export async function GET(request: NextRequest) {
    await connect();
    try {
        const userId = await getdataFromToken(request);
        const user = await User.findOne({ _id: userId }).select("-password");
        const token = request.cookies.get("token")?.value || "";

        return NextResponse.json({
            message: "User found",
            data: user,
            token,
        });
    } catch (error: any) {
        return NextResponse.json({
            error: error.message,
            status: 400,
        });
    }
}
