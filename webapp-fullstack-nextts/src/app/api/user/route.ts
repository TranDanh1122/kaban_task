import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "POST") {
        const { email, password, name } = await req.body
        if (!email || !password || !name) return res.status(400).json({ message: "Missing email, password or name" })
        try {
            const user = await prisma.user.create({
                data: { email, password: await bcrypt.hash(password, 10), name }
            })
            if (!user) throw new Error("Create user error")
            return res.status(200)
        } catch (e) {
            console.log("Create user error", e)
            return res.status(500).json({ message: "Create user error" })
        }
    }
}