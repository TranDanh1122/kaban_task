'use client'
import React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger, } from "@/components/ui/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Props {
    children: React.ReactNode
}
const Layout = ({ children }: Props): React.JSX.Element => {
    return <><SidebarProvider>
        <AppSidebar />
        <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                </div>
            </header>
            <ScrollArea className="max-h-[calc(100vh-64px)]">
                {children}
            </ScrollArea>
        </SidebarInset>
    </SidebarProvider>
    </>
}
Layout.displayName = "Layout"
export default Layout