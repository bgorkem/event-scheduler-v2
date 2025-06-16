import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "EventSchedule - Never miss another session",
  description: "Browse, filter, and schedule conference sessions with ease. Smart AI parsing for conference schedules.",
  keywords: ["conference", "events", "scheduling", "sessions", "calendar"],
};

export default function RootLayout({
  children,
}: Readonly<PropsWithChildren>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
