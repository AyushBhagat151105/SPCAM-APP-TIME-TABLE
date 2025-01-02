// src/app/api/update-auth-config/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { defaultRole } = await req.json();
    if (!["admin", "user"].includes(defaultRole)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const authConfigPath = path.resolve("src/lib/auth.ts");
    const newConfig = `
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { admin } from "better-auth/plugins";

const prisma = new PrismaClient();
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    admin({
      defaultRole: "${defaultRole}",
    }),
  ],
});
`;

    fs.writeFileSync(authConfigPath, newConfig);
    return NextResponse.json({ message: "Configuration updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update configuration" },
      { status: 500 },
    );
  }
}
