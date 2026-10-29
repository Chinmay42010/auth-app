"use client";

import { useState } from "react";
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
    try {
      const res = await axios.get("/api/users/me");
      if (res.data?.data?._id) {
        setData(res.data.data._id);
      } else if (res.data?.token) {
        setData("token:" + res.data.token.slice(0, 20) + "...");
      } else {
        setData("Error: User data not found");
      }
    } catch (error: any) {
      setData("Error: " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 px-4 bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md border border-gray-100">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-2">
          Profile
        </h1>
        <p className="text-gray-500 text-center mb-6 text-sm">
          Your account details
        </p>

        <div className="bg-blue-50 p-4 rounded-md mb-6 border border-blue-100">
          {data === "nothing" ? (
            <p className="text-gray-500 text-sm">No details loaded yet</p>
          ) : (
            <Link
              href={`/profile/${data}`}
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline break-all"
            >
              {data}
            </Link>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={getUserDetails}
            className="w-full bg-green-100 hover:bg-green-200 text-green-700 font-medium py-2.5 rounded-md transition-colors duration-200 border border-green-200"
          >
            Get user Details
          </button>
          <button
            onClick={logout}
            className="w-full bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2.5 rounded-md transition-colors duration-200 border border-red-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
