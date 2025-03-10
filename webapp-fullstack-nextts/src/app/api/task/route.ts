import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { title, status, content, subtasks } = await req.json()
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, cookieName: "kanban-session-token" })
        if (!token) return NextResponse.json({ message: "Unauthorize" }, { status: 401 })
        const task = await prisma.task.create({
            data: {
                title: title,
                content: content,
                subtasks: { create: subtasks },
                status: { connect: { id: status } }
            },
            include: {
                subtasks: true
            }
        })
        if (!task) return NextResponse.json({ message: "Invalid Data" }, { status: 400 })
        return NextResponse.json({ task: task, message: "Create Task Success" }, { status: 201 })
    } catch (error) {
        console.error(error);

        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}
