import { NextResponse } from "next/server";
import { consentHistory, consents, purposes } from "@/lib/data";
import { getConsentFromBlockchain } from "@/lib/blockchain";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const organizationId = searchParams.get("organizationId");

  if (!organizationId) {
    return NextResponse.json(
      { error: "Organization ID is required" },
      { status: 400 }
    );
  }

  // Pre-filter consents for org once
  const orgConsents = consents.filter(
    (c) => c.organizationId === organizationId
  );
  const consentIdSet = new Set(orgConsents.map((c) => c.id));

  // Filter history using Set for O(1) contains lookup
  const orgHistory = consentHistory.filter((h) =>
    consentIdSet.has(h.consentId)
  );

  const enhancedHistory = await Promise.all(
    orgHistory.map(async (history) => {
      const consent = orgConsents.find((c) => c.id === history.consentId);
      const purpose = consent
        ? purposes.find((p) => p.id === consent.purposeId)
        : null;

      const blockchainData = await getConsentFromBlockchain(
        history.transactionHash
      );

      return {
        ...history,
        userAddress: consent?.userAddress ?? null,
        purpose: purpose
          ? { id: purpose.id, name: purpose.name }
          : null,
        blockchain: blockchainData,
      };
    })
  );

  enhancedHistory.sort(
    (a, b) =>
      new Date(b.timestamp).getTime() -
      new Date(a.timestamp).getTime()
  );

  return NextResponse.json(enhancedHistory);
}
