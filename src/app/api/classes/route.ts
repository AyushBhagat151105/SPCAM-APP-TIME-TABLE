// src/app/api/classes/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { classname, classroom } = await request.json();
    const newClass = await prisma.class.create({
      data: {
        classname,
        classroom,
      },
    });
    return NextResponse.json(newClass, { status: 201 });
  } catch (error) {
    console.error("Error creating class:", error);
    return NextResponse.json(
      { error: "Failed to create class" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const classes = await prisma.class.findMany();
    return NextResponse.json({ classes }, { status: 200 });
  } catch (error) {
    console.error("Error fetching classes:", error);
    return NextResponse.json(
      { error: "Failed to fetch classes" },
      { status: 500 },
    );
  }
}
