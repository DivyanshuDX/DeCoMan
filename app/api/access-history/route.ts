import { NextResponse } from "next/server";
import { accessHistory, accessRequests, accessGrants } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userAddr = searchParams.get("userAddress")?.toLowerCase() || null;
  const orgId = searchParams.get("organizationId") || null;

  // Pre-create Sets only if needed
  let userRequestIds: Set<string> | null = userAddr ? new Set() : null;
  let userGrantIds:   Set<string> | null = userAddr ? new Set() : null;
  let orgRequestIds:  Set<string> | null = orgId ? new Set() : null;
  let orgGrantIds:    Set<string> | null = orgId ? new Set() : null;

  // Single pass for accessRequests
  if (userRequestIds || orgRequestIds) {
    for (const r of accessRequests) {
      const rUser = userAddr && r.userAddress.toLowerCase() === userAddr;
      const rOrg  = orgId && r.organizationId === orgId;

      if (rUser && userRequestIds) userRequestIds.add(r.id);
      if (rOrg  && orgRequestIds)  orgRequestIds.add(r.id);
    }
  }

  // Single pass for accessGrants
  if (userGrantIds || orgGrantIds) {
    for (const g of accessGrants) {
      const gUser = userAddr && g.userAddress.toLowerCase() === userAddr;
      const gOrg  = orgId && g.organizationId === orgId;

      if (gUser && userGrantIds) userGrantIds.add(g.id);
      if (gOrg  && orgGrantIds)  orgGrantIds.add(g.id);
    }
  }

  return NextResponse.json({
    userRequestIds: userRequestIds ? Array.from(userRequestIds) : null,
    userGrantIds: userGrantIds ? Array.from(userGrantIds) : null,
    orgRequestIds: orgRequestIds ? Array.from(orgRequestIds) : null,
    orgGrantIds: orgGrantIds ? Array.from(orgGrantIds) : null,
  });
}
