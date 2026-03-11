import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, access, constants } from "fs/promises";
import path from "path";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name) || ".jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    // Ensure uploads directory exists
    await mkdir(uploadsDir, { recursive: true });

    // Check write permission
    try {
      await access(uploadsDir, constants.W_OK);
    } catch {
      console.error("No write permission to:", uploadsDir);
      return NextResponse.json(
        { error: `Geen schrijfrechten op uploads map: ${uploadsDir}` },
        { status: 500 }
      );
    }

    const filepath = path.join(uploadsDir, filename);
    await writeFile(filepath, buffer);

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
