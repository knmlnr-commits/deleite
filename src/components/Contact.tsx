import { SiteContent } from "@/lib/content";
import { WhatsAppIcon, MailIcon, PhoneIcon } from "./Icons";

export default function Contact({ content }: { content: SiteContent }) {
  const { contact } = content;

  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-ocean-800 to-ocean-900" />

      {/* Wave decoration top */}
      <svg className="absolute top-0 left-0 right-0 w-full -translate-y-1" viewBox="0 0 1440 60" preserveAspectRatio="none">
        <path fill="rgba(7, 89, 133, 0.3)" d="M0,20 C240,60 480,0 720,30 C960,60 1200,10 1440,40 L1440,0 L0,0 Z" />
      </svg>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <span className="text-coral-400 font-semibold text-sm uppercase tracking-widest">
          Reserveren
        </span>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mt-3 mb-6 bg-gradient-to-r from-white to-ocean-200 bg-clip-text text-transparent">
          {contact.title}
        </h2>
        <p className="text-ocean-300 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
          {contact.text}
        </p>

        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {/* WhatsApp */}
          <a
            href={`https://wa.me/${contact.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-green-600/20 hover:bg-green-600/30 backdrop-blur-sm border border-green-500/30 hover:border-green-500/50 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-green-500/10"
          >
            <WhatsAppIcon className="w-10 h-10 text-green-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <p className="text-white font-semibold text-lg mb-1">WhatsApp</p>
            <p className="text-green-300/80 text-sm">Snel antwoord!</p>
          </a>

          {/* Email */}
          <a
            href={`mailto:${contact.email}`}
            className="group bg-ocean-700/30 hover:bg-ocean-700/50 backdrop-blur-sm border border-ocean-600/30 hover:border-ocean-500/50 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-ocean-500/10"
          >
            <MailIcon className="w-10 h-10 text-ocean-300 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <p className="text-white font-semibold text-lg mb-1">E-mail</p>
            <p className="text-ocean-400 text-sm">{contact.email}</p>
          </a>

          {/* Phone */}
          <a
            href={`tel:${contact.phone}`}
            className="group bg-ocean-700/30 hover:bg-ocean-700/50 backdrop-blur-sm border border-ocean-600/30 hover:border-ocean-500/50 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-ocean-500/10"
          >
            <PhoneIcon className="w-10 h-10 text-ocean-300 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <p className="text-white font-semibold text-lg mb-1">Bel ons</p>
            <p className="text-ocean-400 text-sm">{contact.phone}</p>
          </a>
        </div>

        {/* Big WhatsApp CTA */}
        <a
          href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent("Hoi! Ik ben geïnteresseerd in Vila Deleite. Is het beschikbaar?")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-10 py-5 rounded-full text-xl font-bold transition-all hover:scale-105 shadow-xl shadow-green-600/30"
        >
          <WhatsAppIcon className="w-7 h-7" />
          Direct boeken via WhatsApp
        </a>
      </div>
    </section>
  );
}
