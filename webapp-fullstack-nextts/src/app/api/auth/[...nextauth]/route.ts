/* eslint-disable @typescript-eslint/no-explicit-any */
import { authOptions } from "@/lib/authOption"
import NextAuth from "next-auth"
import { NextAuthOptions } from "next-auth"

const handle = NextAuth(authOptions as NextAuthOptions) as any;
export { handle as GET, handle as POST }
