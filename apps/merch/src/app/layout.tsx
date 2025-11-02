import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  DM_Sans,
  Geist_Mono,
  Inter,
} from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const grotesque = Bricolage_Grotesque({
  variable: "--font-grotesque",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const phantom = localFont({
  variable: "--font-phantom",
  src: [
    {
      path: "../../public/static/fonts/phantom/Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/static/fonts/phantom/Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/static/fonts/phantom/Italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  display: "swap",
});

const fonts = [dmSans, inter, geistMono, grotesque, phantom];

export const metadata: Metadata = {
  title: "Hack Club Merch",
  description: "Merch YSWS - Hack Club",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body
        className={cn(
          fonts.map((font) => font.variable).join(" "),
          "min-h-screen overflow-x-hidden antialiased",
        )}
      >
        {children}
      </body>
    </html>
  );
}
