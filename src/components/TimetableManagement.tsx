"use client";

import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaClock, FaPlus, FaTrash } from "react-icons/fa";
import {
  getClasses,
  getFaculties,
  getSubjects,
} from "@/app/action/timetableDataActions/action";
import {
  addTimetableEntry,
  getTimetableData,
  deleteTimetableEntry,
} from "@/app/action/timetableAction/action";

interface TimetableData {
  [day: string]: {
    [time: string]: {
      [className: string]: {
        faculty: string[];
        subject: string;
        id: string;
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
  const [timetableData, setTimetableData] = useState<TimetableData>({});
  const [formData, setFormData] = useState({
    day: "",
    time: "",
    faculty: "",
    subject: "",
    lecture: "",
  });
  const [availableSubjects, setAvailableSubjects] = useState<
    { id: string; subjectname: string }[]
  >([]);
  const [classes, setClasses] = useState<{ id: string; classname: string }[]>(
    [],
  );
  const [faculties, setFaculties] = useState<
    { id: string; teachername: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [timetable, classData, facultyData] = await Promise.all([
        getTimetableData(),
        getClasses(),
        getFaculties(),
      ]);
      setTimetableData(timetable);
      setClasses(classData);
      setFaculties(facultyData);
    };
    fetchData().catch(console.error);
  }, []);

  const fetchSubjects = async (classId: string) => {
    setLoading(true);
    try {
      const subjectData = await getSubjects(classId);
      setAvailableSubjects(subjectData);
    } catch (error) {
      console.error("Failed to fetch subjects", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;
    if (id === "lecture") {
      setFormData((prev) => ({ ...prev, [id]: value, subject: "" }));
      fetchSubjects(value); // Fetch subjects related to the selected class
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const assignLecture = async () => {
    const { day, time, faculty, subject, lecture } = formData;
    if (!day || !time || !faculty || !subject || !lecture) {
      alert("Please fill all fields.");
      return;
    }

    try {
      await addTimetableEntry({ day, time, faculty, subject, lecture });
      const updatedData = await getTimetableData();
      setTimetableData(updatedData);
      setFormData({ day: "", time: "", faculty: "", subject: "", lecture: "" });
      setAvailableSubjects([]);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unknown error occurred.");
      }
    }
  };

  const deleteLecture = async (id: string) => {
    try {
      await deleteTimetableEntry(id);
      const updatedData = await getTimetableData();
      setTimetableData(updatedData);
    } catch {
      alert("Failed to delete lecture");
    }
  };

  const exportToExcel = () => {
    // Implement export to Excel logic here
  };

  const printToPDF = async () => {
    // Implement print to PDF logic here
  };

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

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen py-12 px-4">
      <div className="container max-w-full sm:max-w-7xl mx-auto">
        <div className="flex items-center justify-center mb-10">
          <FaCalendarAlt className="text-4xl text-indigo-400 mr-4" />
          <h1 className="text-4xl font-bold text-white">
            Timetable Management
          </h1>
        </div>
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
                {classes.map((cls) => (
                  <th
                    key={cls.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    {cls.classname}
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
                      {classes.map((cls) => (
                        <td
                          key={cls.id}
                          className="px-6 py-4 whitespace-nowrap text-white"
                        >
                          {timetableData[day]?.[time]?.[cls.classname] ? (
                            <div className="flex items-center justify-between">
                              <span>
                                {
                                  timetableData[day][time][cls.classname]
                                    .subject
                                }{" "}
                                (
                                {timetableData[day][time][
                                  cls.classname
                                ].faculty.join(", ")}
                                )
                              </span>
                              {isAdmin && (
                                <button
                                  onClick={() =>
                                    deleteLecture(
                                      timetableData[day][time][cls.classname]
                                        .id,
                                    )
                                  }
                                  className="text-red-500 hover:text-red-600 ml-4"
                                >
                                  <FaTrash />
                                </button>
                              )}
                            </div>
                          ) : (
                            "-"
                          )}
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
                      className="p-3 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
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
                          <option key={faculty.id} value={faculty.id}>
                            {faculty.teachername}
                          </option>
                        ))}
                      {id === "lecture" &&
                        classes.map((cls) => (
                          <option key={cls.id} value={cls.id}>
                            {cls.classname}
                          </option>
                        ))}
                      {id === "subject" &&
                        availableSubjects.map((subject) => (
                          <option key={subject.id} value={subject.id}>
                            {subject.subjectname}
                          </option>
                        ))}
                    </select>
                  </div>
                ),
              )}
            </div>
            {loading && <p className="text-white">Loading subjects...</p>}
            <button
              onClick={assignLecture}
              className="p-3 mt-6 rounded bg-orange-600 text-gray-100 hover:bg-orange-500 transition focus:outline-none focus:ring-2 focus:ring-orange-400 w-full"
            >
              Assign Lecture
            </button>
            <div className="export-buttons mt-4">
              <button
                onClick={exportToExcel}
                className="p-3 rounded bg-blue-600 text-gray-100 hover:bg-blue-500 transition focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
              >
                Export to Excel
              </button>
              <button
                onClick={printToPDF}
                className="p-3 mt-2 rounded bg-green-600 text-gray-100 hover:bg-green-500 transition focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
              >
                Print to PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimetableManagement;
