// src/app/api/getUserRole/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session || !session.user) {
    return NextResponse.json({ role: null }, { status: 401 });
  }

  return NextResponse.json({ role: session.user.role }, { status: 200 });
}
