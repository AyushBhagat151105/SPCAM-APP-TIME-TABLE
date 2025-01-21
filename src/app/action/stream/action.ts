// app/actions/streamActions.ts
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Create a new stream
export async function createStream(formData: FormData) {
  try {
    const streamName = formData.get("streamName") as string;
    const streamcode = formData.get("streamcode") as string;

    const newStream = await prisma.stream.create({
      data: {
        streamName,
        streamcode,
      },
    });

    revalidatePath("/streams");
    return {
      success: true,
      stream: newStream,
    };
  } catch (error) {
    console.error("Failed to create stream:", error);
    return {
      success: false,
      error: "Failed to create stream",
    };
  }
}

// Update an existing stream
export async function updateStream(id: string, formData: FormData) {
  try {
    const streamName = formData.get("streamName") as string;
    const streamcode = formData.get("streamcode") as string;

    const updatedStream = await prisma.stream.update({
      where: { id },
      data: {
        streamName,
        streamcode,
      },
    });

    revalidatePath("/streams");
    return {
      success: true,
      stream: updatedStream,
    };
  } catch (error) {
    console.error("Failed to update stream:", error);
    return {
      success: false,
      error: "Failed to update stream",
    };
  }
}

// Delete a stream
export async function deleteStream(id: string) {
  try {
    await prisma.stream.delete({
      where: { id },
    });

    revalidatePath("/streams");
    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to delete stream:", error);
    return {
      success: false,
      error: "Failed to delete stream",
    };
  }
}

// Fetch all streams
export async function getStreams() {
  try {
    const streams = await prisma.stream.findMany();
    return {
      success: true,
      streams,
    };
  } catch (error) {
    console.error("Failed to fetch streams:", error);
    return {
      success: false,
      error: "Failed to fetch streams",
    };
  }
}

// Fetch a single stream by ID
export async function getStreamById(id: string) {
  try {
    const stream = await prisma.stream.findUnique({
      where: { id },
    });

    return {
      success: true,
      stream,
    };
  } catch (error) {
    console.error("Failed to fetch stream:", error);
    return {
      success: false,
      error: "Failed to fetch stream",
    };
  }
}
