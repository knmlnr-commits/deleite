"use client";

import { useState, useEffect } from "react";
import type { SiteContent } from "@/lib/content";
import Hero from "./Hero";
import About from "./About";
import Gallery from "./Gallery";
import PropertyDetails from "./PropertyDetails";
import Contact from "./Contact";

export default function HomeContent({ initialContent }: { initialContent: SiteContent }) {
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => setContent(data))
      .catch(() => {/* keep initialContent on error */});
  }, []);

  return (
    <>
      <Hero content={content} />
      <About content={content} />
      <Gallery content={content} />
      <PropertyDetails content={content} />
      <Contact content={content} />
    </>
  );
}
