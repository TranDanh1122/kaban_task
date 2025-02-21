'use client'

import { Session } from "next-auth";
import { SessionProvider as SessionContext } from "next-auth/react";

export default function SessionProvider({session, children} : {session : Session | null, children : React.ReactNode}) {
    return (
        <SessionContext session={session} refetchInterval={5 * 60}>
            {children}
        </SessionContext>
    )
}