// API Route: /api/validate-address
// Validates crypto addresses for BTC, ETH, SOL

import { NextResponse } from 'next/server';
import { validateBTCAddress } from '../../../utils/validators/btcValidator';
import { validateETHAddress } from '../../../utils/validators/ethValidator';
import { validateSolAddress } from '../../../utils/validators/solValidator';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { network, address } = body;

    // Validate request body
    if (!address || typeof address !== 'string' || address.trim() === "") {
      return NextResponse.json({ valid: false, reason: "Address must not be empty." }, { status: 400 });
    }
    if (!["BTC", "ETH", "SOL"].includes(network)) {
      return NextResponse.json({ valid: false, reason: "Network must be BTC, ETH, or SOL." }, { status: 400 });
    }

    // Address validation
    switch (network) {
      case "BTC": {
        const result = validateBTCAddress(address);
        return NextResponse.json(result);
      }
      case "ETH": {
        const ethResult = validateETHAddress(address);
        return NextResponse.json(ethResult);
      }
      case "SOL": {
        const solResult = validateSolAddress(address);
        return NextResponse.json(solResult);
      }
      default:
        return NextResponse.json({valid: false,reason: " Invalid Network."}, { status: 501 });
    }

  } catch (err) {
    return NextResponse.json({ valid: false, reason: "Server error." }, { status: 500 });
  }
}
