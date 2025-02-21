"use client"

import * as React from "react"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"

export function TeamSwitcher() {


  return (
    <SidebarMenu>
      <SidebarMenuItem>

        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white text-sidebar-primary-foreground">
            <Image width={24} height={24} alt="logo" src={"/assets/new_logo.svg"}></Image>

          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-extrabold heading-xl">
              KANBAN
            </span>
            <span className="truncate text-xs">Plan your feature</span>
          </div>
          {/* <ChevronsUpDown className="ml-auto" /> */}
        </SidebarMenuButton>

      </SidebarMenuItem>
    </SidebarMenu>
  )
}
