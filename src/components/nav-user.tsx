"use client"

import {
  Github,
  Radio,
  ChevronsUpDown,
  Linkedin,
  LogOut,
  Sparkles,
  Users,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"

export function NavUser({
  user,
  teams = [],
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
  teams?: Array<{
    name: string
    logo: any
    plan: string
    url?: string
  }>
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {teams.length > 0 && (
              <>
                <DropdownMenuLabel>Teams</DropdownMenuLabel>
                <DropdownMenuGroup>
                  {teams.map((team) => (
                    <DropdownMenuItem 
                      key={team.name}
                      onClick={() => team.url && router.push(team.url)}
                      className="cursor-pointer"
                    >
                      <div className="mr-2 flex h-5 w-5 items-center justify-center">
                        {team.logo && <team.logo className="h-4 w-4" />}
                      </div>
                      <a href="/about" className="flex flex-1 items-center justify-between">
                        <span>{team.name}</span>
                        <span className="ml-2 text-xs text-muted-foreground">{team.plan}</span>
                      </a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
              </>
            )}
            
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <div>
                  <Sparkles className="mr-2" />
                  Contact
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <a href="https://github.com/lukebrevoort" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2" />
                  Github
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="https://www.linkedin.com/in/luke-brevoort-6a545626a/" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="mr-2" />
                  Linkedin
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="https://bsky.app/profile/luke-brev.bsky.social" target="_blank" rel="noopener noreferrer">
                  <Radio className="mr-2" />
                  Bluesky
                </a>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}