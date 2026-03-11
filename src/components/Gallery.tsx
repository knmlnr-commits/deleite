"use client";

import { useState } from "react";
import Image from "next/image";
import { SiteContent } from "@/lib/content";

export default function Gallery({ content }: { content: SiteContent }) {
  const { gallery } = content;
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (gallery.images.length === 0) {
    return (
      <section id="gallerij" className="relative py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-900 via-ocean-800/50 to-ocean-900" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <span className="text-coral-400 font-semibold text-sm uppercase tracking-widest">
            Foto&apos;s
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mt-3 mb-6 bg-gradient-to-r from-white to-ocean-200 bg-clip-text text-transparent">
            {gallery.title}
          </h2>
          <div className="bg-ocean-800/50 backdrop-blur-sm border border-ocean-700/50 rounded-2xl p-16 max-w-2xl mx-auto">
            <svg className="w-16 h-16 text-ocean-500 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
            </svg>
            <p className="text-ocean-300 text-lg">
              Foto&apos;s worden binnenkort toegevoegd via het CMS.
            </p>
            <p className="text-ocean-500 text-sm mt-2">
              Ga naar <a href="/admin" className="text-coral-400 hover:underline">/admin</a> om foto&apos;s te uploaden.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallerij" className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-ocean-900 via-ocean-800/50 to-ocean-900" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-coral-400 font-semibold text-sm uppercase tracking-widest">
            Foto&apos;s
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mt-3 mb-6 bg-gradient-to-r from-white to-ocean-200 bg-clip-text text-transparent">
            {gallery.title}
          </h2>
        </div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gallery.images.map((img, i) => (
            <div
              key={i}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer ${
                i === 0 ? "sm:col-span-2 sm:row-span-2" : ""
              }`}
              onClick={() => setLightbox(i)}
            >
              <div className={`relative ${i === 0 ? "aspect-[4/3]" : "aspect-[3/2]"}`}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ocean-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <p className="text-white font-medium">{img.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(lightbox > 0 ? lightbox - 1 : gallery.images.length - 1);
            }}
            className="absolute left-4 text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(lightbox < gallery.images.length - 1 ? lightbox + 1 : 0);
            }}
            className="absolute right-4 text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className="relative max-w-5xl max-h-[85vh] w-full">
            <Image
              src={gallery.images[lightbox].src}
              alt={gallery.images[lightbox].alt}
              width={1200}
              height={800}
              className="object-contain w-full h-full rounded-lg"
            />
            <p className="text-center text-white/80 mt-4 text-lg">
              {gallery.images[lightbox].alt}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
