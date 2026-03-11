import fs from "fs";
import path from "path";

const BUNDLED_CONTENT_FILE = path.join(process.cwd(), "content", "site.json");
const TMP_CONTENT_FILE = "/tmp/site-content.json";

export interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    tagline: string;
    description: string;
    image?: string;
    images?: string[];
  };
  property: {
    name: string;
    location: string;
    bedrooms: number;
    bathrooms: number;
    guests: number;
    description: string;
    highlights: string[];
  };
  about: {
    title: string;
    text: string;
    features: { icon: string; title: string; text: string }[];
  };
  gallery: {
    title: string;
    images: { src: string; alt: string }[];
  };
  contact: {
    title: string;
    text: string;
    email: string;
    phone: string;
    whatsapp: string;
  };
}

export function getContent(): SiteContent {
  // Read from /tmp first (runtime saves), fall back to bundled file
  const filePath = fs.existsSync(TMP_CONTENT_FILE)
    ? TMP_CONTENT_FILE
    : BUNDLED_CONTENT_FILE;
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

export function saveContent(content: SiteContent): void {
  const json = JSON.stringify(content, null, 2);
  // Try bundled path first, fall back to /tmp on read-only filesystems
  try {
    fs.writeFileSync(BUNDLED_CONTENT_FILE, json);
  } catch {
    fs.writeFileSync(TMP_CONTENT_FILE, json);
  }
}
