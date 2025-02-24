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
interface Props {
    children: React.ReactNode
}
const Layout = ({ children }: Props): React.JSX.Element => {
    const { isOpen } = useDialog()
    const { boards, isLoading } = useFetchBoard();
    const pathNames = usePathname().split("/")
    const page = pathNames[pathNames.length - 1]
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
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4  w-full">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        {
                            isLoading && <div className="w-5 h-5 border-t-2 border-l-2 border-primary-300 animate-spin rounded-full"></div>
                        }
                        {
                            !isLoading &&
                            <span className="heading-xl">{boards?.find((el: Board) => el.slug == page)?.title || "Dashboard"}</span>
                        }
                    </div>
                </header>

                {children}
            </SidebarInset>
        </SidebarProvider>
        {isOpen("BoardForm") && <CreateBoardForm />}
        {isOpen("ConfirmDialog") && <ConfirmDialog />}
        {isOpen("TaskForm") && <CreateTaskForm />}

    </>
}
Layout.displayName = "Layout"
export default Layout