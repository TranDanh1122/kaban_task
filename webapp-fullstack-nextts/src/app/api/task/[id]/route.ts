import { prisma } from "@/lib/prisma"
import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import fs from 'fs';

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
            include: { subtasks: true, file: true }
        })

        if (!task) return NextResponse.json({ message: "Invalid Data" }, { status: 400 })


        return NextResponse.json({ task: task, message: "Update Task Success" }, { status: 200 })
    } catch (error) {
        console.error(error);

        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    if (!req.headers.get("content-type")?.includes("multipart/form-data")) {
        return NextResponse.json({ message: "Invalid content type" }, { status: 400 });
    }
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, cookieName: "kanban-session-token" })
    if (!token) return NextResponse.json({ message: "Unauthorize" }, { status: 401 })
    try {

        const oldFiles = await prisma.files.findMany({ where: { taskId: params.id } })
        await prisma.files.deleteMany({
            where: { taskId: params.id }
        })
        const formData = await req.formData()
        const data: { name: string, url: string, taskId: string, public_id: string }[] = []

        const uploadPromises = Array.from(formData.entries()).map(async ([_, value]) => {
            if (value instanceof File) {
                const tempPath = path.join('/tmp', value.name)
                const fileBuffer = Buffer.from(await value.arrayBuffer())
                fs.writeFileSync(tempPath, fileBuffer)
                try {
                    const result = await cloudinary.uploader.upload(tempPath, { folder: process.env.CLOUDINARY_UPLOAD_FOLDER })
                    data.push({
                        name: value.name,
                        url: result.secure_url,
                        taskId: params.id,
                        public_id: result.public_id
                    })
                } catch (error) {
                    console.error("Cloudinary upload error:", error);
                } finally {
                    fs.unlinkSync(tempPath)
                }
            }
        })
        await Promise.all(uploadPromises)
        try {
            await prisma.files.createMany({
                data: data.map(file => ({
                    public_id: file.public_id,
                    name: file.name,
                    url: file.url,
                    taskId: params.id
                })),
            })
        } catch (error) {
            console.error("Database save error:", error);
            await Promise.all(data.map(file => cloudinary.uploader.destroy(file.public_id)));
        } finally {
            await Promise.all(oldFiles.map(file => cloudinary.uploader.destroy(file.public_id)));
        }

        return NextResponse.json({ message: "Upload file successfully" }, { status: 201 })
    } catch (error) {
        console.error(error);

        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}