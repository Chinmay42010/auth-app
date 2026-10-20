"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function SignupPage() {
    const router = useRouter();
    const [user, setUser] = useState({
        email: "",
        password: "",
        username: "",
    });
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const isValid =
            user.email.length > 0 &&
            user.password.length > 7 &&
            user.username.length > 0;

        setButtonDisabled(!isValid || loading);
    }, [user, loading]);

    const onSignup = async () => {
        try {
            setLoading(true);
            const response = await axios.post("api/users/signup", user);
            console.log(`signup success ${response.data}`);
            router.push("/login");
        } catch (error: any) {
            console.log(`Signup failed`);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>Signup</h1>
            <br />
            <label htmlFor="username">Username</label>
            <input
                className="p-4 border-blue-100 rounded-md mb-4 focus:outline-none focus:border-blue-400"
                type="text"
                id="username"
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                placeholder="Username"
            />
            <label htmlFor="email">Email</label>
            <input
                className="p-4 border-blue-100 rounded-md mb-4 focus:outline-none focus:border-blue-400"
                type="email"
                id="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                placeholder="Email"
            />
            <label htmlFor="password">Password</label>
            <input
                className="p-4 border-blue-100 rounded-md mb-4 focus:outline-none focus:border-blue-400"
                type="password"
                id="password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                placeholder="Password"
            />
            <button
                onClick={onSignup}
                disabled={buttonDisabled}
                className="bg-blue-400 hover:bg-blue-700 text-white rounded-md py-1 px-2 duration-300"
            >
                {loading ? "Signing up..." : "Signup"}
            </button>
            <Link href="/login" className="text-blue-800 text-sm p-2">
                Visit Login page
            </Link>
        </div>
    );
}
