import mongoose from "mongoose";

export async function connect() {
    try {
        if (mongoose.connection.readyState >= 1) {
            return;
        }

        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
}
