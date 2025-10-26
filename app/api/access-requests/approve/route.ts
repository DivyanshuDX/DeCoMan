import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const body: {
      requestId?: string;
      userAddress?: string;
      grantedFields?: any;
    } = await request.json();

    const { requestId, userAddress } = body;

    if (!requestId || !userAddress) {
      return NextResponse.json(
        { error: "Missing required fields: requestId or userAddress" },
        { status: 400 }
      );
    }

    // Simulated blockchain transaction and grant creation
    const grantId = uuidv4();
    const transactionHash = `0x${uuidv4().replace(/-/g, "")}`;

    return NextResponse.json({ success: true, grantId, transactionHash });
  } catch (error) {
    console.error("Failed to approve request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
