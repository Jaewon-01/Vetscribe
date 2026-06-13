import { NextRequest, NextResponse } from "next/server";
import { getPatients, setPatients } from "@/lib/store";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const patients = getPatients();
  const updated = patients.map((p) => (p.id === id ? { ...p, ...body } : p));
  setPatients(updated);
  return NextResponse.json(updated.find((p) => p.id === id) ?? null);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const patients = getPatients();
  setPatients(patients.filter((p) => p.id !== id));
  return NextResponse.json({ ok: true });
}
