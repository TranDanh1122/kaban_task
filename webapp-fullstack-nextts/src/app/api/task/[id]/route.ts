import { prisma } from "@/lib/prisma"
import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, cookieName: "kanban-session-token" })
        if (!token) return NextResponse.json({ message: "Unauthorize" }, { status: 401 })
        const task = await prisma.task.delete({ where: { id: params.id } })
        return NextResponse.json({ task: task, message: "Delete succesfully" }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { title, status, content, subtasks, order } = await req.json()
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, cookieName: "kanban-session-token" })
        if (!token) return NextResponse.json({ message: "Unauthorize" }, { status: 401 })
        const query = { id: params.id }
        const task = await prisma.task.update({
            where: query,
            data: {
                title: title,
                content: content,
                status: { connect: { id: status } },
                subtasks: { deleteMany: {}, create: subtasks },
                order: order
            },
            include: {
                subtasks: true
            }
        })
        if (!task) return NextResponse.json({ message: "Invalid Data" }, { status: 400 })
        return NextResponse.json({ task: task, message: "Update Task Success" }, { status: 200 })
    } catch (error) {
        console.error(error);

        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { neworder, oldorder, statusId } = await req.json()
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, cookieName: "kanban-session-token" })
        if (!token) return NextResponse.json({ message: "Unauthorize" }, { status: 401 })
        const query = { id: params.id }
    
        if (neworder < oldorder) {
            // Di chuyển lên: tăng thứ tự của các task có order >= neworder và < oldorder
            await prisma.task.updateMany({
                where: {
                    statusId: statusId,
                    NOT: { id: params.id },
                    order: { gte: neworder, lt: oldorder },
                },
                data: {
                    order: { increment: 1 },
                },
            });
        } else if (neworder > oldorder) {
            // Di chuyển xuống: giảm thứ tự của các task có order > oldorder và <= neworder
            await prisma.task.updateMany({
                where: {
                    statusId: statusId,
                    NOT: { id: params.id },
                    order: { gt: oldorder, lte: neworder },
                },
                data: {
                    order: { decrement: 1 },
                },
            });
        }
        const task = await prisma.task.update({
            where: query,
            data: { order: neworder, statusId: statusId },
            include: { subtasks: true }
        })

        if (!task) return NextResponse.json({ message: "Invalid Data" }, { status: 400 })


        return NextResponse.json({ task: task, message: "Update Task Success" }, { status: 200 })
    } catch (error) {
        console.error(error);

        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}