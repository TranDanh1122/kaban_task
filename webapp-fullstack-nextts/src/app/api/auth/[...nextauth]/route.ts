import CredentialsProvider from "next-auth/providers/credentials"
import NextAuth, { Session, AuthOptions } from "next-auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { JWT } from "next-auth/jwt"
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
    pages: {
        signIn: 'login'
    },
    debug: true,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            async profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                }
            }
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeHolder: "Email" },
                password: { label: "Password", type: "password", placeholder: "Password" }
            },
            async authorize(credentials) {
                if (!credentials) return null
                if (!credentials.email || !credentials.password) return null
                try {
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email }
                    })
                    if (!user) return null

                    const isValidPass = await bcrypt.compare(credentials.password, user.password ?? "")
                    if (!isValidPass) return null
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        avatar: user.avatar
                    }
                } catch (e) {
                    console.log("Lỗi đăng nhập", e)
                    return null

                }
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }: { token: JWT, user: User }) {
            if (user) token.user = {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar: user.avatar
            }
            return token
        },
        async session({ session, token }: { session: Session, token: JWT }) {
            session.user = token.user as User
            return session
        }
    },
    cookies: {
        sessionToken: {
            name: "kanban-session-token",
            options: {
                httpOnly: true,
                sameSite: "strict",
                path: "/",
                secure: process.env.NODE_ENV === "production"
            }
        }
    },
    secret: process.env.NEXTAUTH_SECRET
}
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
