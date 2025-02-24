"use client"

import { Archive, ArchiveRestore, BadgeX, Ellipsis, type LucideIcon } from "lucide-react"
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import Link from "next/link"
import useFetchBoard, { useUpdateBoard } from "@/hooks/use-fetch-board"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "./ui/button"
import { useDialog } from "@/hooks/use-dialog"
import React from "react"
import { useSearchParams } from "next/navigation"
export function NavMain({ items }: {
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
  const { boards } = useFetchBoard()
  const { dispatch } = useDialog()
  const updater = useUpdateBoard()

  React.useEffect(() => {
    dispatch({
      type: "SETDATA", payload: {
        name: "ConfirmDialog", data: {
          isLoading: updater.isPending
        }
      }
    })
  }, [updater.isPending])
  const handleArchive = (title: string, slug: string) => {
    dispatch({
      type: "SETDATA", payload: {
        name: "ConfirmDialog", data: {
          title: "Archive this plan?", desc: `Are you sure you want to archive the ‘${title} plan? 
          This action will move this plan to Archive folder!`,
          action: () => updater.mutate({ slug: slug, isArchive: true }),
          actionTitle: 'Archive',
          primaryColor: "#635FC7"
        }
      }
    })
    dispatch({ type: "TOOGLE", payload: { name: "ConfirmDialog", state: true } })
  }
  const handleRestore = (title: string, slug: string) => {
    dispatch({
      type: "SETDATA", payload: {
        name: "ConfirmDialog", data: {
          title: "Restore this plan?", desc: `Are you sure you want to restore the ‘${title} plan? 
          This action will move this plan to dashboard!`,
          action: () => updater.mutate({ slug: slug, isArchive: false }),
          actionTitle: 'Restore',
          primaryColor: "#635FC7"
        }
      }
    })
    dispatch({ type: "TOOGLE", payload: { name: "ConfirmDialog", state: true } })
  }
  const searchParams = useSearchParams();
  const isArchive = searchParams.get("isArchive") === "true";
  return (
    <SidebarGroup className="pt-0">
      <SidebarGroupLabel>{isArchive ? "Archived Plan" : "All Plan"} ({boards?.length || 0})</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton className={`${item.isActive ? "bg-primary-300 text-white" : ""} 
                font-medium hover:bg-primary-100 hover:text-primary-300  flex items-center h-fit`} tooltip={item.title}>
              <Link onClick={() => item.action?.()} href={item.url} className="flex-1 flex items-center gap-2 w-full h-full">
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </Link>
              <Popover>
                <PopoverTrigger><Ellipsis /></PopoverTrigger>
                <PopoverContent className="w-fit px-2 flex flex-col font-semibold">
                  {item.isArchive && <Button onClick={() => handleRestore(item.title, item.slug)} className="bg-white hover:bg-slate-100 text-black"><ArchiveRestore /> Restore Plan</Button>}
                  {!item.isArchive && <Button onClick={() => handleArchive(item.title, item.slug)} className="bg-white hover:bg-slate-100 text-black"><Archive /> Archive Plan</Button>}
                  <Button onClick={() => dispatch({ type: "TOOGLE", payload: { name: "ConfirmDialog", state: true } })} className="text-accent-200 bg-white hover:bg-slate-100"><BadgeX /> Delete Plan</Button>
                </PopoverContent>
              </Popover>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

