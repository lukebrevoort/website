"use client"

import * as React from "react"
import Link from "next/link"
import dynamic from "next/dynamic"

const Home = dynamic(() => import("lucide-react").then(mod => mod.Home), {
  ssr: false
})

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

export function HomeButton() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          size="lg"
          className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <Link href="/">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Home className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                Luke Brevoort
              </span>
              <span className="truncate text-xs">Home</span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}