"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import {
  type LucideIcon,
  Menu,
  Search,
  ShoppingCart,
  User2,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";

const navItems: {
  main: { href: string; title: string }[];
  utilities: {
    href: string;
    title: string;
    icon: LucideIcon;
    hidden?: false | "mobile" | "desktop";
  }[];
} = {
  main: [
    { href: "/shop", title: "shop" },
    { href: "/about", title: "about" },
  ],
  utilities: [
    { href: "/search", title: "search", icon: Search, hidden: "mobile" },
    { href: "/carts", title: "carts", icon: ShoppingCart, hidden: "mobile" },
    { href: "/user", title: "user", icon: User2 },
  ],
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const pathname = usePathname();

  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const headerRef = useRef<HTMLElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    setIsMounted(true);

    const updateHeight = () =>
      setHeaderHeight(headerRef.current?.offsetHeight ?? 0);
    updateHeight();
    window.addEventListener("resize", updateHeight, { passive: true });

    const handleScroll = () => {
      const currentY = window.scrollY || 0;

      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          // if scrolling down and past a small threshold -> hide
          if (currentY > lastScrollY.current && currentY > 50) {
            setVisible(false);
          } else {
            // scrolling up -> show
            setVisible(true);
          }
          lastScrollY.current = currentY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  const transformStyle = visible ? "translateY(0)" : "translateY(-100%)";

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 right-0 left-0 z-50 transform bg-background transition-transform duration-300 will-change-transform"
        style={{
          transform: transformStyle,
          transitionTimingFunction: "cubic-bezier(.22,.9,.22,1)",
        }}
      >
        <a
          href="#view-container"
          className="focus:-translate-x-1/2 sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-1/2 focus:z-50 focus:bg-black focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <div className="w-full py-4 md:py-8">
          <div className="navbar-container mx-auto flex w-full items-center justify-between px-8 transition-[padding] sm:px-12 md:px-18">
            <div className="flex items-center space-x-12">
              <Link
                href={pathname === "/" ? "https://hackclub.com" : "/"}
                className="group my-2 flex h-5 items-center space-x-4"
              >
                <Image
                  src="/static/logos/hackclub-rounded.svg"
                  alt="Hack Club Logo"
                  width={40}
                  height={40}
                  className="size-8 grayscale-100 transition-[filter] duration-300 group-hover:grayscale-0 md:size-9"
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
                    alt="Hack Club Logo"
                    width={100}
                    height={50}
                    className="-mt-1 -ml-3 md:-mt-6 invert-100 transition-[filter] md:ml-8 dark:invert-0"
                  />
                </div>
              </Link>
              <div className="hidden items-center space-x-8 font-mono text-muted-foreground text-sm uppercase *:tracking-widest *:hover:underline sm:flex">
                <Link href="/shop">Shop</Link>
                <Link href="/about">About</Link>
              </div>
            </div>
            <div className="flex items-center space-x-8">
              {isMounted &&
                navItems.utilities.map(
                  ({ href, title, icon: Icon, hidden }) => {
                    const isHidden =
                      (hidden === "mobile" && window.innerWidth < 768) ||
                      (hidden === "desktop" && window.innerWidth >= 768);
                    if (isHidden) return null;
                    return (
                      <div key={title} className="relative">
                        <Link
                          href={href}
                          className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <p className="sr-only">{title}</p>
                          <Icon className="size-6" />
                        </Link>
                      </div>
                    );
                  },
                )}
              <div className="md:hidden">
                <button
                  type="button"
                  onClick={() => setOpen(!open)}
                  className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Menu"
                >
                  <Menu className="size-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div aria-hidden style={{ height: headerHeight }} />
    </>
  );
}
