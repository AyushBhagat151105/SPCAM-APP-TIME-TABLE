import React from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { FaHome, FaUser, FaEnvelope, FaCalendarAlt } from "react-icons/fa";
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-24">
        {/* Admin Profile Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {/* Profile Card */}
          <div className="bg-gray-800 rounded-xl shadow-xl p-6 border-2 border-indigo-500/20 md:col-span-2">
            <div className="flex items-center space-x-6">
              <div className="bg-indigo-500 rounded-full p-4">
                <FaUser className="text-4xl text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-indigo-400 mb-2">
                  Welcome, {user.name}!
                </h2>
                <div className="space-y-2">
                  <p className="flex items-center">
                    <FaUser className="mr-2 text-gray-400" />
                    <strong>Role:</strong> {user.role}
                  </p>
                  <p className="flex items-center">
                    <FaEnvelope className="mr-2 text-gray-400" />
                    <strong>Email:</strong> {user.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800 rounded-xl shadow-xl p-6 border-2 border-indigo-500/20 flex flex-col justify-center">
            <h3 className="text-xl font-semibold text-indigo-400 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg transition flex items-center justify-center">
                <FaHome className="mr-2" /> Home
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg transition flex items-center justify-center">
                <FaCalendarAlt className="mr-2" /> Timetable
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-indigo-400 mb-6">
            Management Overview
          </h2>
          <DashboardCards />
        </div>

        {/* Timetable Section */}
        <div className="bg-gray-800 rounded-xl shadow-xl p-6 border-2 border-indigo-500/20">
          <h3 className="text-2xl font-bold text-indigo-400 mb-6 flex items-center">
            <FaCalendarAlt className="mr-3" /> Upcoming Timetable
          </h3>
          {/* Add a compact timetable preview or upcoming events */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-300">No upcoming events</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
