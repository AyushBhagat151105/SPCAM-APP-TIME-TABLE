"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validation Schema
const ClassSchema = z.object({
  classname: z.string().min(2, "Class name must be at least 2 characters"),
  classroom: z.string().min(1, "Classroom is required"),
});

// Create Class Action
export async function createClass(formData: FormData) {
  try {
    const validatedData = ClassSchema.parse({
      classname: formData.get("classname"),
      classroom: formData.get("classroom"),
    });

    const newClass = await prisma.class.create({
      data: validatedData,
    });

    revalidatePath("/classes");
    return {
      success: true,
      message: "Class created successfully",
      class: newClass,
    };
  } catch (error) {
    console.error("Error creating class:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors[0].message,
      };
    }

    return {
      success: false,
      message: "Failed to create class",
    };
  }
}

// Update Class Action
export async function updateClass(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const validatedData = ClassSchema.parse({
      classname: formData.get("classname"),
      classroom: formData.get("classroom"),
    });

    const updatedClass = await prisma.class.update({
      where: { id },
      data: validatedData,
    });

    revalidatePath("/classes");
    return {
      success: true,
      message: "Class updated successfully",
      class: updatedClass,
    };
  } catch (error) {
    console.error("Error updating class:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors[0].message,
      };
    }

    return {
      success: false,
      message: "Failed to update class",
    };
  }
}

// Delete Class Action
export async function deleteClass(id: string) {
  try {
    await prisma.class.delete({
      where: { id },
    });

    revalidatePath("/classes");
    return {
      success: true,
      message: "Class deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting class:", error);
    return {
      success: false,
      message: "Failed to delete class",
    };
  }
}

// Fetch Classes Action
export async function fetchClasses() {
  try {
    return await prisma.class.findMany({
      orderBy: {
        classname: "asc",
      },
    });
  } catch (error) {
    console.error("Error fetching classes:", error);
    return [];
  }
}

// Count Classes Action
export async function countClasses() {
  try {
    const count = await prisma.class.count();
    return { count };
  } catch (error) {
    console.error("Error fetching class count:", error);
    return { error: "Failed to fetch class count" };
  }
}
export async function getClasses() {
  try {
    const classes = await prisma.class.findMany();
    return {
      success: true,
      classes,
    };
  } catch (error) {
    console.error("Fetch classes error:", error);
    return {
      success: false,
      error: "Failed to fetch classes",
    };
  }
}
