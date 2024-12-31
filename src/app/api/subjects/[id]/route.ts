// src/app/api/subjects/[id]/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Handle PUT requests to update a subject
export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  const { subjectname, subjectcode } = await request.json();

  try {
    const updatedSubject = await prisma.subject.update({
      where: { id },
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

// Handle DELETE requests to delete a subject
export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json(
      { error: "Subject ID is required" },
      { status: 400 },
    );
  }

  try {
    await prisma.subject.delete({
      where: { id },
    });
    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete subject" },
      { status: 500 },
    );
  }
}
