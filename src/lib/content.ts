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

function getContentPath(): string {
  // Use /tmp copy if it exists (previously saved), otherwise use bundled file
  if (fs.existsSync(TMP_CONTENT_FILE)) {
    return TMP_CONTENT_FILE;
  }
  return BUNDLED_CONTENT_FILE;
}

export function getContent(): SiteContent {
  const raw = fs.readFileSync(getContentPath(), "utf-8");
  return JSON.parse(raw);
}

export function saveContent(content: SiteContent): void {
  // Always write to /tmp since the bundled path is likely read-only
  fs.writeFileSync(TMP_CONTENT_FILE, JSON.stringify(content, null, 2));
}
