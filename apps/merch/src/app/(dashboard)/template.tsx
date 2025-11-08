"use client";

import config from "@merch/config/global";
import { useEffect, useRef, useState } from "react";

import { useIsMobile } from "@/hooks/use-mobile";
import { AppSidebar } from "@/components/sections/dashboard/app-sidebar";
import Navbar from "@/components/sections/dashboard/navbar";

import { Badge } from "@/components/ui/badge";
import Footer from "@/components/footer";
import {
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";

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
      <Navbar ref={navbarRef} />
      <SidebarProvider className="relative">
        <AppSidebar className="font-inter" />
        <SidebarInset className="flex flex-col">
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

      {config.preview && (
        <Badge className="fixed right-4 bottom-4 z-50 border-4 border-amber-300 border-dashed bg-amber-700 px-3 text-base transition">
          Preview
        </Badge>
      )}
    </div>
  );
}
