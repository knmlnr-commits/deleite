import { NextRequest, NextResponse } from "next/server";
import { getContent, saveContent } from "@/lib/content";

export async function GET() {
  const content = getContent();
  return NextResponse.json(content);
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    saveContent(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Content save error:", message);
    return NextResponse.json(
      { error: `Opslaan mislukt: ${message}` },
      { status: 500 }
    );
  }
}
