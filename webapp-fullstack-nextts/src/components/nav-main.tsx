"use client"

import { type LucideIcon } from "lucide-react"
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import Link from "next/link"
import useFetchBoard from "@/hooks/use-fetch-board"

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
    <SidebarGroup>
      <SidebarGroupLabel>All board ({boards?.length || 0})</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton className={`${item.isActive ? "bg-primary-300 text-white" : ""} 
                font-medium hover:bg-primary-100 hover:text-primary-300 py-2`} tooltip={item.title}>
              {item.icon && <item.icon />}
              <Link href={item.url} className="flex items-center gap-2 w-full h-full">
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
