import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/**
 * Next.js Edge Middleware (Unified Proxy)
 * 
 * Handles:
 * 1. Role-Based Access Control (NextAuth)
 * 2. Global Security Headers
 * 3. Per-portal login redirects
 */

export default withAuth(
    function proxy(req: NextRequestWithAuth) {
        const { pathname } = req.nextUrl;
        const token = req.nextauth.token;

        // Redirects for unauthenticated users
        if (!token) {
            if (pathname.startsWith("/sponsor/dashboard")) {
                const url = req.nextUrl.clone();
                url.pathname = "/sponsor/login";
                return NextResponse.redirect(url);
            }
            if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
                const url = req.nextUrl.clone();
                url.pathname = "/admin/login";
                return NextResponse.redirect(url);
            }
        }

        const response = NextResponse.next();
        // 🚀 OPTIMIZATION: Removed non-persistent JS Rate Limiting. 
        // Security headers remain.
        response.headers.set("X-DNS-Prefetch-Control", "on");
        response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
        response.headers.set("X-Frame-Options", "SAMEORIGIN");
        response.headers.set("X-Content-Type-Options", "nosniff");
        return response;
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;

                // If it's a protected route, merely return true if token exists.
                // Do NOT query database or full auth models here.
                if (pathname.startsWith("/sponsor/dashboard") ||
                    (pathname.startsWith("/admin") && pathname !== "/admin/login") ||
                    pathname.startsWith("/dashboard/participant")) {
                    return !!token;
                }

                return true;
            },
        },
        pages: { signIn: "/signin" },
    }
);

export const config = {
    // 🚀 OPTIMIZATION: Explicitly ignore internal next files and public API
    matcher: ["/((?!_next/static|_next/image|favicon.ico|api/proxy/public).*)"],
};
