import { createSlug } from "@/lib/createSlug";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, cookieName: "kanban-session-token" })
        if (!token) return NextResponse.json({ message: "Unauthorize" }, { status: 401 })
        const boards = await prisma.board.findFirst({
            where: {
                userId: token.user?.id || '',
                id: params.id,
                isArchive: false
            },
            include: {
                Status: {
                    include: {
                        Task: {
                            include: {
                                subtasks: true
                            }
                        }
                    }
                }
            }
        })
        return NextResponse.json(boards, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, cookieName: "kanban-session-token" })
        if (!token) return NextResponse.json({ message: "Unauthorize" }, { status: 401 })
        const { columns, title, id, slug } = await req.json()
        const boards = await prisma.board.findMany({ where: { userId: token?.user?.id ?? "" } })
        const newSlug = createSlug(title, boards)
        const queyParam = { userId: token?.user?.id ?? "", id: id }
        const existingStatusIds = await prisma.status.findMany({
            where: { boardId: id }, // Lọc theo `boardId` hoặc điều kiện phù hợp
            select: { id: true }
        });
        const existingIds = existingStatusIds.map(status => status.id);
        const newIds = columns.map((status: Status) => status.id).filter((id: string) => id);
        const idsToDelete = existingIds.filter(id => !newIds.includes(id));
        const board = await prisma.board.update({
            where: queyParam,
            data: {
                title: title, slug: newSlug, Status: {
                    deleteMany: { id: { in: idsToDelete } },
                    upsert: columns.map((status: Status) => ({
                        where: { id: status.id ?? '' },
                        create: { name: status.name, color: status.color },
                        update: { name: status.name, color: status.color },
                    }))
                }
            },
            include: {
                Status: {
                    include: {
                        Task: {
                            include: {
                                subtasks: true
                            }
                        }
                    }
                }
            }
        })
        return NextResponse.json(board, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, cookieName: "kanban-session-token" })
        if (!token) return NextResponse.json({ message: "Unauthorize" }, { status: 401 })
        await prisma.board.delete({ where: { userId: token.user?.id || '', id: params.id } })
        return NextResponse.json({ status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}