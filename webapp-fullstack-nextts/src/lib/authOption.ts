import CredentialsProvider from "next-auth/providers/credentials"
import { Session, NextAuthOptions } from "next-auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { JWT } from "next-auth/jwt"
import GitHubProvider from "next-auth/providers/github"
import TwitterProvider from "next-auth/providers/twitter"
import { PrismaAdapter } from "@next-auth/prisma-adapter"

export const authOptions: NextAuthOptions = {
    debug: true,
    pages: {
        signIn: "/",
        signOut: "/login"
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
            profile(profile) {
                return {
                    id: profile.id.toString(),
                    name: profile.name ?? profile.login,
                    email: profile.email,
                    image: profile.avatar_url,
                }
            },
        }),
        TwitterProvider({
            clientId: process.env.TWITTER_CLIENT_ID!,
            clientSecret: process.env.TWITTER_CLIENT_SECRET!,
            version: "2.0",
            profile(profile) {
                return {
                    id: profile.id_str,
                    name: profile.name,
                    email: profile.email,
                    image: profile.profile_image_url_https.replace(
                        /_normal\.(jpg|png|gif)$/,
                        ".$1"
                    ),
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
                        image: user.image
                    }
                } catch (e) {
                    console.error(e)
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
                image: user.image
            }
            return token
        },
        async session({ session, token }: { session: Session, token: JWT }) {
            if (token.user) {
                const dbUser = await prisma.user.findUnique({
                    where: { id: token.user.id },
                    select: { password: false, id: true, name: true, email: true, image: true },
                });
                if (dbUser) {
                    session.user = dbUser as User;
                } else {
                    session.user = null;
                }
            }

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