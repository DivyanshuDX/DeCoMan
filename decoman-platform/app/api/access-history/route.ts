import { NextResponse } from "next/server"
import { accessHistory, accessRequests, accessGrants } from "@/lib/data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userAddress = searchParams.get("userAddress")
  const organizationId = searchParams.get("organizationId")

  let filteredHistory = [...accessHistory]

  if (userAddress) {
    // Get all requests and grants for the user
    const userRequests = accessRequests.filter(
      (request) => request.userAddress.toLowerCase() === userAddress.toLowerCase(),
    )
    const userGrants = accessGrants.filter((grant) => grant.userAddress.toLowerCase() === userAddress.toLowerCase())

    // Filter history entries for those requests and grants
    filteredHistory = filteredHistory.filter(
      (history) =>
        (history.accessRequestId && userRequests.some((req) => req.id === history.accessRequestId)) ||
        (history.accessGrantId && userGrants.some((grant) => grant.id === history.accessGrantId)),
    )
  }

  if (organizationId) {
    // Get all requests and grants for the organization
    const orgRequests = accessRequests.filter((request) => request.organizationId === organizationId)
    const orgGrants = accessGrants.filter((grant) => grant.organizationId === organizationId)

    // Filter history entries for those requests and grants
    filteredHistory = filteredHistory.filter(
      (history) =>
        (history.accessRequestId && orgRequests.some((req) => req.id === history.accessRequestId)) ||
        (history.accessGrantId && orgGrants.some((grant) => grant.id === history.accessGrantId)),
    )
  }

  // Sort by timestamp (newest first)
  filteredHistory.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  return NextResponse.json(filteredHistory)
}
