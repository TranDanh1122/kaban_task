import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const boardID = searchParams.get("boardID")
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, cookieName: "kanban-session-token" })
        if (!token) return NextResponse.json({ message: "Unauthorize" }, { status: 401 })
        const columns = await prisma.status.findMany({ where: { board: { id: boardID || "", userId: token.user?.id } } })
        return NextResponse.json(columns, { status: 200 })
    } catch (e) {
        console.error(e)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}
