import { SiteContent } from "@/lib/content";
import { BedIcon, BathIcon, UsersIcon, CheckIcon } from "./Icons";

export default function PropertyDetails({ content }: { content: SiteContent }) {
  const { property } = content;

  return (
    <section id="details" className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-ocean-900 to-ocean-800" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-coral-400 font-semibold text-sm uppercase tracking-widest">
            Het verblijf
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mt-3 mb-6 bg-gradient-to-r from-white to-ocean-200 bg-clip-text text-transparent">
            {property.name}
          </h2>
          <p className="text-ocean-300 text-lg">{property.location}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Stats cards */}
          <div className="space-y-8">
            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-ocean-800/50 backdrop-blur-sm border border-ocean-700/50 rounded-2xl p-6 text-center">
                <BedIcon className="w-8 h-8 text-coral-400 mx-auto mb-3" />
                <p className="text-3xl font-heading font-bold text-white">{property.bedrooms}</p>
                <p className="text-ocean-400 text-sm mt-1">Slaapkamers</p>
              </div>
              <div className="bg-ocean-800/50 backdrop-blur-sm border border-ocean-700/50 rounded-2xl p-6 text-center">
                <BathIcon className="w-8 h-8 text-coral-400 mx-auto mb-3" />
                <p className="text-3xl font-heading font-bold text-white">{property.bathrooms}</p>
                <p className="text-ocean-400 text-sm mt-1">Badkamers</p>
              </div>
              <div className="bg-ocean-800/50 backdrop-blur-sm border border-ocean-700/50 rounded-2xl p-6 text-center">
                <UsersIcon className="w-8 h-8 text-coral-400 mx-auto mb-3" />
                <p className="text-3xl font-heading font-bold text-white">{property.guests}</p>
                <p className="text-ocean-400 text-sm mt-1">Gasten</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-ocean-800/50 backdrop-blur-sm border border-ocean-700/50 rounded-2xl p-8">
              <p className="text-ocean-200 leading-relaxed text-lg">{property.description}</p>
            </div>
          </div>

          {/* Highlights */}
          <div className="bg-gradient-to-br from-ocean-700/50 to-ocean-800/50 backdrop-blur-sm border border-ocean-600/30 rounded-2xl p-8">
            <h3 className="text-2xl font-heading font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-coral-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              </span>
              Wat maakt het bijzonder
            </h3>
            <ul className="space-y-4">
              {property.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="w-6 h-6 rounded-full bg-ocean-600/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckIcon className="w-3.5 h-3.5 text-coral-400" />
                  </span>
                  <span className="text-ocean-200 text-lg">{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
