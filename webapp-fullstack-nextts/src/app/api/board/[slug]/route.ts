import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, cookieName: "kanban-session-token" })
        if (!token) return NextResponse.json({ message: "Unauthorize" }, { status: 401 })
        const boards = await prisma.board.findFirst({ where: { userId: token.user?.id || '', slug: params.slug, isArchive: false }, include: { Status: { include: { Task: true } } } })
        return NextResponse.json(boards, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}
export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, cookieName: "kanban-session-token" })
        if (!token) return NextResponse.json({ message: "Unauthorize" }, { status: 401 })
        const updateData = await req.json()
        const board = await prisma.board.update({ where: { slug_userId: { userId: token.user?.id || '', slug: params.slug } }, data: updateData })
        return NextResponse.json(board, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}
export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, cookieName: "kanban-session-token" })
        if (!token) return NextResponse.json({ message: "Unauthorize" }, { status: 401 })
        await prisma.board.delete({ where: { slug_userId: { userId: token.user?.id || '', slug: params.slug } } })
        return NextResponse.json({ status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}