import { NextResponse } from "next/server";
import { users } from "@/lib/data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address")?.trim().toLowerCase();

    if (!address) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }

    // Ensure users is a valid list
    const userList = Array.isArray(users) ? users : [];

    const user = userList.find(
      (u) => u.address?.toLowerCase() === add
