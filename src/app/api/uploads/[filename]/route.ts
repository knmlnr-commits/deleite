import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const PUBLIC_UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const TMP_UPLOADS_DIR = "/tmp/uploads";

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  // Prevent path traversal
  const safe = path.basename(filename);

  // Check public/uploads first (committed files), then /tmp/uploads (runtime uploads)
  let filePath = path.join(PUBLIC_UPLOADS_DIR, safe);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(TMP_UPLOADS_DIR, safe);
  }

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Bestand niet gevonden" }, { status: 404 });
  }

  const ext = path.extname(safe).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  const buffer = fs.readFileSync(filePath);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
