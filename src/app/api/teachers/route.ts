import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const teachers = await prisma.teacher.findMany({
      include: {
        streams: true,
        user: true,
      },
    });
    return NextResponse.json({ teachers });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch teachers" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { teachername, teachercode, userId, streamIds } = await req.json();
    const newTeacher = await prisma.teacher.create({
      data: {
        teachername,
        teachercode,
        userId,
        streams: {
          connect: streamIds.map((streamId: string) => ({ id: streamId })),
        },
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
