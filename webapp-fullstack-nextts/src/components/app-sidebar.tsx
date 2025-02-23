"use client"
import * as React from "react"
import { BookOpen, Settings2, PlusCircleIcon } from "lucide-react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { useDialog } from "@/hooks/use-dialog"
import { useSession } from "next-auth/react"
import useFetchBoard from "@/hooks/use-fetch-board"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathName = usePathname()
  const { dispatch } = useDialog()
  const { data: session } = useSession()
  const { boards, isLoading } = useFetchBoard()
  const boardItems = React.useMemo(() => boards?.map((el: Board) => {
    return {
      title: el.title,
      url: `/${el.slug}`,
      icon: BookOpen,
      isActive: pathName === el.slug,

    }
  }) || [], [boards, pathName])
  const data = React.useMemo(() => {

    return {
      user: {
        name: session?.user.name,
        email: session?.user.email,
        avatar: session?.user.avatar ?? "/avatars/shadcn.jpg",
      },
      navMain: [
        ...boardItems,
        {
          title: "Create New Plan",
          url: "#",
          icon: PlusCircleIcon,
          action: () => dispatch({
            type: "TOOGLE", payload: { name: "BoardForm", state: true }
          })
        }
      ],

    }
  }, [boardItems, session])
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent className="bg-white">
        {!isLoading && <NavMain items={data.navMain} />}
        {isLoading && <div className="w-5 h-5 border-t-2 border-l-2 animate-spin border-primary-300 rounded-full mx-auto mt-[50%]"></div>}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
