"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/ui/sidebar"
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
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton className={`${item.isActive ? "bg-primary-300 text-white" : ""}`} tooltip={item.title}>
                  {item.url != "#" && <Link href={item.url} className="flex items-center gap-2 w-full h-full"> {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>}
                  {item.url == "#" && <>
                    {item.icon && <item.icon />}
                    <span className="w-full" onClick={item.action}>{item.title}</span>
                    {
                      item.items && item.items.length > 0 &&
                      <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    }
                  </>
                  }

                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <>
                          {item.url != "#" &&
                            <Link href={subItem.url}>
                              <span className="text-sm">{subItem.title}</span>
                            </Link>
                          }
                          {item.url == "#" &&
                            <span onClick={() => item.action?.()}>
                              <span className="text-sm">{subItem.title}</span>
                            </span>
                          }
                        </>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
