// src/app/api/teachers/[id]/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Handle PUT requests to update a teacher
export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  const { teachername, teachercode } = await request.json();

  try {
    const updatedTeacher = await prisma.teacher.update({
      where: { id },
      data: { teachername, teachercode },
    });
    return NextResponse.json(updatedTeacher);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update teacher" },
      { status: 500 },
    );
  }
}

// Handle DELETE requests to delete a teacher
export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json(
      { error: "Teacher ID is required" },
      { status: 400 },
    );
  }

  try {
    await prisma.teacher.delete({
      where: { id },
    });
    return NextResponse.json(
      { message: "Teacher deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete teacher" },
      { status: 500 },
    );
  }
}
