"use client"
import * as React from "react"
import { BookOpen, PlusCircleIcon } from "lucide-react"
import NavMain from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { useDialog } from "@/hooks/use-dialog"
import { useSession } from "next-auth/react"
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import Link from "next/link"
import { useAppCoordinator } from "@/hooks/useCoordinator"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { dispatch } = useDialog()
  const { data: session } = useSession()
  const { boards, viewingBoardId } = useAppCoordinator()

  const boardItems = React.useMemo(() => boards?.map((el: Board) => {
    return {
      title: el.title,
      url: `/board/${el.slug}`,
      slug: el.slug,
      icon: BookOpen,
      isArchive: el.isArchive,
      isActive: el.id == viewingBoardId,
      id : el.id

    }
  }) || [], [boards, viewingBoardId])
  const data = React.useMemo(() => {

    return {
      user: {
        name: session?.user.name,
        email: session?.user.email,
        avatar: session?.user.avatar ?? "/avatars/shadcn.jpg",
      },
      navMain: [
        ...boardItems,
      ],

    }
  }, [boardItems, session])

  return (
    <Sidebar className="side" collapsible="icon" {...props}>
      <SidebarHeader>
        <Link href={"/"} >
          <TeamSwitcher />
        </Link>
      </SidebarHeader>
      <SidebarContent className="">
        <SidebarGroup className="pb-0">
          <SidebarMenu>
            <SidebarMenuItem >
              <SidebarMenuButton onClick={() => dispatch({
                type: "TOOGLE", payload: { name: "BoardForm", state: true }
              })} className="font-medium hover:bg-primary-100 hover:text-primary-300 py-6" tooltip="Create New Plan">
                <PlusCircleIcon />
                Create New Plan
              </SidebarMenuButton>
            </SidebarMenuItem>

          </SidebarMenu>
        </SidebarGroup>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
