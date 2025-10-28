import Image from "next/image";
import { BackgroundPattern } from "@/components/ui/background-pattern";

export default function Home() {
  return (
    <div className="flex h-full min-h-screen w-screen flex-col items-center justify-center bg-[#171513] bg-gradient-to-br from-neutral-600/0 via-neutral-600/20 to-black p-8 lg:p-40">
      <BackgroundPattern />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-4">
            <Image
              src="/static/vector/loafy.svg"
              alt="Loafy Logo"
              width={31}
              height={24}
              className="text-white"
            />
            <div className="h-4 w-px bg-white"></div>
            <h1 className="font-grotesque font-normal text-2xl text-white">
              Loafy
            </h1>
          </div>
          <p className="font-mono text-base text-white">
            next.js template - v1.0.0
          </p>
        </div>

        {/* Main content card */}
        <div className="relative flex w-full max-w-4xl flex-col items-center gap-10 rounded-3xl border border-[#29241F] bg-[#0C0A09] bg-gradient-to-br from-white/0 via-white/5 to-black p-16">
          {/* Background pattern for card */}
          <div
            className="absolute inset-0 rounded-3xl bg-repeat opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm-30 0c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10-10-4.477-10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "203% 203%",
              backgroundPosition: "center center",
            }}
          ></div>

          <div className="relative z-10 flex flex-col items-center gap-10">
            <p className="text-center font-mono text-2xl text-white">
              Get started by editing{" "}
              <span className="text-blue-700">src/app/page.tsx</span>
            </p>

            {/* Bauhaus design */}
            <div className="relative">
              <Image
                src="/static/vector/bauhaus.svg"
                alt="Bauhaus Design"
                width={500}
                height={200}
                className="h-auto max-w-full"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
