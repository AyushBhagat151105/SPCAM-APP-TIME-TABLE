"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Type definitions
interface TeacherData {
  teachername: string;
  teachercode: string;
  userId: string;
  streamIds: string[];
}

// Create Teacher Action
export async function createTeacher(data: TeacherData) {
  try {
    const newTeacher = await prisma.teacher.create({
      data: {
        teachername: data.teachername,
        teachercode: data.teachercode,
        userId: data.userId,
        streams: {
          connect: data.streamIds.map((streamId) => ({ id: streamId })),
        },
      },
    });

    revalidatePath("/teachers");
    return {
      success: true,
      data: newTeacher,
      message: "Teacher created successfully",
    };
  } catch (error) {
    console.error("Create Teacher Error:", error);
    return {
      success: false,
      error: "Failed to create teacher",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Update Teacher Action
export async function updateTeacher(id: string, data: TeacherData) {
  try {
    const updatedTeacher = await prisma.teacher.update({
      where: { id },
      data: {
        teachername: data.teachername,
        teachercode: data.teachercode,
        userId: data.userId,
        streams: {
          set: data.streamIds.map((streamId) => ({ id: streamId })),
        },
      },
      include: {
        streams: true,
      },
    });

    revalidatePath("/teachers");
    return {
      success: true,
      data: updatedTeacher,
      message: "Teacher updated successfully",
    };
  } catch (error) {
    console.error("Update Teacher Error:", error);
    return {
      success: false,
      error: "Failed to update teacher",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Delete Teacher Action
export async function deleteTeacher(id: string) {
  try {
    await prisma.teacher.delete({
      where: { id },
    });

    revalidatePath("/teachers");
    return {
      success: true,
      message: "Teacher deleted successfully",
    };
  } catch (error) {
    console.error("Delete Teacher Error:", error);
    return {
      success: false,
      error: "Failed to delete teacher",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Get All Teachers Action
export async function getAllTeachers() {
  try {
    const teachers = await prisma.teacher.findMany({
      include: {
        streams: true,
        user: true,
      },
    });

    return {
      success: true,
      data: teachers,
    };
  } catch (error) {
    console.error("Get Teachers Error:", error);
    return {
      success: false,
      error: "Failed to fetch teachers",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Get Single Teacher Action
export async function getTeacherById(id: string) {
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: {
        streams: true,
        user: true,
      },
    });

    if (!teacher) {
      return {
        success: false,
        error: "Teacher not found",
      };
    }

    return {
      success: true,
      data: teacher,
    };
  } catch (error) {
    console.error("Get Teacher Error:", error);
    return {
      success: false,
      error: "Failed to fetch teacher",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Count Teachers Action
export async function countTeachers() {
  try {
    const count = await prisma.teacher.count();
    return { count };
  } catch (error) {
    console.error("Error fetching teacher count:", error);
    return { error: "Failed to fetch teacher count" };
  }
}
