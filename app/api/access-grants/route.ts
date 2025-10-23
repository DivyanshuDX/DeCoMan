import { accessGrants, organizations } from "@/lib/data";
import { NextResponse } from "next/server";

// ♻️ Precompute map ONCE (module scoped — not per-request)
const orgMap = new Map(
  organizations.map((org) => [org.id, { id: org.id, name: org.name }])
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userAddressParam = searchParams.get("userAddress");
  const organizationIdParam = searchParams.get("organizationId");

  // Lowercase only once for comparison
  const normalizedUser = userAddressParam?.toLowerCase();

  // Single pass: filter + enrich
  const result = [];
  for (const grant of accessGrants) {
    if (
      (normalizedUser ? grant.userAddress.toLowerCase() === normalizedUser : true) &&
      (organizationIdParam ? grant.organizationId === organizationIdParam : true)
    ) {
      result.push({
        ...grant,
        organization: orgMap.get(grant.organizationId) ?? null,
      });
    }
  }

  return NextResponse.json({
    count: result.length,
    data: result,
  });
}
