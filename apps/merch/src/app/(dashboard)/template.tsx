"use client";

import { Badge } from "@/components/ui/badge";
import config from "@merch/config/global";
import { AppSidebar } from "@/components/sections/dashboard/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { type LucideIcon, Search, ShoppingCart, User2 } from "lucide-react";
import Footer from "@/components/footer";
import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems: {
  main: { href: string; title: string }[];
  utilities: {
    href: string;
    title: string;
    icon: LucideIcon;
  }[];
} = {
  main: [
    { href: "/shop", title: "shop" },
    { href: "/about", title: "about" },
  ],
  utilities: [
    { href: "/search", title: "search", icon: Search },
    { href: "/carts", title: "carts", icon: ShoppingCart },
    { href: "/login", title: "account", icon: User2 },
  ],
};

function DashboardFooter({ ref }: { ref: React.Ref<HTMLDivElement> }) {
  const { state } = useSidebar();
  const sidebarWidth = state === "expanded" ? "16rem" : "3rem";
  const isMobile = useIsMobile();

  return (
    <div
      className="absolute bottom-0 w-screen bg-black transition-[padding] duration-300"
      style={{ paddingLeft: isMobile ? "0rem" : sidebarWidth }}
      ref={ref}
    >
      <Footer />
    </div>
  );
}

export default function RootTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const navbarRef = useRef<HTMLDivElement>(null);
  const [navbarHeight, setNavbarHeight] = useState(0);

  const footerRef = useRef<HTMLDivElement>(null);
  const [footerHeight, setFooterHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      if (navbarRef.current) {
        setNavbarHeight(navbarRef.current.offsetHeight);
      }
      if (footerRef.current) {
        setFooterHeight(footerRef.current.offsetHeight);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <div
      className="flex min-h-screen w-full flex-col"
      style={
        {
          "--navbar-height": `${navbarHeight}px`,
        } as React.CSSProperties
      }
    >
      {/* Dashboard Navbar */}
      <header
        ref={navbarRef}
        className="fixed top-0 z-50 w-full border-b bg-sidebar mix-blend-difference backdrop-blur backdrop-invert"
      >
        <div className="w-full py-3 md:py-6">
          <div className="navbar-container mx-auto flex w-full items-center justify-between px-8 sm:px-12 md:px-18">
            <div className="flex items-center space-x-12">
              <Link
                href="/"
                className="group my-2 flex h-5 items-center space-x-4"
              >
                <Image
                  src="/static/logos/hackclub-rounded.svg"
                  alt="Hack Club Logo"
                  width={40}
                  height={40}
                  className="size-8 transition-all duration-300 group-hover:scale-110 md:size-9"
                />
                <Separator
                  orientation="vertical"
                  className="mr-2 hidden md:block"
                />
                <div>
                  <p className="-tracking-widest hidden font-inter font-semibold text-[1.25rem] md:block">
                    Hack Club
                  </p>
                  <Image
                    src="/static/typographies/merch.png"
                    alt="Merch Logo"
                    width={100}
                    height={50}
                    className="-ml-3 -mt-1 md:-mt-6 invert md:ml-8"
                  />
                </div>
              </Link>
              <div className="hidden items-center space-x-8 font-mono text-muted-foreground text-sm uppercase *:tracking-widest *:hover:underline sm:flex">
                {navItems.main.map(({ href, title }) => (
                  <Link key={title} href={href} className="uppercase">
                    {title}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-8">
              {navItems.utilities.map(({ href, title, icon: Icon }) => (
                <div key={title} className="relative">
                  <Link
                    href={href}
                    className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <p className="sr-only">{title}</p>
                    <Icon className="size-6" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed navbar */}
      <div style={{ height: `${navbarHeight}px` }} />

      {/* Sidebar + Content */}
      <SidebarProvider className="relative font-inter">
        <AppSidebar />
        <SidebarInset className="flex flex-col">
          <div className="flex items-center gap-2 border-b px-4 py-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-6" />
            <div className="text-muted-foreground text-sm">Dashboard</div>
          </div>

          {/* Page Content */}
          {children}

          {/* Spacer for fixed footer */}
          <div
            style={{
              height: `${footerHeight}px`,
            }}
          />
        </SidebarInset>
        {/* Dashboard Footer - it must be here to achieve the mix blend difference effect. */}
        <DashboardFooter ref={footerRef} />
      </SidebarProvider>

      {config.development && (
        <Badge className="fixed right-4 bottom-4 z-50 border-4 border-amber-300 border-dashed bg-amber-700 px-3 text-base transition">
          Development Mode
        </Badge>
      )}
    </div>
  );
}
