"use client";

import React, { useState } from "react";
import { FaCalendarAlt, FaClock, FaPlus } from "react-icons/fa";

interface TimetableData {
  [day: string]: {
    [time: string]: {
      [className: string]: {
        faculty: string;
        subject: string;
      };
    };
  };
}

interface TimetableManagementProps {
  isAdmin: boolean;
}

const TimetableManagement: React.FC<TimetableManagementProps> = ({
  isAdmin,
}) => {
  const days = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];
  const timeSlots = [
    "09:30 TO 10:25",
    "10:25 TO 11:20",
    "11:20 TO 12:15",
    "12:50 TO 01:45",
    "01:45 TO 02:40",
    "02:40 TO 03:35",
  ];
  const classes = [
    "BCA(A)-II",
    "BCA(B)-II",
    "BCA-IV",
    "BCA-VI",
    "BBA(G)-IV",
    "BBA(G)-VI",
    "BBA(ISM)-IV",
    "BBA(ISM)-VI",
  ];
  const faculties = ["JD", "AR", "VS", "SP", "CP", "KG", "JP"];
  const subjects = [
    "DBMS",
    "SAD",
    "JAVA-LAB",
    "OPP'S",
    "C-PROGRAMMING",
    "WAD",
    "CS",
    "ITF",
  ];

  const initialData: TimetableData = days.reduce((acc, day) => {
    acc[day] = {};
    return acc;
  }, {} as TimetableData);

  const [timetableData, setTimetableData] =
    useState<TimetableData>(initialData);
  const [formData, setFormData] = useState({
    day: "",
    time: "",
    faculty: "",
    subject: "",
    lecture: "",
  });

  const getColorForDay = (day: string): string => {
    const colors = {
      MONDAY: "bg-blue-600",
      TUESDAY: "bg-green-600",
      WEDNESDAY: "bg-red-600",
      THURSDAY: "bg-purple-600",
      FRIDAY: "bg-indigo-600",
      SATURDAY: "bg-yellow-600",
    };
    return colors[day as keyof typeof colors] || "bg-gray-700";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const assignLecture = () => {
    const { day, time, faculty, subject, lecture } = formData;

    if (!day || !time || !faculty || !subject || !lecture) {
      alert("Please fill all fields.");
      return;
    }

    const updatedData = { ...timetableData };

    if (!updatedData[day]?.[time]) {
      updatedData[day][time] = {};
    }

    for (const className in updatedData[day][time]) {
      if (updatedData[day][time][className]?.faculty === faculty) {
        alert("Faculty cannot take their own lecture during this time slot.");
        return;
      }
    }

    updatedData[day][time][lecture] = { faculty, subject };
    setTimetableData(updatedData);

    // Reset form after assignment
    setFormData({
      day: "",
      time: "",
      faculty: "",
      subject: "",
      lecture: "",
    });
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen py-12 px-4">
      <div className="container max-w-full sm:max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center mb-10">
          <FaCalendarAlt className="text-4xl text-indigo-400 mr-4" />
          <h1 className="text-4xl font-bold text-white">
            Timetable Management
          </h1>
        </div>

        {/* Timetable */}
        <div className="bg-gray-800 shadow-xl rounded-lg overflow-x-auto mb-10">
          <div className="px-6 py-4 bg-gray-700">
            <h2 className="text-2xl font-semibold text-white flex items-center">
              <FaClock className="mr-3 text-indigo-400" />
              College Timetable
            </h2>
          </div>

          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  TIME
                </th>
                {classes.map((className) => (
                  <th
                    key={className}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    {className}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((day) => (
                <React.Fragment key={day}>
                  <tr>
                    <td
                      colSpan={classes.length + 1}
                      className={`p-3 text-center font-bold text-white ${getColorForDay(day)}`}
                    >
                      {day}
                    </td>
                  </tr>
                  {timeSlots.map((time) => (
                    <tr key={time} className="border-t border-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-white">
                        {time}
                      </td>
                      {classes.map((className) => (
                        <td
                          key={className}
                          className="px-6 py-4 whitespace-nowrap text-white"
                        >
                          {timetableData[day]?.[time]?.[className]
                            ? `${timetableData[day][time][className].subject} (${timetableData[day][time][className].faculty})`
                            : "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Admin Controls */}
        {isAdmin && (
          <div className="bg-gray-800 shadow-xl rounded-lg p-8">
            <div className="flex items-center mb-6">
              <FaPlus className="text-2xl text-indigo-400 mr-3" />
              <h2 className="text-2xl font-semibold text-white">
                Assign Lecture
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {(["day", "time", "faculty", "subject", "lecture"] as const).map(
                (id) => (
                  <div key={id} className="relative">
                    <select
                      id={id}
                      value={formData[id]}
                      onChange={handleInputChange}
                      className=" p-3 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                    >
                      <option value="" disabled>
                        SELECT {id.toUpperCase()}
                      </option>
                      {id === "day" &&
                        days.map((day) => <option key={day}>{day}</option>)}
                      {id === "time" &&
                        timeSlots.map((time) => (
                          <option key={time}>{time}</option>
                        ))}
                      {id === "faculty" &&
                        faculties.map((faculty) => (
                          <option key={faculty}>{faculty}</option>
                        ))}
                      {id === "subject" &&
                        subjects.map((subject) => (
                          <option key={subject}>{subject}</option>
                        ))}
                      {id === "lecture" &&
                        classes.map((lecture) => (
                          <option key={lecture}>{lecture}</option>
                        ))}
                    </select>
                  </div>
                ),
              )}
            </div>

            <button
              onClick={assignLecture}
              className="p-3 mt-6 rounded bg-orange-600 text-gray-100 hover:bg-orange-500 transition focus:outline-none focus:ring-2 focus:ring-orange-400 w-full"
            >
              Assign Lecture
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimetableManagement;
