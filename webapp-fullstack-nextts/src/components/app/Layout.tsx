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
import { usePathname, useSearchParams } from "next/navigation";
import { setViewingBoard } from "@/redux/slicers/appCordinatorSlicer";
import SettingDialog from "./Setting/setting";
import { useGetBoardsQuery } from "@/redux/actions/boardAPI";
import AccountDialog from "./Account/account";

interface Props {
    children: React.ReactNode
}

const Layout = ({ children }: Props): React.JSX.Element => {
    const { isOpen } = useDialog()
    const { boards, errorMessage, successMessage, isArchive, dispatch, setArchive, resetMessage } = useAppCoordinator()
    const { data, refetch } = useGetBoardsQuery(isArchive);
    React.useEffect(() => {
      refetch();
    }, [isArchive]);
    
    React.useEffect(() => { //error message
        if (errorMessage) {
            toast.error(errorMessage, { style: { color: "red" } })
            dispatch(resetMessage())
        }
    }, [errorMessage])
    React.useEffect(() => { // success messgae
        if (successMessage) {
            toast.success(successMessage, { style: { color: "green" } })
            dispatch(resetMessage())
        }
    }, [successMessage])

    const searchParams = useSearchParams();
    const paramArchive = searchParams.get("isArchive") === "true";
    React.useEffect(() => { //handle view archived data
     
        dispatch(setArchive(paramArchive))
    }, [paramArchive])

    const pathnames = usePathname()
    React.useLayoutEffect(() => {
        if (pathnames == "/") {            
            dispatch(setViewingBoard(""))
            return
        }
        const slug = pathnames.split("/").pop()
        if (slug) {
            if (boards.find(el => el.slug === slug)) {
                dispatch(setViewingBoard(boards.find(el => el.slug === slug)?.id ?? ""))
            }
        }
    }, [pathnames, boards])
    return <>
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="overflow-hidden">
                {children}
            </SidebarInset>
        </SidebarProvider>
        {isOpen("BoardForm") && <CreateBoardForm isCreate={true} />}
        {isOpen("BoardFormEdit") && <CreateBoardForm isCreate={false} />}
        {isOpen("ConfirmDialog") && <ConfirmDialog />}
        {isOpen("TaskForm") && <CreateTaskForm isCreate={true} />}
        {isOpen("TaskFormEdit") && <CreateTaskForm isCreate={false} />}
        {isOpen("TaskView") && <ViewTaskForm />}
        <SettingDialog />
        {isOpen("AccountDialog") && <AccountDialog />}

    </>
}
Layout.displayName = "Layout"
export default Layout