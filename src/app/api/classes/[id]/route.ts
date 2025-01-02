// src/app/api/classes/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { classname, classcode } = await req.json();
    const updatedClass = await prisma.class.update({
      where: { id: params.id },
      data: { classname, classcode },
    });
    return NextResponse.json(updatedClass);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update class" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await prisma.class.delete({ where: { id: params.id } });
    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete class" },
      { status: 500 },
    );
  }
}
