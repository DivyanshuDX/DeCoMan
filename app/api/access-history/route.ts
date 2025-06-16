import { NextResponse } from "next/server";
import {
  accessHistory,
  accessRequests,
  accessGrants,
} from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userAddressLower = searchParams.get("userAddress")?.toLowerCase() || null;
  const organizationId = searchParams.get("organizationId") || null;

  // Build quick‑lookup sets only when the corresponding filter is supplied
  const userRequestIds = userAddressLower
    ? new Set(
        accessRequests
          .filter((r) => r.userAddress.toLowerCase() === userAddressLower)
          .map((r) => r.id),
      )
    : null;

  const userGrantIds = userAddressLower
    ? new Set(
        accessGrants
          .filter((g) => g.userAddress.toLowerCase() === userAddressLower)
          .map((g) => g.id),
      )
    : null;

  const orgRequestIds = organizationId
    ? new Set(
        accessRequests
          .filter((r) => r.organizationId === organizationId)
          .map((r) => r.id),
      )
    : null;

  const orgGrantIds = organizationId
    ? new Set(
        accessGrants
          .filter((g) => g.organizationId === organizationId)
          .map((g) => g.id),
      )
    : null;

  const filteredHistory = accessHistory.filter((h) => {
    if (userRequestIds && h.accessRequestId && !userRequestIds.has(h.accessRequestId)) return false;
    if (userGrantIds && h.accessGrantId && !userGrantIds.has(h.accessGrantId)) return false;
    if (orgRequestIds && h.accessRequestId && !orgRequestIds.has(h.accessRequestId)) return false;
    if (orgGrantIds && h.accessGrantId && !orgGrantIds.has(h.accessGrantId)) return false;
    return true;
  });

  // Sort by timestamp (newest first)
  filteredHistory.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return NextResponse.json(filteredHistory);
}
