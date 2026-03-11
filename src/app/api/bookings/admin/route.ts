import { NextRequest, NextResponse } from "next/server";
import { getBookingData, saveBookingData } from "@/lib/bookings";

/** GET: return full booking data for admin */
export async function GET() {
  return NextResponse.json(getBookingData());
}

/** PUT: update booking data (pricing, blocked periods, booking statuses) */
export async function PUT(req: NextRequest) {
  const body = await req.json();
  saveBookingData(body);
  return NextResponse.json({ ok: true });
}

/** PATCH: update a single booking's status */
export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json();
  const data = getBookingData();
  const booking = data.bookings.find((b) => b.id === id);
  if (!booking) {
    return NextResponse.json({ error: "Boeking niet gevonden." }, { status: 404 });
  }
  booking.status = status;
  saveBookingData(data);
  return NextResponse.json({ booking });
}
