import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Handle GET requests to fetch all classes
export async function GET() {
  try {
    const classes = await prisma.class.findMany();
    return NextResponse.json({ classes });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch classes" },
      { status: 500 },
    );
  }
}

// Handle POST requests to create a new class
export async function POST(request: Request) {
  const { classname, classcode } = await request.json();

  try {
    const newClass = await prisma.class.create({
      data: {
        classname,
        classcode,
      },
    });
    return NextResponse.json(newClass, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create class" },
      { status: 500 },
    );
  }
}
