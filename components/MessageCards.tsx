"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import API from "../services/api";
import { FiTrash2, FiLogOut } from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [dark, setDark] = useState(true);
  const messagesRef = useRef<Message[]>([]);

  const pageSize = 10;

  const toggleDark = () => setDark(!dark);

  const fetchMessages = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/my-portfolio", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allMessages: Message[] = res.data.data || [];

      if (allMessages.length > messagesRef.current.length) {
        toast.success("📩 New message received!");
      }

      messagesRef.current = allMessages;

      setMessages(allMessages.slice((page - 1) * pageSize, page * pageSize));
      setTotalPages(Math.ceil(allMessages.length / pageSize));
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  }, [page]);

  const deleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/my-portfolio/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(messages.filter((msg) => msg._id !== id));
      toast.success("Message deleted!");
    } catch {
      toast.error("Failed to delete message");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    window.location.href = "/login";
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const theme = {
    bg: dark ? "bg-[#0f0f0f]" : "bg-gray-50",
    card: dark ? "bg-[#1a1a1a]" : "bg-white",
    text: dark ? "text-white" : "text-gray-900",
    btn: dark ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600",
  };

  return (
    <div className={`${theme.bg} ${theme.text} min-h-screen transition-colors duration-500 rounded-2xl `}>
      <Toaster position="top-right" />

      {/* Header */}
      <header className="flex justify-between items-center p-6 border-b border-gray-700 md:border-gray-300">
        <h1 className="text-2xl font-bold">Portfolio Message</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleDark}
            className={`w-9 h-9 rounded-full flex items-center justify-center border ${dark ? "border-[#2b2b2b]" : "border-gray-300"}`}
          >
            {dark ? "☀️" : "🌙"}
          </button>
          <button
            onClick={logout}
            className={`${theme.btn} flex items-center gap-2 px-3 py-1 rounded-md text-sm font-semibold`}
          >
            <FiLogOut size={16} /> Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="p-6 md:p-10 space-y-6 max-w-5xl mx-auto">
        {loading ? (
          <p className="text-center mt-10">Loading messages...</p>
        ) : (
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className={`${theme.card} p-5 rounded-2xl shadow-md hover:shadow-lg transition flex flex-col md:flex-row md:justify-between md:items-center`}
              >
                <div className="flex-1">
                  <p className="font-bold text-blue-500">{msg.name}</p>
                  <p className="text-gray-400 text-sm">{msg.email}</p>
                  <p className="mt-2">{msg.message}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {new Date(msg.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="mt-3 md:mt-0 md:ml-4 flex items-center gap-2">
                  <button
                    onClick={() => deleteMessage(msg._id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center space-x-2 mt-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`px-3 py-1 rounded ${page === num ? "bg-blue-600 text-white" : "bg-gray-300"}`}
              >
                {num}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
