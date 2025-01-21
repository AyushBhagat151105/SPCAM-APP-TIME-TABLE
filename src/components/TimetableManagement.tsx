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
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import "jspdf-autotable";

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

  const days = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];

  const printToPDF = async () => {
    try {
      const pdfDoc = await PDFDocument.create();
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

      const title = "SPCAM Class Schedule";

      // Define consistent styling
      const COLORS = {
        BACKGROUND: rgb(0.95, 0.95, 0.95),
        TEXT: rgb(0, 0, 0),
        HEADER_BACKGROUND: rgb(0.8, 0.8, 0.8),
        CELL_BACKGROUND: rgb(0.9, 0.9, 0.9),
      };

      const SIZES = {
        MARGIN: 40,
        TITLE_FONT_SIZE: 18,
        HEADER_FONT_SIZE: 12,
        CELL_FONT_SIZE: 10,
        ROW_HEIGHT: 30,
        CELL_PADDING: 5,
      };

      // Create multiple pages if needed
      const createPage = (pdfDoc: PDFDocument) => {
        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        return { page, width, height };
      };

      let { page, width, height } = createPage(pdfDoc);
      let currentY = height - SIZES.MARGIN;

      // Title rendering
      const drawTitle = () => {
        const titleWidth = timesRomanFont.widthOfTextAtSize(
          title,
          SIZES.TITLE_FONT_SIZE,
        );
        page.drawText(title, {
          x: (width - titleWidth) / 2,
          y: currentY,
          size: SIZES.TITLE_FONT_SIZE,
          font: timesRomanFont,
          color: COLORS.TEXT,
        });
        currentY -= SIZES.TITLE_FONT_SIZE + SIZES.MARGIN / 2;
      };

      // Calculate column widths
      const calculateColumnWidths = () => {
        const totalColumns = classes.length + 1;
        const cellWidth = (width - 2 * SIZES.MARGIN) / totalColumns;
        return { cellWidth, totalColumns };
      };

      // Draw table headers
      const drawTableHeaders = (cellWidth: number) => {
        const columns = ["TIME", ...classes.map((cls) => cls.classname)];

        columns.forEach((col, index) => {
          const headerX = SIZES.MARGIN + index * cellWidth;

          // Header background
          page.drawRectangle({
            x: headerX,
            y: currentY - SIZES.ROW_HEIGHT,
            width: cellWidth,
            height: SIZES.ROW_HEIGHT,
            color: COLORS.HEADER_BACKGROUND,
          });

          // Header text
          page.drawText(col, {
            x: headerX + SIZES.CELL_PADDING,
            y: currentY - SIZES.ROW_HEIGHT + SIZES.CELL_PADDING,
            size: SIZES.HEADER_FONT_SIZE,
            font: timesRomanFont,
            color: COLORS.TEXT,
          });
        });

        currentY -= SIZES.ROW_HEIGHT + SIZES.CELL_PADDING;
      };

      // Draw day rows
      const drawDayRows = (cellWidth: number) => {
        days.forEach((day) => {
          // Day row background
          page.drawRectangle({
            x: SIZES.MARGIN,
            y: currentY - SIZES.ROW_HEIGHT,
            width: width - 2 * SIZES.MARGIN,
            height: SIZES.ROW_HEIGHT,
            color: COLORS.HEADER_BACKGROUND,
          });

          // Day text
          const dayWidth = timesRomanFont.widthOfTextAtSize(
            day,
            SIZES.HEADER_FONT_SIZE,
          );
          page.drawText(day, {
            x: (width - dayWidth) / 2,
            y: currentY - SIZES.ROW_HEIGHT + SIZES.CELL_PADDING,
            size: SIZES.HEADER_FONT_SIZE,
            font: timesRomanFont,
            color: COLORS.TEXT,
          });

          currentY -= SIZES.ROW_HEIGHT + SIZES.CELL_PADDING;

          // Time slots rendering
          timeSlots.forEach((time) => {
            const columns = ["TIME", ...classes.map((cls) => cls.classname)];

            columns.forEach((col, colIndex) => {
              const cellX = SIZES.MARGIN + colIndex * cellWidth;

              // Cell background
              page.drawRectangle({
                x: cellX,
                y: currentY - SIZES.ROW_HEIGHT,
                width: cellWidth,
                height: SIZES.ROW_HEIGHT,
                color:
                  colIndex % 2 === 0
                    ? COLORS.BACKGROUND
                    : COLORS.CELL_BACKGROUND,
              });

              // Cell content
              const cellText =
                colIndex === 0
                  ? time
                  : formatCellContent(timetableData, day, time, col);

              page.drawText(cellText, {
                x: cellX + SIZES.CELL_PADDING,
                y: currentY - SIZES.ROW_HEIGHT + SIZES.CELL_PADDING,
                size: SIZES.CELL_FONT_SIZE,
                font: timesRomanFont,
                color: COLORS.TEXT,
              });
            });

            currentY -= SIZES.ROW_HEIGHT;

            // Create new page if space is exhausted
            if (currentY < SIZES.MARGIN) {
              ({ page, width, height } = createPage(pdfDoc));
              currentY = height - SIZES.MARGIN;
              drawTitle();
              const { cellWidth } = calculateColumnWidths();
              drawTableHeaders(cellWidth);
            }
          });
        });
      };

      // Main PDF generation flow
      drawTitle();
      const { cellWidth } = calculateColumnWidths();
      drawTableHeaders(cellWidth);
      drawDayRows(cellWidth);

      // Save and download PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Class_Schedule.pdf";
      link.click();
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  // Helper function for cell content
  const formatCellContent = (
    timetableData: TimetableData,
    day: string,
    time: string,
    className: string,
  ) => {
    const entry = timetableData[day]?.[time]?.[className];
    return entry ? `${entry.subject} (${entry.faculty.join(", ")})` : "-";
  };

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
        <div
          id="timetable"
          className="bg-gray-800 shadow-xl rounded-lg overflow-x-auto mb-10"
        >
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
