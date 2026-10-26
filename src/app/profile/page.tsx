"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
    const router = useRouter();
    const [data, setData] = useState("nothing");

    const logout = async () => {
        try {
            await axios.get("/api/users/logout");

            toast.success("Logout Successful");
            router.push("/login");
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.error || error.message);
            } else if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("An unexpected error occurred");
            }
        }
    };

    const getUserDetails = async () => {
        const res = await axios.get("/api/users/me");
        console.log(res.data);
        // API returns { message: "User found", data: user, token }
        // Show user ID safely, fallback to error message
        if (res.data && res.data.data && res.data.data._id) {
            setData(res.data.data._id);
        } else if (res.data && res.data.token) {
            // Fallback: show first part of token if no _id available
            setData("token:" + res.data.token.slice(0, 20) + "...");
        } else {
            setData("Error: User data not found");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>Profile</h1>
            <br />
            <p>Profile Page</p>

            <h2 className="bg-blue-500 p-2 rounded-md">
                {data === "nothing" ? (
                    "Nothing"
                ) : (
                    <Link className="bg-blue-400" href={`/profile/${data}`}>
                        {data}
                    </Link>
                )}
            </h2>

            <br />

            <button
                onClick={logout}
                className="bg-red-400 hover:bg-red-700 text-white rounded-md py-2 px-4 duration-200 cursor-pointer"
            >
                Logout
            </button>
            <button
                onClick={getUserDetails}
                className="bg-green-400 hover:bg-green-700 text-white rounded-md py-2 px-4 mt-2 duration-200 cursor-pointer"
            >
                Get user Details
            </button>
        </div>
    );
}
