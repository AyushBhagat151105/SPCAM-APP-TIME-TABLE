"use client";

import React, { useState } from "react";

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
  const initialData: TimetableData = {
    MONDAY: {},
    TUESDAY: {},
    WEDNESDAY: {},
    THURSDAY: {},
    FRIDAY: {},
    SATURDAY: {},
  };

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
    switch (day) {
      case "MONDAY":
        return "bg-blue-600";
      case "TUESDAY":
        return "bg-green-600";
      case "WEDNESDAY":
        return "bg-red-600";
      case "THURSDAY":
        return "bg-purple-600";
      case "FRIDAY":
        return "bg-indigo-600";
      case "SATURDAY":
        return "bg-yellow-600";
      default:
        return "bg-gray-700";
    }
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
  };

  return (
    <div className="container max-w-full sm:max-w-7xl mx-auto p-4 sm:p-6 bg-gray-900 text-gray-100 rounded-lg shadow-lg">
      <h1 className="text-center text-2xl sm:text-3xl font-bold text-orange-400 mb-4">
        Sardar Patel College of Administration & Management
      </h1>
      <h2 className="text-center text-lg sm:text-xl text-gray-300 mb-6">
        Timetable Management
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-700 bg-gray-800 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-orange-500">
              <th className="p-3 text-left text-gray-100">TIME</th>
              <th>BCA(A)-II</th>
              <th>BCA(B)-II</th>
              <th>BCA-IV</th>
              <th>BCA-VI</th>
              <th>BBA(G)-IV</th>
              <th>BBA(G)-VI</th>
              <th>BBA(ISM)-IV</th>
              <th>BBA(ISM)-VI</th>
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <React.Fragment key={day}>
                <tr>
                  <td
                    colSpan={9}
                    className={`p-3 text-center font-bold text-gray-900 ${getColorForDay(day)}`}
                  >
                    {day}
                  </td>
                </tr>
                {timeSlots.map((time) => (
                  <tr key={time} className="border-t border-gray-700">
                    <td className="p-3">{time}</td>
                    {[
                      "BCA(A)-II",
                      "BCA(B)-II",
                      "BCA-IV",
                      "BCA-VI",
                      "BBA(G)-IV",
                      "BBA(G)-VI",
                      "BBA(ISM)-IV",
                      "BBA(ISM)-VI",
                    ].map((className) => (
                      <td key={className} className="p-3 text-center">
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

      {isAdmin && (
        <>
          <div className="flex flex-wrap gap-4 mt-6">
            {["day", "time", "faculty", "subject", "lecture"].map((id) => (
              <select
                key={id}
                id={id}
                value={formData[id as keyof typeof formData]}
                onChange={handleInputChange}
                className="p-3 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 w-full sm:w-auto"
              >
                <option value="" disabled>
                  SELECT {id.toUpperCase()}
                </option>
                {id === "day" &&
                  days.map((day) => <option key={day}>{day}</option>)}
                {id === "time" &&
                  timeSlots.map((time) => <option key={time}>{time}</option>)}
                {id === "faculty" &&
                  ["JD", "AR", "VS", "SP", "CP", "KG", "JP"].map((faculty) => (
                    <option key={faculty}>{faculty}</option>
                  ))}
                {id === "subject" &&
                  [
                    "DBMS",
                    "SAD",
                    "JAVA-LAB",
                    "OPP'S",
                    "C-PROGRAMMING",
                    "WAD",
                    "CS",
                    "ITF",
                  ].map((subject) => <option key={subject}>{subject}</option>)}
                {id === "lecture" &&
                  [
                    "BCA(A)-II",
                    "BCA(B)-II",
                    "BCA-IV",
                    "BCA-VI",
                    "BBA(G)-IV",
                    "BBA(G)-VI",
                    "BBA(ISM)-IV",
                    "BBA(ISM)-VI",
                  ].map((lecture) => <option key={lecture}>{lecture}</option>)}
              </select>
            ))}
          </div>

          <button
            onClick={assignLecture}
            className="p-3 mt-6 rounded bg-orange-600 text-gray-100 hover:bg-orange-500 transition focus:outline-none focus:ring-2 focus:ring-orange-400 w-full sm:w-auto"
          >
            Assign Lecture
          </button>
        </>
      )}
    </div>
  );
};

export default TimetableManagement;
