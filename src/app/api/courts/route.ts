import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ error: "Courts API is not implemented yet" }, { status: 501 });
}
