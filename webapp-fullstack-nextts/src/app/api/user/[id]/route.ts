import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {

    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, cookieName: "kanban-session-token" })
        if (!token) return NextResponse.json({ message: "Unauthorize" }, { status: 401 })
        const {data} = await req.json()
        console.log(data);
        const user = await prisma.user.update({
            where: { id: params.id },
            data: data
        })
        if (!user) return NextResponse.json({ message: "NotFound" }, { status: 404 });
        return NextResponse.json({ user: user }, { status: 200 });
    } catch (e) {
        console.error(e)
        return NextResponse.json({ message: "Update account error" }, { status: 500 })
    }
}
