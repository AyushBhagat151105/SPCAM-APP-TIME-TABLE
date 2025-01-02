// src/app/api/streams/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const streams = await prisma.stream.findMany();
    return NextResponse.json({ streams });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch streams" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { streamName, streamcode } = await req.json();
    const newStream = await prisma.stream.create({
      data: { streamName, streamcode },
    });
    return NextResponse.json(newStream, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create stream" },
      { status: 500 },
    );
  }
}
