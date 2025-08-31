import { accessGrants, organizations } from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userAddress = searchParams.get("userAddress")?.toLowerCase();
  const organizationId = searchParams.get("organizationId");

  // Preprocess organizations into a Map for O(1) lookup
  const orgMap = new Map(
    organizations.map((org) => [org.id, { id: org.id, name: org.name }])
  );

  // Filter accessGrants based on query parameters
  const filteredGrants = accessGrants.filter(({ userAddress: ua, organizationId: oid }) => {
    const matchesUser = !userAddress || ua.toLowerCase() === userAddress;
    const matchesOrg = !organizationId || oid === organizationId;
    return matchesUser && matchesOrg;
  });

  // Attach organization metadata to each grant
  const enrichedGrants = filteredGrants.map((grant) => ({
    ...grant,
    organization: orgMap.get(grant.organizationId) || null,
  }));

  return NextResponse.json({
    count: enrichedGrants.length,
    data: enrichedGrants,
  });
}
