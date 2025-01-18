"use client";

import React, { useState } from "react";
import { FaCalendarAlt, FaClock, FaPlus } from "react-icons/fa";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

interface SubjectMap {
  BCA: Record<string, string[]>;
  BBA: Record<string, string[]>;
}

interface TimetableData {
  [day: string]: {
    [time: string]: {
      [className: string]: {
        faculty: string[];
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
  // Comprehensive subject map
  const subjectMap: SubjectMap = {
    BCA: {
      "BCA(A)-II": [
        "OOP",
        "OS",
        "DBMS",
        "DBMS(II)",
        "SPM",
        "SAD",
        "IPD",
        "DBMS-LAB",
      ],
      "BCA(B)-II": [
        "OOP",
        "OS",
        "DBMS",
        "DBMS(II)",
        "SPM",
        "SAD",
        "IPD",
        "DBMS-LAB",
      ],
      "BCA-IV": [
        "Advanced JAVA",
        "Software Engineering",
        "Data Mining",
        "Network Security",
        "Cloud Computing",
      ],
      "BCA-VI": [
        "Machine Learning",
        "Artificial Intelligence",
        "Blockchain",
        "IoT",
        "Big Data",
      ],
    },
    BBA: {
      "BBA(G)-IV": [
        "Management",
        "Accounting",
        "Business Law",
        "Economics",
        "Marketing",
      ],
      "BBA(G)-VI": [
        "Strategic Management",
        "Financial Management",
        "International Business",
        "HR Management",
      ],
      "BBA(ISM)-IV": [
        "Industrial Management",
        "Supply Chain",
        "Operations Research",
        "Project Management",
      ],
      "BBA(ISM)-VI": [
        "Entrepreneurship",
        "Business Analytics",
        "Corporate Governance",
        "Digital Marketing",
      ],
    },
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

  const faculties = [
    "CP",
    "JD",
    "BP",
    "NN",
    "DK",
    "SP",
    "RR",
    "KG",
    "JT",
    "RP",
    "ST",
    "ND",
  ];

  // Get color for day based on name
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

  // Initialize timetable data
  const initialData: TimetableData = days.reduce((acc, day) => {
    acc[day] = {};
    return acc;
  }, {} as TimetableData);

  // State management
  const [timetableData, setTimetableData] =
    useState<TimetableData>(initialData);
  const [formData, setFormData] = useState({
    day: "",
    time: "",
    faculty: "",
    subject: "",
    lecture: "",
  });
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);

  // Filter subjects based on selected lecture
  const filterSubjects = (lecture: string) => {
    if (lecture.startsWith("BCA")) {
      const subjects = subjectMap.BCA[lecture] || [];
      setAvailableSubjects(subjects);
    } else if (lecture.startsWith("BBA")) {
      const subjects = subjectMap.BBA[lecture] || [];
      setAvailableSubjects(subjects);
    } else {
      setAvailableSubjects([]);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;

    // Special handling for lecture to filter subjects
    if (id === "lecture") {
      setFormData((prev) => ({ ...prev, [id]: value, subject: "" }));
      filterSubjects(value);
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  // Assign lecture to timetable
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

    // Check for faculty conflicts
    for (const className in updatedData[day][time]) {
      if (updatedData[day][time][className]?.faculty.includes(faculty)) {
        alert(
          "Faculty is already assigned to another class in this time slot.",
        );
        return;
      }
    }

    // Assign lecture
    updatedData[day][time][lecture] = { faculty: [faculty], subject };
    setTimetableData(updatedData);

    // Reset form
    setFormData({
      day: "",
      time: "",
      faculty: "",
      subject: "",
      lecture: "",
    });
    setAvailableSubjects([]);
  };

  // Export to Excel functionality
  const exportToExcel = () => {
    try {
      const worksheetData: string[][] = [
        ["Time", ...classes],
        ...days.flatMap((day) =>
          timeSlots.map((time) => [
            time,
            ...classes.map((className) =>
              timetableData[day]?.[time]?.[className]
                ? `${timetableData[day][time][className].subject} (${timetableData[day][time][className].faculty.join(", ")})`
                : "-",
            ),
          ]),
        ),
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Timetable");
      XLSX.writeFile(workbook, "Timetable.xlsx");
    } catch (error) {
      console.error("Excel Export Error:", error);
      alert("Failed to export timetable to Excel");
    }
  };

  // Print to PDF functionality
  const printToPDF = async () => {
    try {
      const table = document.querySelector("table");

      if (!table) {
        alert("Table not found");
        return;
      }

      const canvas = await html2canvas(table, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const pdf = new jsPDF("l", "mm", "a4");
      const imgData = canvas.toDataURL("image/png");
      const imgProps = pdf.getImageProperties(imgData);

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("Timetable.pdf");
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("Failed to generate PDF");
    }
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
                            ? `${timetableData[day][time][className].subject} (${timetableData[day][time][className].faculty.join(", ")})`
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
                          <option key={faculty}>{faculty}</option>
                        ))}
                      {id === "lecture" &&
                        classes.map((lecture) => (
                          <option key={lecture}>{lecture}</option>
                        ))}
                      {id === "subject" &&
                        availableSubjects.map((subject) => (
                          <option key={subject}>{subject}</option>
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
