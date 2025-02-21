import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
        const { email, password, name } = await req.json()
        if (!email || !password || !name) return NextResponse.json({ message: "Missing email, password or name" }, { status: 400 });
        try {
            const user = await prisma.user.create({
                data: { email, password: await bcrypt.hash(password, 10), name }
            })
            if (!user) return NextResponse.json({ message: "NotFound" }, { status: 404 });
            return NextResponse.json({}, { status: 200 });
        } catch (e) {
            console.log("Create user error", e)
            return NextResponse.json({ message: "Create user error" }, { status: 500 })
        }
}