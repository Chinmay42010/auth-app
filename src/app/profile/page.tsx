"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
    const router = useRouter();

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

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>Profile</h1>
            <br />
            <p>Profile Page</p>
            <br />

            <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-700 text-white rounded-md py-1 px-2 duration-200 "
            >
                Logout
            </button>
        </div>
    );
}
