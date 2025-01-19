"use server";

import prisma from "@/lib/prisma";

export const getTimetableData = async () => {
  const timetables = await prisma.timetable.findMany({
    include: {
      subject: true,
      class: true,
      teacher: true,
    },
  });

  const timetableData = timetables.reduce(
    (acc, timetable) => {
      const { day, time, class: classData, teacher, subject } = timetable;
      if (!acc[day]) acc[day] = {};
      if (!acc[day][time]) acc[day][time] = {};
      if (!acc[day][time][classData.classname]) {
        acc[day][time][classData.classname] = {
          faculty: [],
          subject: subject.subjectname,
        };
      }
      acc[day][time][classData.classname].faculty.push(teacher.teachername);
      return acc;
    },
    {} as Record<
      string,
      Record<string, Record<string, { faculty: string[]; subject: string }>>
    >,
  );

  return timetableData;
};

export const addTimetableEntry = async (entry: {
  day: string;
  time: string;
  faculty: string;
  subject: string;
  lecture: string;
}) => {
  if (
    !entry ||
    typeof entry !== "object" ||
    !entry.day ||
    !entry.time ||
    !entry.faculty ||
    !entry.subject ||
    !entry.lecture
  ) {
    throw new Error("Invalid data provided");
  }

  const { day, time, faculty, subject, lecture } = entry;

  const teacher = await prisma.teacher.findUnique({
    where: { teachercode: faculty },
  });

  const subjectData = await prisma.subject.findUnique({
    where: { subjectcode: subject },
  });

  const classData = await prisma.class.findUnique({
    where: { classroom: lecture },
  });

  if (!teacher || !subjectData || !classData) {
    throw new Error("Invalid data provided");
  }

  await prisma.timetable.create({
    data: {
      day,
      time,
      teacherId: teacher.id,
      subjectId: subjectData.id,
      classId: classData.id,
    },
  });
};
