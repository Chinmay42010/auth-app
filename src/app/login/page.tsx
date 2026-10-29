"use client";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const isInvalid = !user.email || !user.password;

  const onLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post("/api/users/login", user);
      toast.success("Login Success");
      router.push("/profile");
    } catch (error: any) {
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-2 px-4 bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md border border-gray-100">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Login
        </h1>

        <form onSubmit={onLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              className="w-full p-2.5 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
              type="email"
              id="email"
              autoComplete="email"
              autoFocus
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              placeholder="Email"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              className="w-full p-2.5 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all"
              type="password"
              id="password"
              autoComplete="current-password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="Password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isInvalid || loading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-md transition-colors duration-200"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
