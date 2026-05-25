"use client";

import { Home, ChevronRight, Package, Users, Building2, TrendingUp, FileText,ScrollText, Cpu, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useCurrentUser } from "@/context/UserContext";
import { getInitials } from "@/lib/common";

const ReqtifyLogo = () => (
  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-rose-100 to-violet-100 border border-rose-200/60 shrink-0">
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-rose-500" aria-hidden="true">
      <path
        d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  </div>
);

const mainNavItems = [
  { title: "Dashboard", icon: Home, href: "/dashboard" },
   {
    title: "Client Brief",
    icon: FileText,
    href: "/client-brief",
  },
  {
    title: "Component Build",
    icon: Cpu,
    href: "/component",
  },
  {
    title: "Proposal",
    icon: ScrollText,
    href: "/proposal",
  },
];

const secondaryNavItems = [
  { title: "Products", icon: Package, href: "/resources/products" },
  { title: "Team", icon: Users, href: "/resources/team" },
  { title: "Company Resources", icon: Building2, href: "/resources/company" },
  { title: "Past Sales", icon: TrendingUp, href: "/resources/past-sales" },
];

const controlGroup = [
    {
        title: "Observability",
        icon: Settings, 
        href: "/observability",
    }
]

export function AppSidebar() {
  const pathName = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const {user, isLoading} = useCurrentUser();


  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip="Reqtify">
              <Link href="/">
                <ReqtifyLogo />
                {!isCollapsed && (
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">
                      Req<span className="text-rose-400">tify</span>
                    </span>
                    <span className="text-xs text-muted-foreground">Sales Engineer</span>
                  </div>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathName === item.href}
                    tooltip={item.title}
                    className="hover:bg-primary/10 hover:text-primary data-[active=true]:bg-primary/15 data-[active=true]:text-primary"
                  >
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="mx-3 w-auto bg-sidebar-border" />

        <SidebarGroup>
          <SidebarGroupLabel>Resources</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathName === item.href}
                    tooltip={item.title}
                    className="hover:bg-primary/10 hover:text-primary data-[active=true]:bg-primary/15 data-[active=true]:text-primary"
                  >
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

         <Separator className="mx-3 w-auto bg-sidebar-border" />

          <SidebarGroup>
          <SidebarGroupLabel>Control</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {controlGroup.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathName === item.href}
                    tooltip={item.title}
                    className="hover:bg-primary/10 hover:text-primary data-[active=true]:bg-primary/15 data-[active=true]:text-primary"
                  >
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>



      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="John Doe">
              <Avatar className="size-8">
                <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                <AvatarFallback className="bg-primary/20 text-primary text-xs">
                  {user?.full_name ? getInitials(user.full_name): "JD"}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <>
                  <div className="flex flex-1 flex-col gap-0.5 leading-none">
                    <span className="font-medium text-sm">{user?.full_name}</span>
                    <span className="text-xs text-muted-foreground">{user?.email}</span>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
