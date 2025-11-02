"use client";
import Link from "next/link";
import { useState } from "react";

import { ArrowRight, Mail } from "lucide-react";
import { HoleBackground } from "@/components/backgrounds/hole";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Footer() {
  const [rsvpEmail, setRsvpEmail] = useState("");

  return (
    <footer className="w-full bg-inner pt-6 text-center text-inner-foreground text-sm">
      <header className="footer-container mx-auto flex w-full items-center justify-between px-4 text-muted-foreground">
        <div className="flex items-center space-x-4 font-mono *:text-xs *:uppercase sm:space-x-8">
          <Link href="/accessories">accessories</Link>
          <Link href="/apparel">apparel</Link>
          <Link href="/collections">collections</Link>
        </div>
        <div className="flex items-center space-x-4 font-mono *:text-xs *:uppercase sm:space-x-8">
          <Link
            href="https://hackclub.slack.com/archives/C09JQFECCBG"
            target="_blank"
            rel="noopener noreferrer"
          >
            #merch
          </Link>
          <Link
            href="https://forms.fillout.com/t/5k2dwE9Lxpus"
            target="_blank"
            rel="noopener noreferrer"
          >
            rsvp
          </Link>
        </div>
      </header>
      <section className="relative mx-auto h-[10rem] w-[75vw] max-w-[100rem] sm:h-[15rem] lg:h-[20rem] lg:h-[30rem]">
        <HoleBackground className="flex h-full w-full items-center justify-center rounded-xl" />
        <div className="absolute top-0 right-0 left-0 z-10 h-1/4 w-full bg-linear-to-b from-inner to-transparent" />
        <div className="absolute top-0 bottom-0 left-0 z-10 h-full w-1/4 bg-linear-to-r from-inner to-transparent" />
        <div className="absolute top-0 right-0 bottom-0 z-10 h-full w-1/4 bg-linear-to-r from-transparent to-inner" />
      </section>
      <section className="bg-primary pt-8 pb-12 text-muted-foreground">
        <div className="footer-end-container mx-auto flex w-full flex-col items-center justify-between gap-8 lg:flex-row lg:gap-0">
          <div className="my-auto space-y-3 font-inter">
            <div className="flex items-center space-x-2.5">
              <Mail size={16} />
              <p className="text-inner-foreground">
                RSVP Now to make this YSWS happened!
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-2.5 md:space-y-0">
              <Input
                type="email"
                placeholder="Your email address"
                className="min-w-80 border-inner-input bg-inner-input/30 font-mono text-inner-foreground"
                value={rsvpEmail}
                onChange={(e) => setRsvpEmail(e.target.value)}
              />
              <Button
                className="w-full bg-inner-primary px-8 font-medium text-inner-primary-foreground hover:bg-inner-primary/90 md:w-auto"
                onClick={() => {
                  if (!rsvpEmail) {
                    window.open(
                      `https://forms.fillout.com/t/5k2dwE9Lxpus`,
                      "_blank",
                    );
                    return;
                  }
                  if (!rsvpEmail.includes("@")) {
                    alert("Please enter a valid email address.");
                    return;
                  }

                  window.open(
                    `https://forms.fillout.com/t/5k2dwE9Lxpus?email=${encodeURIComponent(rsvpEmail)}`,
                    "_blank",
                  );
                }}
              >
                RSVP
                <ArrowRight />
              </Button>
            </div>
          </div>
          <div className="space-y-1.5 text-center text-xs lg:text-right">
            <Link
              href="https://hackclub.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/static/logos/hackclub-flag.svg"
                alt="Hack Club Logo"
                width={90}
                height={60}
                className="mb-2 inline-block"
              />
            </Link>
            <div className="space-y-1">
              <p>Made with ❤️ by teenagers at Hack Club.</p>
              <p className="text-2xs leading-3">
                This website is available on{" "}
                <Link
                  href={`https://github.com/${process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER || "hexaaagon"}/${process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG || "hackclub-merch"}`}
                  className="underline transition-colors hover:text-inner-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Github
                </Link>{" "}
                {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA && (
                  <>
                    <Link
                      href={`https://github.com/${process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER}/${process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG}/commit/${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA}`}
                      className="underline transition-colors hover:text-inner-primary"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      (
                      {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(
                        0,
                        7,
                      )}
                      )
                    </Link>{" "}
                  </>
                )}
                as open-source.
              </p>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}
