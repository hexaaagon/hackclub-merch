import { Button, buttonVariants } from "@/components/ui/button";
import PicsumImage from "@/components/ui/picsum";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <section className="mt-16 flex flex-col items-center justify-center pt-24 pb-32 text-center">
        <Link
          href="https://forms.fillout.com/t/5k2dwE9Lxpus"
          className={cn(
            buttonVariants({
              variant: "outline",
              size: "sm",
            }),
            "mb-4 rounded-full",
          )}
          target="_blank"
          rel="noreferrer"
        >
          🎉 <Separator className="mx-2 h-4" orientation="vertical" />
          Introducing Merch YSWS
          <ChevronRight className="ml-1 size-4 text-muted-foreground" />
        </Link>
        <h1 className="font-phantom font-semibold text-7xl">Ship to Shop.</h1>
        <p className="mt-6 max-w-2xl font-medium text-muted-foreground text-xl">
          Hack Club Merch is here. Build your own projects, get cool swags.
          Browse limited-edition tees, stickers, and accessories designed by the
          community, customize pieces for your club or event, and wear what you
          ship.
        </p>
        <Button className="mt-8 font-inter" size="lg" asChild>
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
        <header>
          <h2 className="text-center font-phantom font-semibold text-5xl">
            Featured Merch
          </h2>
          <p className="mt-2 text-center text-muted-foreground text-xl">
            Explore our curated selection of exclusive Hack Club merchandise.
          </p>
        </header>
        <div className="mx-auto mb-16 flex justify-center px-4">
          <div className="grid grid-cols-4 space-x-5 overflow-hidden">
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
