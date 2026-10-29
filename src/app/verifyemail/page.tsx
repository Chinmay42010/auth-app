"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error" | null>(
    null,
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    if (!token) {
      setStatus("error");
      setMessage("No verification token provided");
      return;
    }

    const verify = async () => {
      try {
        const res = await axios.post("/api/users/verifyemail", {
          token,
        });
        setStatus("success");
        setMessage(res.data.message || "Email verified successfully");
      } catch (error: any) {
        setStatus("error");
        setMessage(error.response?.data?.error || "Verification failed");
      }
    };

    verify();
  }, []);

  const isSuccess = status === "success";
  const isError = status === "error";

  const bgColor = isSuccess
    ? "bg-green-50 border-green-200"
    : isError
      ? "bg-red-50 border-red-200"
      : "bg-gray-50 border-gray-200";
  const textColor = isSuccess
    ? "text-green-700"
    : isError
      ? "text-red-700"
      : "text-gray-700";
  const icon = isSuccess ? "OK" : isError ? "!" : "...";

  return (
    <div className="flex items-center justify-center min-h-screen py-2 px-4 bg-gray-50">
      <div
        className={`bg-white p-8 rounded-xl shadow-sm w-full max-w-md border border-gray-100 ${bgColor}`}
      >
        <div className="text-center mb-6">
          <div className="text-2xl mb-2 font-semibold">{icon}</div>
          <h1 className={`text-xl font-semibold ${textColor} mb-2`}>
            {isSuccess ? "Verified" : isError ? "Error" : "Verifying..."}
          </h1>
          <p className="text-sm text-gray-600">
            {message || (status === "loading" ? "Checking your token..." : "")}
          </p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-6 py-2 bg-white border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
