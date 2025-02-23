import { createSlug } from "@/lib/createSlug";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
    try {
        const { columns, title } = await req.json()
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, cookieName: "kanban-session-token" })
        if (!token) return NextResponse.json({ message: "Unauthorize" }, { status: 401 })
        if (!columns || columns.length <= 0 || !title) return NextResponse.json({ message: "Invalid Data" }, { status: 400 })
        const board = await prisma.board.create({
            data: { title: title, userId: token?.user?.id ?? "", slug: createSlug(title) }
        })
        if (!board) return NextResponse.json({ message: "Error when create Board" }, { status: 400 })
        return NextResponse.json({ message: "Create A Board Successfully" }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}
export async function GET(req: NextRequest) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, cookieName: "kanban-session-token" })
        if (!token) return NextResponse.json({ message: "Unauthorize" }, { status: 401 })
        const boards = await prisma.board.findMany({ where: { userId: token.user?.id } })
        return NextResponse.json(boards, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}