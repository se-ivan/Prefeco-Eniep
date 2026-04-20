import { NextResponse } from "next/server";

export async function GET() {
  const now = new Date();

  return NextResponse.json({
    utc: now.toISOString(),
    mexico: new Intl.DateTimeFormat("es-MX", {
      timeZone: "America/Mexico_City",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(now),
    serverTimezone: process.env.TZ || "not configured (defaults to UTC)",
    epochMs: now.getTime(),
  });
}
