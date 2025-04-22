import { NextResponse } from "next/server"
import { revokeConsent } from "@/lib/blockchain"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { consentId, userAddress } = body

    // Validate required fields
    if (!consentId || !userAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Simulate blockchain transaction
    const { transactionHash } = await revokeConsent(consentId, userAddress)

    // Update consent record (in a real app, this would update a database)
    const revokedAt = new Date().toISOString()

    return NextResponse.json({
      success: true,
      consentId,
      status: "revoked",
      revokedAt,
      transactionHash,
    })
  } catch (error) {
    console.error("Error revoking consent:", error)
    return NextResponse.json({ error: "Failed to revoke consent" }, { status: 500 })
  }
}
