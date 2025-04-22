import { NextResponse } from "next/server"
import { grantConsent } from "@/lib/blockchain"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userAddress, organizationId, purposeId, expiryDate } = body

    // Validate required fields
    if (!userAddress || !organizationId || !purposeId || !expiryDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Simulate blockchain transaction
    const { transactionHash, consentId } = await grantConsent(userAddress, organizationId, purposeId, expiryDate)

    // Create new consent record
    const newConsent = {
      id: consentId,
      userAddress,
      organizationId,
      purposeId,
      status: "active",
      createdAt: new Date().toISOString(),
      expiryDate,
      transactionHash,
    }

    return NextResponse.json({
      success: true,
      consent: newConsent,
      transactionHash,
    })
  } catch (error) {
    console.error("Error granting consent:", error)
    return NextResponse.json({ error: "Failed to grant consent" }, { status: 500 })
  }
}
