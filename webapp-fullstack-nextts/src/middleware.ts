import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
const PUBLIC_ROUTES = ["/login", "/register", "/api/auth", "/api/user", "/auth"];
const STATIC_FILES = /\.(css|js|png|jpg|jpeg|svg|ico|woff2|woff|ttf)$/;
export async function middleware(req: NextRequest) {
    let token = null;
    try {
        const pathname = req.nextUrl.pathname
        if (PUBLIC_ROUTES.some(route => pathname.startsWith(route)) || STATIC_FILES.test(pathname)) {
            return NextResponse.next();
        }
        token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, cookieName: "kanban-session-token" });
        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        if (token && (pathname.startsWith("/login") || pathname.startsWith("/register"))) {
            return NextResponse.redirect(new URL("/", req.url));
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cookie": `kanban-session-token=${req.cookies.get("kanban-session-token")?.value}`, // Gửi cookie đi
            },
        })

        if (response.status !== 200) {
            const redirectResponse = NextResponse.redirect(new URL("/login", req.url));
            redirectResponse.cookies.set("kanban-session-token", "", { expires: new Date(0), path: "/" });
            return redirectResponse;
        }


        return NextResponse.next();
    } catch (error) {
        console.log(error)
        return NextResponse.redirect(new URL("/login", req.url))
    }

}