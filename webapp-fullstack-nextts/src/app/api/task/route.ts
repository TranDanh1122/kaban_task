import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { title, status, content, subtasks, id } = await req.json()
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, cookieName: "kanban-session-token" })
        if (!token) return NextResponse.json({ message: "Unauthorize" }, { status: 401 })
        const query = { id: id, statusId: status }
        const task = await prisma.task.upsert({
            where: query,
            update: { title: title, content: content, subtasks: { deleteMany: {}, create: subtasks } },
            create: {
                title: title,
                content: content,
                statusId: status,
                subtasks: { create: subtasks },
            }
        })
        if (!task) return NextResponse.json({ message: "Invalid Data" }, { status: 400 })
        return NextResponse.json({task: task , message : id ? "Update Task Success":"Create Task Success"}, { status: 200 })
    } catch (error) {
        console.error(error);
        
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}