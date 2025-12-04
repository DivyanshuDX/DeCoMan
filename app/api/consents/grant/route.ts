import { NextResponse } from "next/server";
import { grantConsent } from "@/lib/blockchain";

interface ConsentRequestBody {
  userAddress: string;
  organizationId: string;
  purposeId: string;
  expiryDate: string;
}

export async function POST(request: Request) {
  try {
    const body: Partial<ConsentRequestBody> = await request.json();
    const { userAddress, organizationId, purposeId, expiryDate } = body;

    // Validate request
    const missingFields = ["userAddress", "organizationId", "purposeId", "expiryDate"].filter(
      (field) => !body?.[field as keyof ConsentRequestBody]
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Optional expiry validation
    if (new Date(expiryDate).toString() === "Invalid Date") {
      return NextResponse.json(
        { error: "Invalid expiryDate format. Expected ISO string." },
        { status: 400 }
      );
    }

    // Simulated blockchain transaction
    const { transactionHash, consentId } = await grantConsent(
      userAddress!,
      organizationId!,
      purposeId!,
      expiryDate!
    );

    const newConsent = {
      id: consentId,
      userAddress,
      organizationId,
      purposeId,
      status: "a
