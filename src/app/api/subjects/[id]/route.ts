// src/app/api/subjects/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { subjectname, subjectcode } = await req.json();
    const updatedSubject = await prisma.subject.update({
      where: { id: params.id },
      data: { subjectname, subjectcode },
    });
    return NextResponse.json(updatedSubject);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update subject" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await prisma.subject.delete({ where: { id: params.id } });
    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete subject" },
      { status: 500 },
    );
  }
}
