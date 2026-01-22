"use client"

import * as React from "react"
import {
  BookOpenIcon,
  FolderArchiveIcon,
  House,
} from "lucide-react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavUser } from "@/components/sidebar/nav-user"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const navMain = [
  {
    title: "Início",
    url: "/dashboard",
    icon: House,
    isActive: true,
  },
  {
    title: "Coleções",
    url: "/dashboard/collections",
    icon: FolderArchiveIcon,
    isActive: false,
  },
  {
    title: "Questões",
    url: "/dashboard/questions",
    icon: BookOpenIcon,
    isActive: false,
  },
]

export function AppSidebar({ user, ...props }: React.ComponentProps<typeof Sidebar> & { user: { name: string, email: string, avatar: string } }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavUser user={user} />
      </SidebarHeader>

      <Separator/>

      <SidebarContent>
        <NavMain label="Menu" items={navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
