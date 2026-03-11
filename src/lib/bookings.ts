import fs from "fs";

const TMP_BOOKINGS_FILE = "/tmp/bookings.json";
const BUNDLED_BOOKINGS_FILE = process.cwd() + "/content/bookings.json";

export interface Booking {
  id: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  name: string;
  email: string;
  phone: string;
  guests: number;
  message?: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

export interface BlockedPeriod {
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
  reason?: string;
}

export interface BookingData {
  pricing: {
    perNight: number;
    cleaningFee: number;
    minNights: number;
  };
  blocked: BlockedPeriod[];
  bookings: Booking[];
}

const DEFAULT_DATA: BookingData = {
  pricing: {
    perNight: 150,
    cleaningFee: 75,
    minNights: 3,
  },
  blocked: [],
  bookings: [],
};

function getFilePath(): string {
  if (fs.existsSync(TMP_BOOKINGS_FILE)) return TMP_BOOKINGS_FILE;
  if (fs.existsSync(BUNDLED_BOOKINGS_FILE)) return BUNDLED_BOOKINGS_FILE;
  return "";
}

export function getBookingData(): BookingData {
  const p = getFilePath();
  if (!p) return { ...DEFAULT_DATA, blocked: [], bookings: [] };
  try {
    return JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch {
    return { ...DEFAULT_DATA, blocked: [], bookings: [] };
  }
}

export function saveBookingData(data: BookingData): void {
  fs.writeFileSync(TMP_BOOKINGS_FILE, JSON.stringify(data, null, 2));
}

/** Get all dates that are unavailable (booked or blocked) */
export function getUnavailableDates(data: BookingData): string[] {
  const dates = new Set<string>();

  // Add confirmed/pending booking dates
  for (const b of data.bookings) {
    if (b.status === "cancelled") continue;
    const d = new Date(b.checkIn);
    const end = new Date(b.checkOut);
    while (d < end) {
      dates.add(d.toISOString().split("T")[0]);
      d.setDate(d.getDate() + 1);
    }
  }

  // Add blocked periods
  for (const bl of data.blocked) {
    const d = new Date(bl.from);
    const end = new Date(bl.to);
    while (d <= end) {
      dates.add(d.toISOString().split("T")[0]);
      d.setDate(d.getDate() + 1);
    }
  }

  return Array.from(dates).sort();
}
