import { NextRequest, NextResponse } from "next/server";
import { getPatients, setPatients } from "@/lib/store";
import type { MockPatient } from "@/lib/mockData";

export async function GET() {
  return NextResponse.json(getPatients());
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as MockPatient;
  const patients = getPatients();
  setPatients([body, ...patients]);
  return NextResponse.json(body, { status: 201 });
}
