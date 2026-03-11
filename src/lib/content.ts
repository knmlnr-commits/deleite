import fs from "fs";
import path from "path";

const CONTENT_FILE = path.join(process.cwd(), "content", "site.json");

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
  const raw = fs.readFileSync(CONTENT_FILE, "utf-8");
  return JSON.parse(raw);
}

export function saveContent(content: SiteContent): void {
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2));
}
