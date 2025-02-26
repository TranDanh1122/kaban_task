'use client'

import { persiststore, store } from "@/redux/store";
import { Session } from "next-auth";
import { SessionProvider as SessionContext } from "next-auth/react";
import { Provider } from "react-redux";
//@ts-expect-error this librabry @type not working at all
import { PersistGate } from "redux-persist/integration/react";
export default function AppServiceProvider({ session, children }: { session: Session | null, children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persiststore}>
                <SessionContext session={session} refetchInterval={5 * 60}>
                    {children}
                </SessionContext>
            </PersistGate>
        </Provider>
    )
}