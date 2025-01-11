import "~/styles/globals.css";

import { Space_Mono } from "next/font/google"
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { cn } from "~/lib/utils";

const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"] })

export const metadata: Metadata = {
  title: "Hack Level Game",
  description: "Social Media Analytics for Hack Level Game",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={cn(spaceMono.className, "bg-white text-black")}>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
