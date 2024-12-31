// src/app/api/teachers/count/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const count = await prisma.teacher.count();
    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch teacher count" },
      { status: 500 },
    );
  }
}
