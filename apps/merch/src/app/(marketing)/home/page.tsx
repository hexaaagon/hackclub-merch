import Link from "next/link";

import { cn } from "@/lib/utils";

import { ChevronRight } from "lucide-react";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { buttonVariants } from "@/components/ui/button";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Separator } from "@/components/ui/separator";
import { VideoScrollAnimation } from "@/components/video-scroll-animation";
import { StarsBackground } from "@/components/backgrounds/stars";
import Image from "next/image";

export default function HomePage() {
  return (
    <main id="view-container">
      <BackgroundRippleEffect />
      <section className="mt-12 flex flex-col justify-center pb-12 pl-6 *:z-10 sm:mt-16 sm:items-center sm:pt-24 sm:pb-32 sm:pl-0 sm:text-center">
        <Link
          href="https://hackclub.slack.com/archives/C09JQFECCBG"
          className={cn(
            buttonVariants({
              variant: "outline",
              size: "sm",
            }),
            "mb-4 w-min rounded-full",
          )}
          target="_blank"
          rel="noreferrer"
        >
          🎉 <Separator className="mx-2 h-4" orientation="vertical" />
          Introducing Merch YSWS
          <ChevronRight className="ml-1 size-4 text-muted-foreground" />
        </Link>
        <h1 className="bg-linear-to-b from-foreground to-foreground/70 bg-clip-text font-medium font-phantom text-5xl text-transparent [-webkit-text-stroke:1.5px] sm:font-semibold sm:text-6xl md:text-7xl sm:[-webkit-text-stroke:0px]">
          Ship to Shop.
        </h1>
        <p className="mt-6 max-w-7/8 font-medium text-lg text-muted-foreground sm:mx-4 sm:max-w-2xl md:text-xl">
          Hack Club Merch is here. Build your own projects, get cool swags.
          <b className="hidden font-normal sm:block">
            Browse limited-edition tees, stickers, and accessories designed by
            the community, customize pieces from your journey, and wear what you
            ship.
          </b>
        </p>
        <RainbowButton className="mt-8 w-min font-inter" size="lg" asChild>
          <Link
            href="https://forms.fillout.com/t/5k2dwE9Lxpus"
            target="_blank"
            rel="noreferrer"
          >
            RSVP Now <ChevronRight />
          </Link>
        </RainbowButton>
      </section>

      {/* Video Scroll Animation Section */}
      <VideoScrollAnimation className="relative" />

      {/* Black section for video end transition */}
      <section className="-mt-[2vh] relative flex flex-col justify-center space-y-8 bg-inner pt-[10vh] pb-[20vh] text-inner-foreground">
        <div className="absolute top-0 right-0 left-0 h-64 w-full bg-linear-to-b from-black to-inner"></div>
        <div className="z-10 mx-4 space-y-4 md:mx-0">
          <h2 className="max-w-7/8 font-inter font-medium text-3xl [-webkit-text-stroke:1px] sm:max-w-none sm:text-center sm:font-semibold sm:text-5xl md:text-4xl sm:[-webkit-text-stroke:0px]">
            Hack Club{" "}
            <b className="font-bold italic underline">Faves & Raves</b>
          </h2>
          <p className="sm:text-center sm:text-xl">
            Explore our curated selection of exclusive Hack Club merchandise.
          </p>
        </div>
        <div className="z-10 mx-auto mt-2 flex justify-center px-6">
          <div className="grid grid-cols-1 space-y-10 overflow-hidden md:space-x-5 lg:grid-cols-3 lg:space-y-0">
            <div className="flex flex-col">
              <Image
                src="/static/catalogs/orpheus-pet.jpg"
                width={500 * 0.75}
                height={625 * 0.75}
                alt="Orpheus"
                className="rounded-xl"
              />
              <p className="mt-3 font-bold text-2xl">Orpheus</p>
              <p className="font-inter text-inner-accent-foreground text-xs tracking-wide">
                12 hours of coding
              </p>
            </div>
            <div className="flex flex-col">
              <Image
                src="/static/catalogs/family-reunion.jpg"
                width={500 * 0.75}
                height={625 * 0.75}
                alt="Orpheus"
                className="rounded-xl"
              />
              <p className="mt-3 font-bold text-2xl">Family Reunion</p>
              <p className="font-inter text-inner-accent-foreground text-xs tracking-wide">
                15 hours of coding
              </p>
            </div>
            <div className="flex flex-col">
              <Image
                src="/static/catalogs/daydream.jpg"
                width={500 * 0.75}
                height={625 * 0.75}
                alt="Daydream Shirt"
                className="rounded-xl"
              />
              <p className="mt-3 font-bold text-2xl">
                Daydream Merch (Leftover)
              </p>
              <p className="font-inter text-inner-accent-foreground text-xs tracking-wide">
                8 hours of coding
              </p>
            </div>
          </div>
        </div>
        <p className="absolute right-0 bottom-4 left-0 mx-auto w-[90vw] text-center text-inner-foreground/60 text-xs sm:text-sm md:text-base">
          * All product names, prices, and availability are subject to change
          and may be modified or removed in the future.
        </p>
      </section>

      <section className="relative flex justify-center py-24">
        <StarsBackground
          className="-z-10 absolute inset-0 flex items-center justify-center bg-[radial-gradient(ellipse_at_bottom,_#f5f5f5_0%,_#fff_100%)]"
          starColor="#000000"
        />
        <div className="space-y-6 px-6 text-center">
          <h2 className="font-inter font-semibold text-5xl md:text-6xl">
            Your story <b className="font-bold italic underline">awaits</b>.
          </h2>
          <p className="mx-auto max-w-2xl text-xl">
            Join{" "}
            <Link
              href="https://hackclub.slack.com/archives/C09JQFECCBG"
              className="underline"
              target="_blank"
              rel="noreferrer"
            >
              #merch
            </Link>{" "}
            on Slack and start sharing your projects — RSVP now to help make
            Hack Club Merch happen!
          </p>
        </div>
      </section>
    </main>
  );
}
