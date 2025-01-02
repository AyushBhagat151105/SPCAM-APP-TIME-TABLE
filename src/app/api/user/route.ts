import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: "user", // You can adjust this condition as needed
      },
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.error(); // Return an error response if fetching fails
  }
}
