// src/app/api/teachers/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { teachername, teachercode, userId, streamIds } = await req.json();
    const updatedTeacher = await prisma.teacher.update({
      where: { id: params.id },
      data: {
        teachername,
        teachercode,
        userId,
        streams: {
          set: streamIds.map((streamId: string) => ({ id: streamId })),
        },
      },
      include: {
        streams: true,
      },
    });
    return NextResponse.json(updatedTeacher);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update teacher" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    await prisma.teacher.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting teacher:", error);
    return NextResponse.json(
      { error: "Failed to delete teacher" },
      { status: 500 },
    );
  }
}
