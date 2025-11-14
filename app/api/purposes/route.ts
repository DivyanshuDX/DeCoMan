import { NextResponse } from "next/server";
import { purposes } from "@/lib/data";

export async function GET() {
  try {
    const response = Array.isArray(purposes) ? purposes : [];

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching purposes:", error);

    return NextResponse.json(
      { error: "Failed to load purposes" },
      { status: 500 }
    );
  }
}
