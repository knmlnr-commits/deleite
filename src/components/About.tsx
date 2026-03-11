import { SiteContent } from "@/lib/content";
import { WavesIcon, SunIcon, SurfboardIcon, PalmIcon } from "./Icons";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  waves: WavesIcon,
  sun: SunIcon,
  surfboard: SurfboardIcon,
  palm: PalmIcon,
};

export default function About({ content }: { content: SiteContent }) {
  const { about } = content;

  return (
    <section id="over" className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-ocean-900 via-ocean-800 to-ocean-900" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-coral-400 font-semibold text-sm uppercase tracking-widest">
            Welkom
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mt-3 mb-6 bg-gradient-to-r from-white to-ocean-200 bg-clip-text text-transparent">
            {about.title}
          </h2>
          <p className="text-ocean-300 text-lg max-w-3xl mx-auto leading-relaxed">
            {about.text}
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {about.features.map((feature, i) => {
            const Icon = iconMap[feature.icon] || WavesIcon;
            return (
              <div
                key={i}
                className="group bg-ocean-800/50 backdrop-blur-sm border border-ocean-700/50 rounded-2xl p-8 hover:bg-ocean-700/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-ocean-500/10"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-coral-400 to-coral-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-heading font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-ocean-300 leading-relaxed">{feature.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
