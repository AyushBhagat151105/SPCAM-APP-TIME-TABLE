// src/app/api/subjects/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

export async function POST(req: NextRequest) {
  try {
    const { subjectname, subjectcode } = await req.json();
    const newSubject = await prisma.subject.create({
      data: { subjectname, subjectcode },
    });
    return NextResponse.json(newSubject, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create subject" },
      { status: 500 },
    );
  }
}
