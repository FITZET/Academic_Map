import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { AcademicMapProvider } from "@/components/data-provider";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = {
  title: "Academic Map — 本地研究者地图",
  description: "本地保存的研究者地图、标签与互动记录",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <AcademicMapProvider>
          <AppShell>{children}</AppShell>
        </AcademicMapProvider>
      </body>
    </html>
  );
}
