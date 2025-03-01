"use client"

import { Archive, ArchiveRestore, BadgeX, Ellipsis, type LucideIcon } from "lucide-react"
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import Link from "next/link"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "./ui/button"
import { useDialog } from "@/hooks/use-dialog"
import React from "react"
import { useArchiveBoardMutation, useDeleteBoardMutation, useUpdateBoardMutation } from "@/redux/actions/boardAPI"
import { useAppCoordinator } from "@/hooks/useCoordinator"
function NavMain({ items }: {
  items: {
    id: string,
    title: string
    url: string
    slug: string
    isArchive: boolean,
    icon?: LucideIcon
    isActive?: boolean
    action?: () => void
    items?: {
      title: string
      url: string,
      action?: () => void
    }[]
  }[]
}) {
  const { boards, isArchive, dispatch: coordinatorAction, setViewingBoard } = useAppCoordinator()
  const { dispatch } = useDialog()
  const [updater, { isLoading: updaterLoading }] = useArchiveBoardMutation();
  const [deleter, { isLoading: deleterLoading }] = useDeleteBoardMutation();
  React.useEffect(() => {
    dispatch({
      type: "SETDATA", payload: {
        name: "ConfirmDialog", data: {
          isLoading: updaterLoading
        }
      }
    })
  }, [updaterLoading])
  React.useEffect(() => {
    dispatch({
      type: "SETDATA", payload: {
        name: "ConfirmDialog", data: {
          isLoading: deleterLoading
        }
      }
    })
  }, [deleterLoading])
  const handleArchive = (title: string, id: string) => {
    dispatch({
      type: "SETDATA", payload: {
        name: "ConfirmDialog", data: {
          title: "Archive this plan?", desc: `Are you sure you want to archive the ‘${title} plan? 
          This action will move this plan to Archive folder!`,
          action: () => updater({ id: id, isArchive: true }),
          actionTitle: 'Archive',
          primaryColor: "#635FC7"
        }
      }
    })
    dispatch({ type: "TOOGLE", payload: { name: "ConfirmDialog", state: true } })
  }
  const handleRestore = (title: string, id: string) => {
    dispatch({
      type: "SETDATA", payload: {
        name: "ConfirmDialog", data: {
          title: "Restore this plan?", desc: `Are you sure you want to restore the ‘${title} plan? 
          This action will move this plan to dashboard!`,
          action: () => updater({ id: id, isArchive: false }),
          actionTitle: 'Restore',
          primaryColor: "#635FC7"
        }
      }
    })
    dispatch({ type: "TOOGLE", payload: { name: "ConfirmDialog", state: true } })
  }
  const handleDelete = (title: string, id: string) => {
    dispatch({
      type: "SETDATA", payload: {
        name: "ConfirmDialog", data: {
          title: "Delete this plan?",
          desc: `Are you sure you want to delete the ‘${title} plan? 
          This action will remove this plan forever!`,
          action: () => { deleter({ id: id }); dispatch({ type: "TOOGLE", payload: { name: "ConfirmDialog", state: false } }) },
          actionTitle: 'Delete',
          primaryColor: "#EA5555"
        }
      }
    })
    dispatch({ type: "TOOGLE", payload: { name: "ConfirmDialog", state: true } })
  }

  return (
    <SidebarGroup className="pt-0">
      <SidebarGroupLabel>{isArchive ? "Archived Plan" : "All Plan"} ({boards?.length || 0})</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton className={`${item.isActive ? "bg-primary-300 text-white" : ""} 
                font-medium hover:bg-primary-100 hover:text-primary-300  flex items-center h-fit`} tooltip={item.title}>
              {item.icon && <item.icon />}
              <Link onClick={() => coordinatorAction(setViewingBoard(item.id))} href={item.url} className="flex-1 flex items-center gap-2 w-full h-full">
                <span>{item.title}</span>
              </Link>
              <Popover>
                <PopoverTrigger><Ellipsis /></PopoverTrigger>
                <PopoverContent className="w-fit px-2 flex flex-col items-start font-semibold">
                  {item.isArchive && <Button onClick={() => handleRestore(item.title, item.id)} className="bg-white dark:bg-inherit w-full justify-start hover:bg-slate-100 text-black dark:text-inherit"><ArchiveRestore /> Restore Plan</Button>}
                  {!item.isArchive && <Button onClick={() => handleArchive(item.title, item.id)} className="bg-white dark:bg-inherit w-full justify-start hover:bg-slate-100 text-black dark:text-inherit"><Archive /> Archive Plan</Button>}
                  <Button onClick={() => handleDelete(item.title, item.id)} className="text-accent-200 bg-white dark:bg-inherit w-full justify-start hover:bg-slate-100"><BadgeX /> Delete Plan</Button>
                </PopoverContent>
              </Popover>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup >
  )
}
export default React.memo(NavMain)
