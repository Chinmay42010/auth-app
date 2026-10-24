import { getdataFromToken } from "@/src/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import user from "@/src/models/user.model.js";
import { connect } from "@/dbConfig/dbConfig";
import { nextRequestInsights } from "next/dist/cli/next-request-insights";

export async function GET(request: NextRequest) {
    await connect();
    try {
        const userId = await getdataFromToken(request);
        const user = await User.findOne({ _id: userId }).select("-password");

        return NextResponse.json({
            message: "User found",
            data: user,
        });
    } catch (error: any) {
        return NextResponse.json({
            error: error.message,
            status: 400,
        });
    }
}
