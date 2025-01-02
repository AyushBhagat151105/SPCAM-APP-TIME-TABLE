// src/app/api/streams/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { streamName, streamcode } = await req.json();
    const updatedStream = await prisma.stream.update({
      where: { id: params.id },
      data: { streamName, streamcode },
    });
    return NextResponse.json(updatedStream);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update stream" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await prisma.stream.delete({ where: { id: params.id } });
    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete stream" },
      { status: 500 },
    );
  }
}
