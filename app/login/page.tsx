"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import API from "../../services/api";
import { toast, Toaster } from "react-hot-toast";
import { Sun, Moon } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("Pandey5raj@");
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(true);

  const toggleDark = () => setDark(!dark);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await API.post("/auth/login", { email, password });
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
        toast.success("Login Successful!");
        router.push("/dashboard");
      } else {
        toast.error("Login failed: no token received");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else if (typeof err === "object" && err !== null && "response" in err) {
        // @ts-expect-error: response might not be typed
        toast.error(err.response?.data?.message || "Login failed");
      } else {
        toast.error("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const theme = {
    bg: dark ? "bg-[#0f0f0f]" : "bg-gray-50",
    card: dark ? "bg-[#1a1a1a]" : "bg-white",
    text: dark ? "text-white" : "text-gray-900",
    btn: dark ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600",
  };

  return (
    <div className={`${theme.bg} ${theme.text} min-h-screen flex items-center justify-center transition-colors duration-500 p-4 sm:p-6`}>
      <Toaster position="top-right" />
      <div
        className={`${theme.card} w-full max-w-md sm:max-w-lg md:max-w-xl p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl space-y-6`}
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Admin Login</h1>
          <button
            onClick={toggleDark}
            className={`w-9 h-9 rounded-full flex items-center justify-center border ${dark ? "border-[#2b2b2b]" : "border-gray-300"} transition`}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 sm:p-4 rounded-lg border border-gray-300 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 sm:p-4 rounded-lg border border-gray-300 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            required
          />
          <button
            type="submit"
            className={`${theme.btn} w-full py-3 sm:py-4 rounded-lg text-sm sm:text-base font-semibold transition`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
