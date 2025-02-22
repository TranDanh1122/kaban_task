'use client'
import React from "react";
import { LoginForm } from "@/components/auth/login-form"
import Image from "next/image";

export default function LoginPage() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-primary-100 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <a href="#" className="flex items-center gap-2 self-center font-medium">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white">
                        <Image width={24} height={24} alt="logo" src={"/assets/new_logo.svg"}></Image>
                    </div>
                    <span className="truncate font-extrabold heading-xl">
                        KANBAN
                    </span>
                </a>
                <LoginForm />
            </div>
        </div>
    )
}
