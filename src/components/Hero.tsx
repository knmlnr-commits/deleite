import { SiteContent } from "@/lib/content";

export default function Hero({ content }: { content: SiteContent }) {
  const { hero } = content;

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-ocean-900 via-ocean-800 to-ocean-700" />

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large wave shapes */}
        <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path
            fill="rgba(14, 165, 233, 0.08)"
            d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L0,320Z"
            className="animate-wave"
          />
          <path
            fill="rgba(14, 165, 233, 0.05)"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,208C960,192,1056,160,1152,154.7C1248,149,1344,171,1392,181.3L1440,192L1440,320L0,320Z"
          />
        </svg>

        {/* Floating circles (bokeh effect) */}
        <div className="absolute top-1/4 left-1/5 w-64 h-64 rounded-full bg-ocean-400/5 blur-3xl animate-float" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-coral-400/5 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-sand-300/5 blur-3xl animate-float" style={{ animationDelay: "4s" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Tagline badge */}
        <div className="inline-flex items-center gap-2 bg-ocean-700/50 backdrop-blur-sm border border-ocean-500/30 rounded-full px-5 py-2 mb-8">
          <span className="w-2 h-2 rounded-full bg-coral-400 animate-pulse" />
          <span className="text-sm font-medium text-ocean-200 tracking-wide uppercase">
            {hero.tagline}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-heading font-black leading-none mb-4">
          <span className="block bg-gradient-to-r from-white via-ocean-100 to-ocean-200 bg-clip-text text-transparent">
            {hero.title}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-2xl sm:text-3xl md:text-4xl font-heading font-light text-ocean-300 mb-8 tracking-wide">
          {hero.subtitle}
        </p>

        {/* Description */}
        <p className="text-lg md:text-xl text-ocean-200/80 max-w-2xl mx-auto mb-12 leading-relaxed">
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
            href="#contact"
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full text-lg font-semibold transition-all border border-white/20 hover:border-white/40"
          >
            Neem contact op
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-ocean-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}
