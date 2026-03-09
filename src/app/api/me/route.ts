import { NextRequest, NextResponse } from "next/server";
import { getUserScope } from "@/lib/rbac";

export async function GET(req: NextRequest) {
  const scope = await getUserScope(req.headers);
  if (!scope) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  return NextResponse.json(scope);
}
