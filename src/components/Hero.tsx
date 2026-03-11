"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { SiteContent } from "@/lib/content";

export default function Hero({ content }: { content: SiteContent }) {
  const { hero } = content;

  // Collect all available hero images (new array field + legacy single image)
  const images: string[] = hero.images?.length
    ? hero.images
    : hero.image
      ? [hero.image]
      : [];

  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [images.length, next]);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background images with slow pan (Ken Burns) */}
      {images.length > 0 ? (
        images.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
            style={{ opacity: i === current ? 1 : 0 }}
          >
            <Image
              src={src}
              alt={`${hero.title} ${i + 1}`}
              fill
              priority={i === 0}
              className="object-cover animate-slow-pan"
              sizes="100vw"
              style={{
                animationDelay: `${i * -8}s`,
              }}
            />
          </div>
        ))
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-ocean-900 via-ocean-800 to-ocean-700" />
      )}

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-ocean-950 to-transparent" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Tagline badge */}
        <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-8">
          <span className="w-2 h-2 rounded-full bg-coral-400 animate-pulse" />
          <span className="text-sm font-medium text-white/90 tracking-wide uppercase">
            {hero.tagline}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-heading font-black leading-none mb-4 drop-shadow-2xl">
          <span className="block text-white">
            {hero.title}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-2xl sm:text-3xl md:text-4xl font-heading font-light text-white/90 mb-8 tracking-wide drop-shadow-lg">
          {hero.subtitle}
        </p>

        {/* Description */}
        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed drop-shadow-md">
          {hero.description}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#gallerij"
            className="group bg-coral-500 hover:bg-coral-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105 shadow-xl shadow-coral-500/30 flex items-center gap-2"
          >
            Ontdek het huis
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </a>
          <a
            href="#boeken"
            className="group bg-white/15 hover:bg-white/25 backdrop-blur-md text-white px-8 py-4 rounded-full text-lg font-semibold transition-all border border-white/30 hover:border-white/50 flex items-center gap-2"
          >
            Boek nu
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </a>
          <a
            href="#contact"
            className="bg-white/15 hover:bg-white/25 backdrop-blur-md text-white px-8 py-4 rounded-full text-lg font-semibold transition-all border border-white/30 hover:border-white/50"
          >
            Neem contact op
          </a>
        </div>

        {/* Slide indicators */}
        {images.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === current ? "w-8 bg-coral-400" : "w-2 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}
