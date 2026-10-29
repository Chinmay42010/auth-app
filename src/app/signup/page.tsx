"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function SignupPage() {
    const router = useRouter();
    const [user, setUser] = useState({ email: "", password: "", username: "" });
    const [loading, setLoading] = useState(false);
    const isInvalid = !user.email || !user.username || user.password.length < 8;

    const onSignup = async (e: FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            await axios.post("/api/users/signup", user);
            toast.success("Account Created — check your email to verify");
            router.push("/login");
        } catch (error: any) {
            toast.error(error.response?.data?.error || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen py-2 px-4 bg-gray-50">
            <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md border border-gray-100">
                <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">Signup</h1>

                <form onSubmit={onSignup} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <input
                            className="w-full p-2.5 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
                            type="text"
                            id="username"
                            autoComplete="username"
                            autoFocus
                            value={user.username}
                            onChange={(e) => setUser({ ...user, username: e.target.value })}
                            placeholder="Username"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            className="w-full p-2.5 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
                            type="email"
                            id="email"
                            autoComplete="email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            placeholder="Email"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password{" "}
                            <span className="text-gray-400 font-normal">(min 8 characters)</span>
                        </label>
                        <input
                            className="w-full p-2.5 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            placeholder="Password"
                            required
                            minLength={8}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isInvalid || loading}
                        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-md transition-colors duration-200"
                    >
                        {loading ? "Signing up..." : "Signup"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-500 hover:text-blue-600 font-medium">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
