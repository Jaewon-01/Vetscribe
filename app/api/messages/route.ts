import { NextRequest, NextResponse } from "next/server";
import { getMessages, addMessageLog } from "@/lib/store";
import type { MessageLog } from "@/lib/store";

export async function GET() {
  return NextResponse.json(getMessages());
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as MessageLog;
  addMessageLog(body);
  return NextResponse.json(body, { status: 201 });
}
