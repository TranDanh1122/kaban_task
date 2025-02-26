import { createSlug } from "@/lib/createSlug";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
    try {
        const { columns, title, id, slug } = await req.json()
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, cookieName: "kanban-session-token" })
        if (!token) return NextResponse.json({ message: "Unauthorize" }, { status: 401 })
        if (!columns || columns.length <= 0 || !title) return NextResponse.json({ message: "Invalid Data" }, { status: 400 })

        const boards = await prisma.board.findMany({ where: { userId: token?.user?.id ?? "" } })
        const oldSlug = slug ?? ""
        const newSlug = createSlug(title, boards)
        const queyParam = { slug_userId: { userId: token?.user?.id ?? "", slug: oldSlug } }
        const existingStatusIds = await prisma.status.findMany({
            where: { boardId: id }, // Lọc theo `boardId` hoặc điều kiện phù hợp
            select: { id: true }
        });
        const existingIds = existingStatusIds.map(status => status.id);
        const newIds = columns.map((status: Status) => status.id).filter((id: string) => id);
        const idsToDelete = existingIds.filter(id => !newIds.includes(id));
        const board = await prisma.board.upsert({
            where: queyParam,
            update: {
                title: title, slug: newSlug, Status: {
                    deleteMany: { id: { in: idsToDelete } },
                    upsert: columns.map((status: Status) => ({
                        where: { id: status.id ?? '' },
                        create: { name: status.name, color: status.color },
                        update: { name: status.name, color: status.color },
                    }))
                }
            },
            create: { title: title, userId: token?.user?.id ?? "", slug: newSlug, Status: { create: columns } }
        })
        if (!board) return NextResponse.json({ message: "Error when create Board" }, { status: 400 })
        return NextResponse.json({ data: board, message: id ? "Update board Successfully" : "Create A Board Successfully" }, { status: 200 })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}
export async function GET(req: NextRequest) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, cookieName: "kanban-session-token" })
        if (!token) return NextResponse.json({ message: "Unauthorize" }, { status: 401 })
        const { searchParams } = new URL(req.url)
        const isArchive = searchParams.get("isArchive")
        console.log(isArchive);

        const boards = await prisma.board.findMany({ where: { userId: token.user?.id, isArchive: isArchive ? isArchive === "true" : false } })
        return NextResponse.json(boards, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}
