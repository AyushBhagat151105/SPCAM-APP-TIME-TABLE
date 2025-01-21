"use server";

import prisma from "@/lib/prisma";

export const getClasses = async () => {
  return prisma.class.findMany({
    orderBy: { classname: "asc" },
  });
};

export const getFaculties = async () => {
  return prisma.teacher.findMany({
    orderBy: { teachername: "asc" },
  });
};

export const getSubjects = async (classId: string) => {
  return prisma.subject.findMany({
    where: { classId: classId },
  });
};
