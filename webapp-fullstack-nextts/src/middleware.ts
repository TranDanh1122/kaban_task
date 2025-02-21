import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const pathname  = req.nextUrl.pathname
    console.log(pathname);
    
    if (pathname.startsWith("/login") || pathname.startsWith("/register")|| pathname.startsWith("/api/auth")) return NextResponse.next()
    if (pathname.startsWith("/_next") || pathname.startsWith("/static") || pathname.match(/\.(css|js|png|jpg|jpeg|svg|ico|woff2|woff|ttf)$/)) {
        return NextResponse.next();
    }
    if (!token) return NextResponse.redirect(new URL("/login", req.url));
    return NextResponse.next();
}