import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
const PUBLIC_ROUTES = ["/login", "/register", "/api/auth", "/api/user/public"];
const STATIC_FILES = /\.(css|js|png|jpg|jpeg|svg|ico|woff2|woff|ttf)$/;
export async function middleware(req: NextRequest) {
    let token = null;
    try {
        token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, cookieName: "kanban-session-token" });
        const pathname = req.nextUrl.pathname
        if (token && (pathname.startsWith("/login") || pathname.startsWith("/register"))) {
            return NextResponse.redirect(new URL("/", req.url));
        }
        if (PUBLIC_ROUTES.some(route => pathname.startsWith(route)) || STATIC_FILES.test(pathname)) {
            return NextResponse.next();
        }
        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        return NextResponse.next();
    } catch (error) {
    }

}