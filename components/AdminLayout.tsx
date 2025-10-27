"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Props {
  children: ReactNode;
}

export default function AdminLayout({ children }: Props) {
  const router = useRouter();


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      

      {/* Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
