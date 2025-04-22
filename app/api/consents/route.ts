import { NextResponse } from "next/server"
import { consents, organizations, purposes } from "@/lib/data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userAddress = searchParams.get("userAddress")
  const organizationId = searchParams.get("organizationId")

  let filteredConsents = [...consents]

  if (userAddress) {
    filteredConsents = filteredConsents.filter(
      (consent) => consent.userAddress.toLowerCase() === userAddress.toLowerCase(),
    )
  }

  if (organizationId) {
    filteredConsents = filteredConsents.filter((consent) => consent.organizationId === organizationId)
  }

  // Enhance consents with organization and purpose details
  const enhancedConsents = filteredConsents.map((consent) => {
    const organization = organizations.find((org) => org.id === consent.organizationId)
    const purpose = purposes.find((p) => p.id === consent.purposeId)

    return {
      ...consent,
      organization: organization ? { id: organization.id, name: organization.name } : null,
      purpose: purpose ? { id: purpose.id, name: purpose.name } : null,
    }
  })

  return NextResponse.json(enhancedConsents)
}
