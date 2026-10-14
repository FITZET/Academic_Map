import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { AcademicMapProvider } from "@/components/data-provider";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = {
  title: "Academic Atlas — 个人学术地图",
  description: "地图化的个人学术知识库、论文追踪与学术人脉管理工具",
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
