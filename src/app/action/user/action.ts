"use server";

import prisma from "@/lib/prisma";

// Fetch Users Action
export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: "user", // Adjust this condition as needed
      },
      select: {
        id: true,
        name: true,
      },
    });

    return {
      success: true,
      data: users,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      success: false,
      error: "Failed to fetch users",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Count Users Action
export async function countUsers() {
  try {
    const count = await prisma.user.count();
    return {
      success: true,
      count,
    };
  } catch (error) {
    console.error("Error fetching user count:", error);
    return {
      success: false,
      error: "Failed to fetch user count",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
