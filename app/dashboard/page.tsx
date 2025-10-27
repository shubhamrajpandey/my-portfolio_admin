"use client";

import AdminLayout from "../../components/AdminLayout";
import MessageCards from "../../components/MessageCards";

export default function DashboardPage() {
  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        
        <MessageCards />
      </div>
    </AdminLayout>
  );
}
