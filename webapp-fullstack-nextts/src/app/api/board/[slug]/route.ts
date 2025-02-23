import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, cookieName: "kanban-session-token" })
        if (!token) return NextResponse.json({ message: "Unauthorize" }, { status: 401 })
        const boards = await prisma.board.findFirst({ where: { userId: token.user?.id, isArchive: false, slug: params.slug }, include: { Status: { include: { Task: true } } } })
        return NextResponse.json(boards, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}