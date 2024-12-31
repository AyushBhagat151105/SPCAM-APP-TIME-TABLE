import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Handle PUT requests to update a class
export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  const { classname, classcode } = await request.json();

  try {
    const updatedClass = await prisma.class.update({
      where: { id },
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

// Handle DELETE requests to delete a class
export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json(
      { error: "Class ID is required" },
      { status: 400 },
    );
  }

  try {
    await prisma.class.delete({
      where: { id },
    });
    return NextResponse.json(
      { message: "Class deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete class" },
      { status: 500 },
    );
  }
}
