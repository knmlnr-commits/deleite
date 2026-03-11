"use client";

import { useState, useEffect } from "react";
import type { BookingData, Booking, BlockedPeriod } from "@/lib/bookings";

export default function AdminBookings() {
  const [data, setData] = useState<BookingData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // New blocked period form
  const [blockFrom, setBlockFrom] = useState("");
  const [blockTo, setBlockTo] = useState("");
  const [blockReason, setBlockReason] = useState("");

  useEffect(() => {
    fetch("/api/bookings/admin")
      .then((r) => r.json())
      .then(setData);
  }, []);

  async function save() {
    if (!data) return;
    setSaving(true);
    await fetch("/api/bookings/admin", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setSaving(false);
  }

  async function updateBookingStatus(id: string, status: Booking["status"]) {
    await fetch("/api/bookings/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (data) {
      const b = data.bookings.find((x) => x.id === id);
      if (b) b.status = status;
      setData({ ...data });
    }
  }

  function addBlockedPeriod() {
    if (!data || !blockFrom || !blockTo) return;
    data.blocked.push({ from: blockFrom, to: blockTo, reason: blockReason });
    setData({ ...data });
    setBlockFrom("");
    setBlockTo("");
    setBlockReason("");
  }

  function removeBlocked(index: number) {
    if (!data) return;
    data.blocked.splice(index, 1);
    setData({ ...data });
  }

  if (!data) return <div className="text-gray-400">Laden...</div>;

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
    cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  const statusLabels: Record<string, string> = {
    pending: "In afwachting",
    confirmed: "Bevestigd",
    cancelled: "Geannuleerd",
  };

  return (
    <div className="space-y-8">
      {/* Pricing */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Prijzen</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Prijs per nacht (&euro;)</label>
            <input
              type="number"
              value={data.pricing.perNight}
              onChange={(e) => {
                data.pricing.perNight = parseInt(e.target.value) || 0;
                setData({ ...data });
              }}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Schoonmaakkosten (&euro;)</label>
            <input
              type="number"
              value={data.pricing.cleaningFee}
              onChange={(e) => {
                data.pricing.cleaningFee = parseInt(e.target.value) || 0;
                setData({ ...data });
              }}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Min. nachten</label>
            <input
              type="number"
              value={data.pricing.minNights}
              onChange={(e) => {
                data.pricing.minNights = parseInt(e.target.value) || 1;
                setData({ ...data });
              }}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className={`mt-4 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
            saved ? "bg-green-600 text-white" : "bg-sky-500 hover:bg-sky-600 text-white"
          } disabled:opacity-50`}
        >
          {saving ? "Opslaan..." : saved ? "Opgeslagen!" : "Prijzen opslaan"}
        </button>
      </div>

      {/* Blocked periods */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Geblokkeerde periodes</h2>
        <p className="text-gray-400 text-sm mb-4">Data waarop het huis niet beschikbaar is (eigen gebruik, onderhoud, etc.)</p>

        {data.blocked.length > 0 && (
          <div className="space-y-2 mb-4">
            {data.blocked.map((b: BlockedPeriod, i: number) => (
              <div key={i} className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-lg px-4 py-3">
                <div>
                  <span className="text-white font-medium">{b.from}</span>
                  <span className="text-gray-500 mx-2">→</span>
                  <span className="text-white font-medium">{b.to}</span>
                  {b.reason && <span className="text-gray-400 ml-3 text-sm">({b.reason})</span>}
                </div>
                <button
                  onClick={() => removeBlocked(i)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Verwijderen
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Van</label>
            <input
              type="date"
              value={blockFrom}
              onChange={(e) => setBlockFrom(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Tot</label>
            <input
              type="date"
              value={blockTo}
              onChange={(e) => setBlockTo(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Reden (optioneel)</label>
            <input
              type="text"
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              placeholder="bijv. Onderhoud"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>
          <button
            onClick={addBlockedPeriod}
            disabled={!blockFrom || !blockTo}
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-40"
          >
            + Blokkeren
          </button>
        </div>
        {data.blocked.length > 0 && (
          <button
            onClick={save}
            className="mt-3 text-sm text-sky-400 hover:text-sky-300 transition-colors"
          >
            Wijzigingen opslaan
          </button>
        )}
      </div>

      {/* Bookings list */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Boekingen</h2>
        {data.bookings.length === 0 ? (
          <p className="text-gray-500 text-sm">Nog geen boekingen ontvangen.</p>
        ) : (
          <div className="space-y-3">
            {[...data.bookings].reverse().map((b: Booking) => {
              const nights = Math.round(
                (new Date(b.checkOut).getTime() - new Date(b.checkIn).getTime()) / 86400000
              );
              const total = nights * data.pricing.perNight + data.pricing.cleaningFee;
              return (
                <div key={b.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-white font-semibold text-lg">{b.name}</h4>
                      <p className="text-gray-400 text-sm">{b.email} &middot; {b.phone}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[b.status]}`}>
                      {statusLabels[b.status]}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-500">Inchecken</span>
                      <p className="text-white font-medium">{b.checkIn}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Uitchecken</span>
                      <p className="text-white font-medium">{b.checkOut}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Nachten</span>
                      <p className="text-white font-medium">{nights}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Totaal</span>
                      <p className="text-white font-bold">&euro;{total}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs">
                      {b.guests} gasten &middot; {new Date(b.createdAt).toLocaleDateString("nl-NL")}
                      {b.message && ` · "${b.message}"`}
                    </span>
                    <div className="flex gap-2">
                      {b.status !== "confirmed" && (
                        <button
                          onClick={() => updateBookingStatus(b.id, "confirmed")}
                          className="text-xs bg-green-600/20 hover:bg-green-600/30 text-green-400 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Bevestigen
                        </button>
                      )}
                      {b.status !== "cancelled" && (
                        <button
                          onClick={() => updateBookingStatus(b.id, "cancelled")}
                          className="text-xs bg-red-600/20 hover:bg-red-600/30 text-red-400 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Annuleren
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
