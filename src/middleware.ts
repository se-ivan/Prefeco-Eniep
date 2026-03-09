import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { betterFetch } from "@better-fetch/fetch";

type Session = {
    session: {
        id: string;
        userId: string;
        expiresAt: Date;
    };
    user: {
        id: string;
        email: string;
        name: string;
        role?: string; 
    };
};

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    const { data: session } = await betterFetch<Session>("/api/auth/get-session", {
        baseURL: request.nextUrl.origin,
        headers: {
            cookie: request.headers.get("cookie") || "",
        },
    });

    if (session && path.startsWith("/login")) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (!session && path.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (session && path.startsWith("/dashboard")) {
        const role = session.user.role;

        if (path.startsWith("/dashboard/instituciones") && role !== "admin") {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        if (path.startsWith("/dashboard/equipos") && role !== "institucion" && role !== "admin") {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*", 
        "/login" 
    ],
};