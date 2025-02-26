'use client'
import React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useDialog } from "@/hooks/use-dialog";
import CreateBoardForm from "@/components/app/Board/create-form";
import ConfirmDialog from "./confirm-dialog"
import CreateTaskForm from "./Task/create-task-form"
import ViewTaskForm from "./Task/view-task-form"
import { useAppCoordinator } from "@/hooks/useCoordinator";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

interface Props {
    children: React.ReactNode
}

const Layout = ({ children }: Props): React.JSX.Element => {
    const { isOpen } = useDialog()
    const { errorMessage, successMessage, isArchive, fetchBoard, dispatch, setArchive, resetMessage } = useAppCoordinator()
    React.useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage, { style: { color: "red" } })
            dispatch(resetMessage())
        }
    }, [errorMessage])
    React.useEffect(() => {
        if (successMessage) {
            toast.success(successMessage, { style: { color: "green" } })
            dispatch(resetMessage())
        }
    }, [successMessage])
    React.useEffect(() => {
        fetchBoard(isArchive)
    }, [isArchive])
    const searchParams = useSearchParams();
    const paramArchive = searchParams.get("isArchive") === "true";
    React.useEffect(() => {
        dispatch(setArchive(paramArchive))
    }, [paramArchive])
    return <>
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="overflow-hidden">
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