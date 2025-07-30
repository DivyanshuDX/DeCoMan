import { NextResponse } from "next/server";
import { accessHistory, accessRequests, accessGrants } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userAddress = searchParams.get("userAddress")?.toLowerCase();
  const organizationId = searchParams.get("organizationId");

  let userRequestIds: Set<string> | null = null;
  let userGrantIds: Set<string> | null = null;
  let orgRequestIds: Set<string> | null = null;
  let orgGrantIds: Set<string> | null = null;

  if (userAddress) {
    userRequestIds = new Set(
      accessRequests
        .filter((r) => r.userAddress.toLowerCase() === userAddress)
        .map((r) => r.id)
    );

    userGrantIds = new Set(
      accessGrants
        .filter((g) => g.userAddress.toLowerCase() === userAddress)
        .map((g) => g.id)
    );
  }
