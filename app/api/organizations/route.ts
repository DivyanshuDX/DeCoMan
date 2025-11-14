import { NextResponse } from "next/server";
import { organizations } from "@/lib/data";

export async function GET() {
  try {
    // Ensure we never mutate the original data
    const response = Array.isArray(organizations)
      ? organizations
      : [];

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching organizations:", error);

    return NextResponse.json(
      { error: "Failed to load organizations" },
      { status: 500 }
    );
  }
}
