import React from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { FaCalendarAlt, FaBell } from "react-icons/fa";
import Link from "next/link";

const TeacherDashboard = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/");
  }

  const user = session?.user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
            <p className="text-gray-400 mt-2 capitalize">
              {user?.role} Dashboard
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative">
              <FaBell className="text-2xl text-gray-300 hover:text-white transition" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            {
              icon: FaCalendarAlt,
              title: "Timetable",
              description: "View class schedule",
              href: "/dashboard/list/time-table",
            },
          ].map((card, index) => (
            <Link
              key={index}
              href={card.href}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6
              transform transition duration-300 hover:scale-105 hover:shadow-lg
              flex items-center space-x-6 group"
            >
              <div className="bg-gray-700 p-4 rounded-full group-hover:bg-indigo-600 transition">
                <card.icon className="text-3xl text-gray-300 group-hover:text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold group-hover:text-indigo-400 transition">
                  {card.title}
                </h3>
                <p className="text-gray-400 text-sm">{card.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Decorative Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute right-0 top-1/4 w-64 md:w-96 h-64 md:h-96
          bg-indigo-500/10 rounded-full blur-3xl"
        />
        <div
          className="absolute right-1/4 bottom-0 w-64 md:w-96 h-64 md:h-96
          bg-green-500/5 rounded-full blur-3xl"
        />
      </div>
    </div>
  );
};

export default TeacherDashboard;
