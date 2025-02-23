"use client"

import { Archive, BadgeX, Ellipsis, type LucideIcon } from "lucide-react"
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import Link from "next/link"
import useFetchBoard from "@/hooks/use-fetch-board"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "./ui/button"
export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
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

  return (
    <SidebarGroup className="pt-0">
      <SidebarGroupLabel>All board ({boards?.length || 0})</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton className={`${item.isActive ? "bg-primary-300 text-white" : ""} 
                font-medium hover:bg-primary-100 hover:text-primary-300  flex items-center h-fit`} tooltip={item.title}>
              <Link onClick={() => item.action?.()} href={item.url} className="flex-1 flex items-center gap-2 w-full h-full py-2">
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </Link>
              <Popover>
                <PopoverTrigger><Ellipsis /></PopoverTrigger>
                <PopoverContent className="w-fit px-2 flex flex-col font-semibold">
                  <Button className="bg-white hover:bg-slate-100 text-black"><Archive /> Archive Plan</Button>
                  <Button className="text-accent-200 bg-white hover:bg-slate-100"><BadgeX /> Delete Plan</Button>
                </PopoverContent>
              </Popover>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

