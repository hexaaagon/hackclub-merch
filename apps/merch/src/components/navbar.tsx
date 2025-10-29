"use client";

import Image from "next/image";
import Link from "next/link";

import { Search, ShoppingCart, User, User2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="w-full px-6 md:py-8">
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
            <Link href="#">Shop</Link>
            <Link href="#">About</Link>
          </div>
        </div>
        <div className="flex items-center space-x-8">
          <Link href="#">
            <Search className="size-6 hover:opacity-80" />
          </Link>
          <Link href="#">
            <ShoppingCart className="size-6 hover:opacity-80" />
          </Link>
          <Link href="#">
            <User2 className="size-6 hover:opacity-80" />
          </Link>
        </div>
      </div>
    </header>
  );
}
