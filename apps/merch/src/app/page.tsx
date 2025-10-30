import { Button, buttonVariants } from "@/components/ui/button";
import PicsumImage from "@/components/ui/picsum";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <section className="mt-12 flex flex-col justify-center pb-12 pl-6 sm:mt-16 sm:items-center sm:pt-24 sm:pb-32 sm:pl-0 sm:text-center">
        <Link
          href="https://forms.fillout.com/t/5k2dwE9Lxpus"
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
        <h1 className="font-medium font-phantom text-5xl [-webkit-text-stroke:1.5px] sm:font-semibold sm:text-6xl md:text-7xl sm:[-webkit-text-stroke:0px]">
          Ship to Shop.
        </h1>
        <p className="mt-6 max-w-2xl font-medium text-lg text-muted-foreground sm:mx-4 md:text-xl">
          Hack Club Merch is here. Build your own projects, get cool swags.
          <b className="hidden font-normal sm:block">
            Browse limited-edition tees, stickers, and accessories designed by
            the community, customize pieces for your club or event, and wear
            what you ship.
          </b>
        </p>
        <Button className="mt-8 w-min font-inter" size="lg" asChild>
          <Link
            href="https://forms.fillout.com/t/5k2dwE9Lxpus"
            target="_blank"
            rel="noreferrer"
          >
            RSVP Now <ChevronRight />
          </Link>
        </Button>
      </section>
      <section className="space-y-8">
        <header className="space-y-2 pl-6">
          <h2 className="max-w-3/4 font-medium font-phantom text-4xl [-webkit-text-stroke:1px] sm:max-w-none sm:text-center sm:font-semibold sm:text-5xl sm:[-webkit-text-stroke:0px]">
            Hack Clubbers' Picks
          </h2>
          <p className="text-muted-foreground text-xl sm:text-center">
            Explore our curated selection of exclusive Hack Club merchandise.
          </p>
        </header>
        <div className="mx-auto mb-16 flex justify-center px-6">
          <div className="grid grid-cols-1 space-y-5 overflow-hidden md:grid-cols-4 md:space-x-5 md:space-y-0">
            <PicsumImage sizes={[400, 500]} alt="Example merch banner" />
            <PicsumImage sizes={[400, 500]} alt="Example merch banner" />
            <PicsumImage sizes={[400, 500]} alt="Example merch banner" />
            <PicsumImage sizes={[400, 500]} alt="Example merch banner" />
          </div>
        </div>
      </section>
    </main>
  );
}
