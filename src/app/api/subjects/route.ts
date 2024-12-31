// src/app/api/subjects/route.ts

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Handle GET requests to fetch all subjects
export async function GET() {
  try {
    const subjects = await prisma.subject.findMany();
    return NextResponse.json({ subjects });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch subjects" },
      { status: 500 },
    );
  }
}

// Handle POST requests to create a new subject
export async function POST(request: Request) {
  const { subjectname, subjectcode } = await request.json();

  try {
    const newSubject = await prisma.subject.create({
      data: {
        subjectname,
        subjectcode,
      },
    });
    return NextResponse.json(newSubject, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create subject" },
      { status: 500 },
    );
  }
}
