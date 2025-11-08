"use client";

import type * as React from "react";
import {
  Frame,
  LandPlot,
  Map,
  PieChart,
  ShoppingBasket,
  Tent,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const data = {
  navMain: [
    {
      name: "Tent",
      url: "/",
      icon: Tent,
    },
    {
      name: "Catalogs",
      url: "#",
      icon: ShoppingBasket,
    },
    {
      name: "Shipped",
      url: "#",
      icon: LandPlot,
    },
    {
      name: "Explore",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarMenu>
            {data.navMain.map((item) => {
              const isActive =
                item.url === "/"
                  ? pathname === "/"
                  : item.url.startsWith("/") && pathname.startsWith(item.url);

              const Icon = item.icon as React.ComponentType<any>;

              return (
                <SidebarMenuItem key={item.name}>
                  <Link
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "w-full justify-start hover:bg-accent-foreground/10",
                      isActive && "bg-accent-foreground/10",
                    )}
                    href={item.url}
                  >
                    <Icon />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Separator orientation="horizontal" />
        <SidebarTrigger />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
