"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Settings2,
  SquareTerminal,
  PlusCircleIcon
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathName = usePathname()
  const data = React.useMemo(() => ({
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Platform Launch",
        url: "/",
        icon: SquareTerminal,
        isActive: pathName === "/",
      },
      {
        title: "Marketing Plan",
        url: "/marketing-plan",
        icon: Bot,
        isActive: pathName === "marketing-plan",
      },
      {
        title: "Roadmap",
        url: "/roadmap",
        icon: BookOpen,
        isActive: pathName === "roadmap",

      },
      {
        title: "Create New Plan",
        url: "#",
        icon: PlusCircleIcon,
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings2,
        items: [
          {
            title: "Change Font",
            url: "#",
          },
          {
            title: "Change Theme",
            url: "#",
          },
        ]
      },
    ],

  }), [pathName])
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
