import { prisma } from "@/lib/prisma"
import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import fs from 'fs';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
// export const config = {
//     api: {
//         bodyParser: false,
//     },
// };

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    if (!req.headers.get("content-type")?.includes("multipart/form-data")) {
        return NextResponse.json({ message: "Invalid content type" }, { status: 400 });
    }
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, cookieName: "kanban-session-token" })
    if (!token) return NextResponse.json({ message: "Unauthorize" }, { status: 401 })
    try {
        const type = req.nextUrl.searchParams.get("type")
        if (!type)
            return NextResponse.json({ message: "Not found" }, { status: 404 })
        const oldFiles = await prisma.files.findMany({ where: { relationId: params.id, relationType: type } })
        await prisma.files.deleteMany({
            where: { relationId: params.id, relationType: type }
        })
        const formData = await req.formData()
        const data: { name: string, url: string, relationId: string, relationType: string, public_id: string }[] = []

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
                        relationId: params.id,
                        relationType: type,
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
            const files = await prisma.files.createManyAndReturn({
                data: data.map(file => ({
                    public_id: file.public_id,
                    name: file.name,
                    url: file.url,
                    relationId: params.id,
                    relationType: type,
                })),
            })
            await Promise.all(oldFiles.map(file => cloudinary.uploader.destroy(file.public_id)));

            return NextResponse.json({ files: files, message: "Upload file successfully" }, { status: 201 })

        } catch (error) {
            console.error("Database save error:", error);
            await Promise.all(data.map(file => cloudinary.uploader.destroy(file.public_id)));
        }

    } catch (error) {
        console.error(error);

        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}