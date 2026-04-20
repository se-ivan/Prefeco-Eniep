// src/app/api/server-time/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const now = new Date();
  const utc = now.toISOString();
  const mexico = new Date(now.toLocaleString("es-MX", { timeZone: "America/Mexico_City" }));
  const mexicoIso = mexico.toISOString();

  return NextResponse.json({
    utc,
    mexico: mexicoIso,
    utcTimestamp: now.getTime(),
    mexicoTimestamp: mexico.getTime(),
    serverTimezone: process.env.TZ || "not configured (defaults to UTC)",
  });
}
