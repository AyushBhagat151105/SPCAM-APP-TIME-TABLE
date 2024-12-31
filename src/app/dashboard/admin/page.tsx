import React from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Timetable from "@/components/Tiemtable";
import DashboardCards from "@/components/DashboardCards";

const AdminPage = async () => {
  // Fetch session details
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Redirect to the home page if no session is found
  if (!session) {
    return redirect("/");
  }

  const user = session?.user;

  // Redirect to the dashboard if the user is not an admin
  if (!user || user.role !== "admin") {
    return redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#1b1e2e] text-gray-100">
      {/* Admin Navigation Bar */}
      <nav className="bg-[#111827] p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-lg font-bold text-orange-500">Admin Dashboard</h1>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Admin Details */}
        <div className="bg-[#252b3c] p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-bold text-orange-500 mb-4">
            Welcome, {user.name}!
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Role:</strong> {user.role}
            </li>
            <li>
              <strong>Email:</strong> {user.email}
            </li>
          </ul>
        </div>

        <div className="m-5">
          {/* Dashboard Cards */}
          <DashboardCards />
        </div>

        {/* Timetable Section */}
        <div className="bg-[#252b3c] p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-orange-500 mb-4">
            Manage Timetable
          </h3>
          <Timetable />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
