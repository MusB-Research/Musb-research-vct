import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function handleProxy(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    const targetPath = path.join("/");
    const url = new URL(`${API_URL}/api/${targetPath}`);

    // Carry over URL params
    req.nextUrl.searchParams.forEach((value, key) => {
        url.searchParams.set(key, value);
    });

    const headers = new Headers();

    // Pass down Content-Type if present
    const contentType = req.headers.get("content-type");
    if (contentType) {
        headers.set("Content-Type", contentType);
    }

    // 🚀 OPTIMIZATION: Use getToken() instead of getServerSession()
    // It directly decodes the token securely without invoking the entire auth callback chain.
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const clientAuthHeader = req.headers.get("authorization");

    if (clientAuthHeader) {
        headers.set("Authorization", clientAuthHeader);
    } else if (token?.accessToken) {
        headers.set("Authorization", `Bearer ${token.accessToken}`);
    }

    try {
        const response = await fetch(url.toString(), {
            method: req.method,
            headers: headers,
            body: req.method !== "GET" && req.method !== "DELETE" ? req.body : undefined,
            // @ts-ignore - duplex is required for streaming request bodies
            duplex: "half",
        });

        // 🚀 OPTIMIZATION: Stream the raw response directly to the client
        // This makes transferring large payloads (like data grids) significantly faster
        // and skips Next.js having to buffer and parse the JSON.
        return new NextResponse(response.body, {
            status: response.status,
            headers: response.headers,
        });
    } catch (error: any) {
        console.error("Proxy error:", error);
        return NextResponse.json({ detail: "Backend connection failed" }, { status: 502 });
    }
}

export { handleProxy as GET, handleProxy as POST, handleProxy as PUT, handleProxy as PATCH, handleProxy as DELETE };
