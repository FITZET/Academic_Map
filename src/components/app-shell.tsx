"use client";

import Link from "next/link";
import { Globe2, LockKeyhole } from "lucide-react";
import { UpdateChecker } from "./update-checker";

export function AppShell({ children }: { children: React.ReactNode }) {
  return <div className="minimal-shell">
    <UpdateChecker />
    <header className="minimal-header">
      <Link href="/" className="minimal-brand" aria-label="Academic Map 首页"><Globe2 size={20} /><span>Academic Map</span></Link>
      <span className="local-badge"><LockKeyhole size={13} />仅存储在本机</span>
    </header>
    <main className="minimal-content">{children}</main>
  </div>;
}
