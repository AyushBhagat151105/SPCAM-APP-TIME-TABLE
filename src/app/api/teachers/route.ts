// src/app/api/teachers/route.ts

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Handle GET requests to fetch all teachers
export async function GET() {
  try {
    const teachers = await prisma.teacher.findMany();
    return NextResponse.json({ teachers });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch teachers" },
      { status: 500 },
    );
  }
}

// Handle POST requests to create a new teacher
export async function POST(request: Request) {
  const { teachername, teachercode } = await request.json();

  try {
    const newTeacher = await prisma.teacher.create({
      data: {
        teachername,
        teachercode,
      },
    });
    return NextResponse.json(newTeacher, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create teacher" },
      { status: 500 },
    );
  }
}
