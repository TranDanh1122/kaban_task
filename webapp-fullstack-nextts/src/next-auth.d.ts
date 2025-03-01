import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: User | null
    }
}
declare module "next-auth/jwt" {
    interface JWT {
        user?: User;
    }
}
