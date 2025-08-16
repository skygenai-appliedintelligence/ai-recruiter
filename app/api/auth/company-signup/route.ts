import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const _ = await req.json();
  // Placeholder: create company account here
  return NextResponse.json({ ok: true });
}
