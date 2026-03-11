"use client";

import { useState, useEffect } from "react";
import BookingCalendar from "./BookingCalendar";

interface PricingInfo {
  perNight: number;
  cleaningFee: number;
  minNights: number;
}

export default function BookingSection() {
  const [unavailable, setUnavailable] = useState<Set<string>>(new Set());
  const [pricing, setPricing] = useState<PricingInfo | null>(null);
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [step, setStep] = useState<"dates" | "form" | "done">("dates");

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(2);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<{ nights: number; total: number } | null>(null);

  useEffect(() => {
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((data) => {
        setPricing(data.pricing);
        setUnavailable(new Set(data.unavailableDates));
      });
  }, []);

  function onSelectDate(date: string) {
    if (!checkIn || (checkIn && checkOut)) {
      // Start new selection
      setCheckIn(date);
      setCheckOut(null);
      setStep("dates");
    } else {
      // Set check-out
      if (date <= checkIn) {
        // Clicked before check-in, restart
        setCheckIn(date);
        setCheckOut(null);
      } else {
        // Verify no unavailable dates in range
        const d = new Date(checkIn);
        const end = new Date(date);
        d.setDate(d.getDate() + 1);
        let hasConflict = false;
        while (d < end) {
          if (unavailable.has(d.toISOString().split("T")[0])) {
            hasConflict = true;
            break;
          }
          d.setDate(d.getDate() + 1);
        }
        if (hasConflict) {
          setError("Er zit een bezette datum in je selectie. Kies andere datums.");
          setCheckIn(null);
          setCheckOut(null);
        } else {
          setCheckOut(date);
          setError(null);
        }
      }
    }
  }

  const nights =
    checkIn && checkOut
      ? Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)
      : 0;

  const totalPrice = pricing ? nights * pricing.perNight + pricing.cleaningFee : 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!checkIn || !checkOut) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkIn, checkOut, name, email, phone, guests, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
      } else {
        setBookingResult({ nights: data.nights, total: data.total });
        setStep("done");
        // Refresh unavailable dates
        const fresh = await fetch("/api/bookings").then((r) => r.json());
        setUnavailable(new Set(fresh.unavailableDates));
      }
    } catch {
      setError("Er ging iets mis. Probeer het opnieuw.");
    }
    setSubmitting(false);
  }

  function formatDateNL(dateStr: string) {
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("nl-NL", { weekday: "short", day: "numeric", month: "long" });
  }

  if (!pricing) {
    return (
      <section id="boeken" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 text-center text-ocean-400">Laden...</div>
      </section>
    );
  }

  return (
    <section id="boeken" className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-ocean-900 via-ocean-800/50 to-ocean-900" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-coral-400 font-semibold text-sm uppercase tracking-widest">
            Reserveren
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mt-3 mb-4 bg-gradient-to-r from-white to-ocean-200 bg-clip-text text-transparent">
            Boek je verblijf
          </h2>
          <p className="text-ocean-300 text-lg max-w-xl mx-auto">
            Selecteer je datums, bekijk de prijs en boek direct.
          </p>
        </div>

        {step === "done" ? (
          <div className="max-w-lg mx-auto bg-ocean-800/50 backdrop-blur-sm border border-ocean-700/50 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Aanvraag verstuurd!</h3>
            <p className="text-ocean-300 mb-6">
              Bedankt, {name}! We nemen zo snel mogelijk contact met je op om je boeking te bevestigen.
            </p>
            <div className="bg-ocean-900/50 rounded-xl p-4 text-left space-y-2 text-sm">
              <div className="flex justify-between text-ocean-300">
                <span>Inchecken</span>
                <span className="text-white font-medium">{checkIn && formatDateNL(checkIn)}</span>
              </div>
              <div className="flex justify-between text-ocean-300">
                <span>Uitchecken</span>
                <span className="text-white font-medium">{checkOut && formatDateNL(checkOut)}</span>
              </div>
              <div className="flex justify-between text-ocean-300">
                <span>{bookingResult?.nights} nachten</span>
                <span className="text-white font-bold text-lg">&euro;{bookingResult?.total}</span>
              </div>
            </div>
            <button
              onClick={() => {
                setStep("dates");
                setCheckIn(null);
                setCheckOut(null);
                setName("");
                setEmail("");
                setPhone("");
                setMessage("");
              }}
              className="mt-6 text-coral-400 hover:text-coral-300 font-medium transition-colors"
            >
              Nieuwe boeking maken
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: Calendar */}
            <div className="bg-ocean-800/50 backdrop-blur-sm border border-ocean-700/50 rounded-2xl p-6">
              <BookingCalendar
                unavailableDates={unavailable}
                checkIn={checkIn}
                checkOut={checkOut}
                onSelectDate={onSelectDate}
              />

              {/* Selected dates summary */}
              {checkIn && (
                <div className="mt-6 bg-ocean-900/50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-ocean-400">Inchecken</p>
                      <p className="text-white font-semibold">{formatDateNL(checkIn)}</p>
                    </div>
                    <svg className="w-5 h-5 text-ocean-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    <div className="text-right">
                      <p className="text-xs text-ocean-400">Uitchecken</p>
                      <p className="text-white font-semibold">
                        {checkOut ? formatDateNL(checkOut) : "Selecteer..."}
                      </p>
                    </div>
                  </div>

                  {nights > 0 && (
                    <>
                      <div className="border-t border-ocean-700/50 pt-3 space-y-1.5 text-sm">
                        <div className="flex justify-between text-ocean-300">
                          <span>&euro;{pricing.perNight} &times; {nights} nachten</span>
                          <span>&euro;{nights * pricing.perNight}</span>
                        </div>
                        <div className="flex justify-between text-ocean-300">
                          <span>Schoonmaakkosten</span>
                          <span>&euro;{pricing.cleaningFee}</span>
                        </div>
                      </div>
                      <div className="border-t border-ocean-700/50 pt-3 flex justify-between">
                        <span className="text-white font-semibold">Totaal</span>
                        <span className="text-coral-400 font-bold text-xl">&euro;{totalPrice}</span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Right: Booking form */}
            <div className="bg-ocean-800/50 backdrop-blur-sm border border-ocean-700/50 rounded-2xl p-6">
              {!checkIn || !checkOut ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <svg className="w-16 h-16 text-ocean-600 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  <p className="text-ocean-400 text-lg">
                    Selecteer eerst je <strong className="text-white">incheck-</strong> en <strong className="text-white">uitcheckdatum</strong> in de kalender.
                  </p>
                  {nights > 0 && nights < pricing.minNights && (
                    <p className="text-red-400 text-sm mt-3">
                      Minimaal {pricing.minNights} nachten vereist.
                    </p>
                  )}
                </div>
              ) : nights < pricing.minNights ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <p className="text-red-400 text-lg">
                    Minimaal <strong>{pricing.minNights} nachten</strong> vereist. Je hebt {nights} nacht{nights !== 1 ? "en" : ""} geselecteerd.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="text-xl font-bold text-white mb-2">Jouw gegevens</h3>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-ocean-300 mb-1">Naam *</label>
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-ocean-900/70 border border-ocean-700 rounded-lg px-4 py-2.5 text-white placeholder-ocean-500 focus:outline-none focus:border-coral-400 transition-colors"
                      placeholder="Je volledige naam"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ocean-300 mb-1">E-mail *</label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-ocean-900/70 border border-ocean-700 rounded-lg px-4 py-2.5 text-white placeholder-ocean-500 focus:outline-none focus:border-coral-400 transition-colors"
                      placeholder="email@voorbeeld.nl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ocean-300 mb-1">Telefoon *</label>
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-ocean-900/70 border border-ocean-700 rounded-lg px-4 py-2.5 text-white placeholder-ocean-500 focus:outline-none focus:border-coral-400 transition-colors"
                      placeholder="+31 6 1234 5678"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ocean-300 mb-1">Aantal gasten *</label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full bg-ocean-900/70 border border-ocean-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-coral-400 transition-colors"
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? "gast" : "gasten"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ocean-300 mb-1">Bericht (optioneel)</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                      className="w-full bg-ocean-900/70 border border-ocean-700 rounded-lg px-4 py-2.5 text-white placeholder-ocean-500 focus:outline-none focus:border-coral-400 transition-colors resize-y"
                      placeholder="Speciale wensen of vragen..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-coral-500 hover:bg-coral-600 text-white py-3.5 rounded-xl font-bold text-lg transition-all hover:scale-[1.02] shadow-xl shadow-coral-500/30 disabled:opacity-50"
                  >
                    {submitting ? "Bezig met boeken..." : `Boek nu — €${totalPrice}`}
                  </button>

                  <p className="text-xs text-ocean-500 text-center">
                    Je ontvangt een bevestiging per e-mail. Betaling in overleg.
                  </p>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
