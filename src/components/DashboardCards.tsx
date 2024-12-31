// src/components/DashboardCards.tsx
"use client";
import { useEffect, useState } from "react";

const DashboardCards = () => {
  const [counts, setCounts] = useState({
    teachers: 0,
    classes: 0,
    users: 0,
  });

  const fetchCounts = async () => {
    try {
      const [teachersRes, classesRes, usersRes] = await Promise.all([
        fetch("/api/teachers/count"),
        fetch("/api/classes/count"),
        fetch("/api/user/count"),
      ]);

      const teachersCount = await teachersRes.json();
      const classesCount = await classesRes.json();
      const usersCount = await usersRes.json();

      setCounts({
        teachers: teachersCount.count,
        classes: classesCount.count,
        users: usersCount.count,
      });
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6 rounded-lg shadow-lg text-center transform transition duration-500 hover:scale-105">
        <h2 className="text-2xl font-semibold mb-2 text-white">Teachers</h2>
        <p className="text-4xl font-bold text-white">{counts.teachers}</p>
      </div>
      <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 rounded-lg shadow-lg text-center transform transition duration-500 hover:scale-105">
        <h2 className="text-2xl font-semibold mb-2 text-white">Classes</h2>
        <p className="text-4xl font-bold text-white">{counts.classes}</p>
      </div>
      <div className="bg-gradient-to-r from-pink-500 to-red-500 p-6 rounded-lg shadow-lg text-center transform transition duration-500 hover:scale-105">
        <h2 className="text-2xl font-semibold mb-2 text-white">Users</h2>
        <p className="text-4xl font-bold text-white">{counts.users}</p>
      </div>
    </div>
  );
};

export default DashboardCards;
