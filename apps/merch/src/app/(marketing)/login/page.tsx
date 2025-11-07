"use client";
import { authClient } from "@merch/auth";

import { SiSlack } from "@icons-pack/react-simple-icons";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import PicsumImage from "@/components/ui/picsum";

export default function LoginPage() {
  return (
    <main
      id="view-container"
      className="mx-auto mb-8 flex min-h-[calc(100vh-8rem)] w-screen max-w-7xl flex-col items-center space-y-10 py-10 font-inter md:py-20 lg:flex-row lg:space-y-0"
    >
      <div className="w-full max-w-md px-4">
        <Card className="border-none shadow-none">
          <CardHeader className="-space-y-1 pb-2">
            <CardTitle className="font-bold text-4xl tracking-tight">
              Welcome back!
            </CardTitle>
            <CardDescription className="text-base leading-5">
              If you don't have a Merch account, we'll make one for you
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Button
              className="h-12 w-full border-none"
              onClick={() => {
                authClient.signIn.social({
                  provider: "slack",
                });
              }}
            >
              <SiSlack className="h-5 w-5" /> Log in with Hack Club Slack
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span>or</span>
              </div>
            </div>
            <div className="relative">
              <div className="-translate-x-1/2 absolute top-0 left-1/2 z-10 h-full translate-y-1/2">
                <div className="rotate-3 rounded-md border bg-background px-3 py-1 text-center font-medium text-xs">
                  feature not implemented yet
                </div>
              </div>

              <div className="pointer-events-none mt-6 space-y-6 rounded-md border-4 border-dashed p-4 blur-[2px]">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="font-medium text-sm">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="hexaa@hackclub.app"
                      className="h-12 border-none bg-muted"
                    />
                  </div>
                </div>

                <Button className="h-10 w-full">
                  <Sparkles /> Send Magic Link
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex w-full items-center justify-center lg:justify-end">
        <PicsumImage
          className="object-contain"
          alt="Orpheus and others taking a selfie photo (lorem ipsum)"
          sizes={[600, 800]}
        />
      </div>
    </main>
  );
}
