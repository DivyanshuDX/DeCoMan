import { NextResponse } from "next/server";
import { organizations } from "@/lib/data";

export async function GET() {
  try {
    // Validate organizations is an array with data
    if (!Array.isArray(organizations)) {
      return NextResponse.json(
        { error: "Invalid data format: organizations should be an array" },
        { status: 500 }
      );
    }

    // Optional: deep clone to avoid mutations externally
    const safeResponse = structuredClone(organizations);

    return NextResponse.json(safeResponse, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching organizations:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unexpected server error";

    return NextResponse.json(
      { error: `Failed to load organizations: ${errorMessage}` },
      { status: 500 }
    );
  }
}
