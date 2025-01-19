"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod"; // Recommended for validation

// Validation schema
const SubjectSchema = z.object({
  subjectname: z.string().min(1, "Subject name is required"),
  subjectcode: z.string().min(1, "Subject code is required"),
  classId: z.string().optional(),
});

// Create a new subject
export async function createSubject(formData: FormData) {
  try {
    // Parse and validate input
    const validatedFields = SubjectSchema.parse({
      subjectname: formData.get("subjectname"),
      subjectcode: formData.get("subjectcode"),
      classId: formData.get("classId"),
    });

    // Create subject
    const newSubject = await prisma.subject.create({
      data: validatedFields,
    });

    // Revalidate the subjects page
    revalidatePath("/subjects");

    return {
      success: true,
      subject: newSubject,
    };
  } catch (error) {
    console.error("Subject creation error:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message),
      };
    }

    return {
      success: false,
      error: "Failed to create subject",
    };
  }
}

// Update an existing subject
export async function updateSubject(id: string, formData: FormData) {
  try {
    // Parse and validate input
    const validatedFields = SubjectSchema.parse({
      subjectname: formData.get("subjectname"),
      subjectcode: formData.get("subjectcode"),
      classId: formData.get("classId"),
    });

    // Update subject
    const updatedSubject = await prisma.subject.update({
      where: { id },
      data: validatedFields,
    });

    // Revalidate the subjects page
    revalidatePath("/subjects");

    return {
      success: true,
      subject: updatedSubject,
    };
  } catch (error) {
    console.error("Subject update error:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message),
      };
    }

    return {
      success: false,
      error: "Failed to update subject",
    };
  }
}

// Delete a subject
export async function deleteSubject(id: string) {
  try {
    // Delete the subject
    await prisma.subject.delete({
      where: { id },
    });

    // Revalidate the subjects page
    revalidatePath("/subjects");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Subject deletion error:", error);
    return {
      success: false,
      error: "Failed to delete subject",
    };
  }
}

// Fetch all subjects
export async function getSubjects() {
  try {
    // Fetch all subjects
    const subjects = await prisma.subject.findMany();
    return {
      success: true,
      subjects,
    };
  } catch (error) {
    console.error("Fetch subjects error:", error);
    return {
      success: false,
      error: "Failed to fetch subjects",
    };
  }
}

// Fetch a single subject by ID
export async function getSubjectById(id: string) {
  try {
    // Find unique subject
    const subject = await prisma.subject.findUnique({
      where: { id },
    });

    return {
      success: true,
      subject,
    };
  } catch (error) {
    console.error("Fetch subject by ID error:", error);
    return {
      success: false,
      error: "Failed to fetch subject",
    };
  }
}
