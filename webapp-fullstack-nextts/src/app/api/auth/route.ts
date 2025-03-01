import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma"; // Import Prisma
import { NextRequest, NextResponse } from "next/server";

export  async function GET(req: NextRequest) {
    
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, cookieName: "kanban-session-token" })    
    if (!token) {
        return NextResponse.json({ valid: false }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { id: token.user?.id } });

    if (!user) {
        return NextResponse.json({ valid: false }, { status: 401 })
    }

    return NextResponse.json({ valid: true }, { status: 200 })
}
