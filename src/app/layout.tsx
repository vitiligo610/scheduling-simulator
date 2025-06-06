import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/providers/store-provider";
import React from "react";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://orchestrator-vitiligo.vercel.app"),
  title: "Orchestrator - Process Scheduling Simulator",
  description: "Orchestrator is a web app for simulating process scheduling. Add processes, apply different algorithms, and see how they manage tasks.",
  openGraph: {
    title: "Orchestrator - Process Scheduling Simulator",
    description: "Orchestrator is a web app for simulating process scheduling. Add processes, apply different algorithms, and see how they manage tasks.",
    images: "/opengraph-image.png",
  },
};

const RootLayout = ({ children }: Readonly<{
  children: React.ReactNode;
}>) => (
  <html lang="en" suppressHydrationWarning>
  <body
    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
  >
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    <StoreProvider>
      {children}
    </StoreProvider>
  </ThemeProvider>
  <Toaster />
  </body>
  </html>
);

export default RootLayout;
