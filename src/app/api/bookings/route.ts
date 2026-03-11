import { NextRequest, NextResponse } from "next/server";
import {
  getBookingData,
  saveBookingData,
  getUnavailableDates,
  type Booking,
} from "@/lib/bookings";

/** GET: return pricing + unavailable dates (public) */
export async function GET() {
  const data = getBookingData();
  return NextResponse.json({
    pricing: data.pricing,
    unavailableDates: getUnavailableDates(data),
  });
}

/** POST: create a new booking request */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { checkIn, checkOut, name, email, phone, guests, message } = body;

  if (!checkIn || !checkOut || !name || !email || !phone || !guests) {
    return NextResponse.json({ error: "Alle velden zijn verplicht." }, { status: 400 });
  }

  const data = getBookingData();
  const unavailable = new Set(getUnavailableDates(data));

  // Validate no overlap with unavailable dates
  const d = new Date(checkIn);
  const end = new Date(checkOut);
  while (d < end) {
    if (unavailable.has(d.toISOString().split("T")[0])) {
      return NextResponse.json(
        { error: "De geselecteerde data zijn niet beschikbaar." },
        { status: 409 }
      );
    }
    d.setDate(d.getDate() + 1);
  }

  // Check minimum nights
  const nights = Math.round(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000
  );
  if (nights < data.pricing.minNights) {
    return NextResponse.json(
      { error: `Minimaal ${data.pricing.minNights} nachten.` },
      { status: 400 }
    );
  }

  const booking: Booking = {
    id: crypto.randomUUID(),
    checkIn,
    checkOut,
    name,
    email,
    phone,
    guests,
    message: message || "",
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  data.bookings.push(booking);
  saveBookingData(data);

  const total = nights * data.pricing.perNight + data.pricing.cleaningFee;

  return NextResponse.json({ booking, nights, total }, { status: 201 });
}
