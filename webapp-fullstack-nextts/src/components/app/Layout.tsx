'use client'
import React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger, } from "@/components/ui/sidebar"
import { useDialog } from "@/hooks/use-dialog";
import CreateBoardForm from "@/components/app/Board/create-form";
import useFetchBoard from "@/hooks/use-fetch-board"
import { usePathname, useSearchParams } from "next/navigation"
import ConfirmDialog from "./confirm-dialog"
import { useQueryClient } from "@tanstack/react-query"
import CreateTaskForm from "./Task/create-task-form"
import ViewTaskForm from "./Task/view-task-form"
interface Props {
    children: React.ReactNode
}
const Layout = ({ children }: Props): React.JSX.Element => {
    const { isOpen } = useDialog()
    const queryClient = useQueryClient()
    const searchParams = useSearchParams();
    const isArchive = searchParams.get("isArchive") !== "false";
    React.useEffect(() => {
        queryClient.invalidateQueries({ queryKey: ['boards'] })
    }, [isArchive])
    return <>
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                {children}
            </SidebarInset>
        </SidebarProvider>
        {isOpen("BoardForm") && <CreateBoardForm />}
        {isOpen("ConfirmDialog") && <ConfirmDialog />}
        {isOpen("TaskForm") && <CreateTaskForm />}
        {isOpen("TaskView") && <ViewTaskForm />}

    </>
}
Layout.displayName = "Layout"
export default Layout