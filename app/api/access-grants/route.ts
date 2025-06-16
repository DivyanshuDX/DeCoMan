import { accessGrants, organizations } from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userAddressParam = searchParams.get("userAddress");
  const organizationIdParam = searchParams.get("organizationId");

  // Normalize once to avoid repeated lower‑casing inside the filter loop
  const userAddressLower = userAddressParam?.toLowerCase();

  // Build an O(1) lookup for organization details instead of O(n) searches per grant
  const orgMap = new Map(
    organizations.map((org) => [org.id, { id: org.id, name: org.name }])
  );

  const enhancedGrants = accessGrants
    .filter((grant) => {
      if (userAddressLower && grant.userAddress.toLowerCase() !== userAddressLower) {
        return false;
      }
      if (organizationIdParam && grant.organizationId !== organizationIdParam) {
        return false;
      }
      return true;
    })
    .map((grant) => ({
      ...grant,
      organization: orgMap.get(grant.organizationId) ?? null,
    }));

  return NextResponse.json(enhancedGrants);
}

