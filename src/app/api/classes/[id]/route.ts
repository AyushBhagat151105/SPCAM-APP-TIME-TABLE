// src/app/api/classes/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { classname, classroom } = await req.json();
    const updatedClass = await prisma.class.update({
      where: { id: params.id },
      data: { classname, classroom },
    });
    return NextResponse.json(updatedClass);
  } catch (error) {
    console.error("Error updating class:", error);
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
    console.log("Deleting class with ID:", params.id);
    const deletedClass = await prisma.class.delete({
      where: { id: params.id },
    });
    console.log("Deleted class:", deletedClass);

    // Return a 204 No Content response without a body
    return new Response(null, { status: 204 }); // Correct way to return 204
  } catch (error) {
    console.error("Error deleting class:", error);
    return NextResponse.json(
      { error: "Failed to delete class" },
      { status: 500 },
    );
  }
}
