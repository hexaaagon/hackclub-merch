"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  type LucideIcon,
  Menu,
  Search,
  ShoppingCart,
  User2,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
    { href: "/login", title: "account", icon: User2 },
  ],
};

export default function Navbar({
  ref,
}: {
  ref: React.RefObject<HTMLElement | null>;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setIsMounted(true);

    const updateHeight = () => setHeaderHeight(ref.current?.offsetHeight ?? 0);
    updateHeight();
    window.addEventListener("resize", updateHeight, { passive: true });

    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  return (
    <>
      <header
        ref={ref}
        className="fixed top-0 z-50 w-full border-b bg-sidebar mix-blend-difference backdrop-blur backdrop-invert"
      >
        <div className="w-full py-4">
          <div className="mx-auto flex w-full items-center justify-between px-6">
            <div className="flex items-center space-x-12">
              <Link
                href="/"
                className="group my-2 flex h-5 items-center space-x-4"
              >
                <Image
                  src="/static/images/logos/hackclub-rounded.svg"
                  alt="Hack Club Logo"
                  width={32}
                  height={32}
                  className="size-8 transition-all duration-300 group-hover:scale-110"
                />
                <Separator
                  orientation="vertical"
                  className="mr-2 hidden md:block"
                />
                <div>
                  <p className="-tracking-widest hidden font-inter font-semibold text-[1rem] md:block">
                    Hack Club
                  </p>
                  <Image
                    src="/static/images/typographies/merch.png"
                    alt="Merch Logo"
                    width={100 * 0.75}
                    height={50 * 0.75}
                    className="-ml-3 -mt-1 md:-mt-4.5 invert md:ml-8"
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
            <div className="flex items-center space-x-5">
              {navItems.utilities.map(({ href, title, icon: Icon }) => (
                <div key={title} className="relative">
                  <Link
                    href={href}
                    className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <p className="sr-only">{title}</p>
                    <Icon className="size-5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>
      <div aria-hidden style={{ height: isMounted ? headerHeight : "100px" }} />
    </>
  );
}
