"use client";
import { useEffect, useState } from "react";
import { FaChalkboardTeacher, FaUserFriends, FaSchool } from "react-icons/fa";
import CountUp from "react-countup";
import { countTeachers } from "@/app/action/teacher/action";
import { countClasses } from "@/app/action/classes/actions";
import { countUsers } from "@/app/action/user/action";

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
        countTeachers(),
        countClasses(),
        countUsers(),
      ]);

      if (teachersRes.error || classesRes.error || usersRes.error) {
        throw new Error("Failed to fetch counts");
      }

      setCounts({
        teachers: teachersRes.count ?? 0,
        classes: classesRes.count ?? 0,
        users: usersRes.count ?? 0,
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
      title: "Total Teachers",
      count: counts.teachers,
      icon: FaChalkboardTeacher,
      bgColor: "bg-gray-800",
      borderColor: "border-gray-700",
      textColor: "text-gray-100",
      iconBgColor: "bg-gray-700",
      accentColor: "text-gray-400",
      iconColor: "text-blue-400",
    },
    {
      title: "Total Classes",
      count: counts.classes,
      icon: FaSchool,
      bgColor: "bg-gray-800",
      borderColor: "border-gray-700",
      textColor: "text-gray-100",
      iconBgColor: "bg-gray-700",
      accentColor: "text-gray-400",
      iconColor: "text-green-400",
    },
    {
      title: "Total Users",
      count: counts.users,
      icon: FaUserFriends,
      bgColor: "bg-gray-800",
      borderColor: "border-gray-700",
      textColor: "text-gray-100",
      iconBgColor: "bg-gray-700",
      accentColor: "text-gray-400",
      iconColor: "text-indigo-400",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((_, index) => (
          <div
            key={index}
            className="bg-gray-800 border border-gray-700 rounded-lg shadow-md p-6 animate-pulse"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="h-10 w-10 bg-gray-700 rounded-full"></div>
              <div className="h-6 w-20 bg-gray-700 rounded"></div>
            </div>
            <div className="h-8 bg-gray-700 rounded w-full"></div>
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
              ${card.bgColor}
              ${card.borderColor}
              border
              rounded-lg
              shadow-lg
              p-6
              transform
              transition
              duration-300
              hover:shadow-xl
              hover:-translate-y-2
              relative
              overflow-hidden
            `}
          >
            <div className="flex justify-between items-center mb-4">
              <div
                className={`
                  ${card.iconBgColor}
                  ${card.iconColor}
                  p-3
                  rounded-full
                  shadow-md
                  flex
                  items-center
                  justify-center
                `}
              >
                <IconComponent className="text-2xl" />
              </div>
              <span
                className={`
                  ${card.accentColor}
                  text-sm
                  font-medium
                  uppercase
                  tracking-wider
                `}
              >
                {card.title}
              </span>
            </div>

            <CountUp
              end={card.count}
              duration={1.5}
              className={`
                ${card.textColor}
                text-3xl
                font-bold
                block
                mb-2
              `}
            />

            {/* Subtle Gradient Overlay */}
            <div
              className="
                absolute
                bottom-0
                left-0
                w-full
                h-1
                bg-gradient-to-r
                from-transparent
                via-gray-700
                to-transparent
              "
            ></div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCards;
