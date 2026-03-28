import { NextResponse } from "next/server";

import { readProviderSummary } from "@/lib/runtime-config";

export async function GET() {
  return NextResponse.json(await readProviderSummary());
}
