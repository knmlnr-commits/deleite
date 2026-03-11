"use client";

import { useState } from "react";

interface Props {
  unavailableDates: Set<string>;
  checkIn: string | null;
  checkOut: string | null;
  onSelectDate: (date: string) => void;
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function formatDate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

const MONTHS_NL = [
  "Januari", "Februari", "Maart", "April", "Mei", "Juni",
  "Juli", "Augustus", "September", "Oktober", "November", "December",
];

const DAYS_NL = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];

export default function BookingCalendar({ unavailableDates, checkIn, checkOut, onSelectDate }: Props) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  function prev() {
    if (viewMonth === 0) { setViewYear(viewYear - 1); setViewMonth(11); }
    else setViewMonth(viewMonth - 1);
  }

  function next() {
    if (viewMonth === 11) { setViewYear(viewYear + 1); setViewMonth(0); }
    else setViewMonth(viewMonth + 1);
  }

  const todayStr = formatDate(today.getFullYear(), today.getMonth(), today.getDate());
  const totalDays = daysInMonth(viewYear, viewMonth);
  // Monday-based: 0=Mon, 6=Sun
  const firstDow = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;

  function isInRange(dateStr: string) {
    if (!checkIn || !checkOut) return false;
    return dateStr > checkIn && dateStr < checkOut;
  }

  // Build grid of 6 weeks max
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prev} className="text-ocean-300 hover:text-white p-2 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-lg font-semibold text-white">
          {MONTHS_NL[viewMonth]} {viewYear}
        </h3>
        <button onClick={next} className="text-ocean-300 hover:text-white p-2 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS_NL.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-ocean-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={`e${i}`} />;

          const dateStr = formatDate(viewYear, viewMonth, day);
          const isPast = dateStr < todayStr;
          const isUnavailable = unavailableDates.has(dateStr);
          const isCheckIn = dateStr === checkIn;
          const isCheckOut = dateStr === checkOut;
          const inRange = isInRange(dateStr);
          const disabled = isPast || isUnavailable;

          let cls = "relative h-10 rounded-lg text-sm font-medium transition-all flex items-center justify-center ";

          if (isCheckIn || isCheckOut) {
            cls += "bg-coral-500 text-white font-bold shadow-lg shadow-coral-500/30";
          } else if (inRange) {
            cls += "bg-coral-500/20 text-coral-300";
          } else if (disabled) {
            cls += "text-ocean-700 cursor-not-allowed";
            if (isUnavailable && !isPast) cls += " line-through";
          } else {
            cls += "text-ocean-200 hover:bg-ocean-700/50 cursor-pointer";
          }

          return (
            <button
              key={dateStr}
              disabled={disabled}
              onClick={() => !disabled && onSelectDate(dateStr)}
              className={cls}
            >
              {day}
              {isUnavailable && !isPast && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs text-ocean-400">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-coral-500" /> Geselecteerd
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-coral-500/20" /> Verblijf
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> Bezet
        </span>
      </div>
    </div>
  );
}
