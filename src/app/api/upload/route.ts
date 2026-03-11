import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const EXT_MAP: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

export async function POST(request: NextRequest) {
  try {
    let formData;
    try {
      formData = await request.formData();
    } catch (e) {
      console.error("FormData parse error:", e);
      return NextResponse.json(
        { error: "Kon het bestand niet verwerken. Mogelijk is het bestand te groot." },
        { status: 400 }
      );
    }

    const file = formData.get("file") as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "Geen bestand geselecteerd" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Ongeldig bestandstype: ${file.type}. Alleen JPG, PNG, WebP en GIF zijn toegestaan.` },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Bestand is te groot. Maximum is 10MB." },
        { status: 400 }
      );
    }

    // Ensure uploads directory exists
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const hash = crypto.createHash("md5").update(buffer).digest("hex").slice(0, 8);
    const ext = EXT_MAP[file.type] || ".jpg";
    const filename = `${Date.now()}-${hash}${ext}`;
    const filePath = path.join(UPLOADS_DIR, filename);

    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({ src: `/uploads/${filename}` });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Upload error:", message);
    return NextResponse.json(
      { error: `Upload mislukt: ${message}` },
      { status: 500 }
    );
  }
}
