"use client";
import { useEffect, useState } from "react";
import { FaChalkboardTeacher, FaUserFriends, FaSchool } from "react-icons/fa";
import CountUp from "react-countup";

const DashboardCards = () => {
  const [counts, setCounts] = useState({
    teachers: 0,
    classes: 0,
    users: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchCounts = async () => {
    setIsLoading(true);
    try {
      const [teachersRes, classesRes, usersRes] = await Promise.all([
        fetch("/api/teachers/count", { method: "GET" }),
        fetch("/api/classes/count", { method: "GET" }),
        fetch("/api/user/count", { method: "GET" }),
      ]);

      if (!teachersRes.ok || !classesRes.ok || !usersRes.ok) {
        throw new Error("Failed to fetch counts");
      }

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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  const cardData = [
    {
      title: "Teachers",
      count: counts.teachers,
      icon: FaChalkboardTeacher,
      gradient: "from-purple-500 to-indigo-500",
      shadowColor: "shadow-purple-500/50",
    },
    {
      title: "Classes",
      count: counts.classes,
      icon: FaSchool,
      gradient: "from-green-500 to-teal-500",
      shadowColor: "shadow-green-500/50",
    },
    {
      title: "Users",
      count: counts.users,
      icon: FaUserFriends,
      gradient: "from-pink-500 to-red-500",
      shadowColor: "shadow-pink-500/50",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((_, index) => (
          <div
            key={index}
            className="bg-gray-800 p-6 rounded-lg shadow-lg animate-pulse"
          >
            <div className="flex justify-between items-center">
              <div className="h-10 w-10 bg-gray-700 rounded-full"></div>
              <div className="h-8 w-20 bg-gray-700 rounded"></div>
            </div>
            <div className="mt-4 h-6 bg-gray-700 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cardData.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div
            key={index}
            className={`
              bg-gradient-to-r ${card.gradient} 
              p-6 rounded-2xl shadow-2xl ${card.shadowColor}
              text-center transform transition duration-500 
              hover:scale-105 hover:rotate-3 
              relative overflow-hidden
            `}
          >
            {/* Background Icon */}
            <div className="absolute -top-10 -right-10 opacity-20">
              <IconComponent className="text-8xl" />
            </div>

            {/* Card Content */}
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-4">
                <IconComponent className="text-4xl text-white" />
                <span className="text-xl font-medium text-white/70">
                  {card.title}
                </span>
              </div>

              <CountUp
                end={card.count}
                duration={1.5}
                className="text-5xl font-bold text-white block"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCards;
