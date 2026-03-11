import { NextRequest, NextResponse } from "next/server";
import { getContent, saveContent } from "@/lib/content";

export async function GET() {
  const content = getContent();
  return NextResponse.json(content);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  saveContent(body);
  return NextResponse.json({ success: true });
}
