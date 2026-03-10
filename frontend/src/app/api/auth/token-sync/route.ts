import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Secure Session API (Fort Knox)
 * 
 * Sets HttpOnly, Secure, SameSite=Lax cookies for backend tokens.
 * This prevents XSS scripts from stealing sensitive access tokens.
 */
export async function POST(request: Request) {
    try {
        const { token, portal } = await request.json();
        const cookieStore = await cookies();

        // Portal-specific cookie names
        const cookieName = portal === "SUPER_ADMIN" ? "musb_sat" :
            portal === "ADMIN" ? "musb_at" : "musb_pt";

        cookieStore.set(cookieName, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 8 * 60 * 60, // 8 hours
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Context initialization failed" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { portal } = await request.json();
    const cookieStore = await cookies();

    const cookieName = portal === "SUPER_ADMIN" ? "musb_sat" :
        portal === "ADMIN" ? "musb_at" : "musb_pt";

    cookieStore.delete(cookieName);
    return NextResponse.json({ success: true });
}
