"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";

export function NavigationGestures() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === "/") return;
    let start: { x: number; y: number; edge: "left" | "right" } | null = null;
    const touchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1 || (event.target as Element).closest("input, textarea, select, .leaflet-container")) { start = null; return; }
      const x = event.touches[0].clientX;
      const edge = x <= 34 ? "left" : x >= window.innerWidth - 34 ? "right" : null;
      start = edge ? { x, y: event.touches[0].clientY, edge } : null;
    };
    const touchEnd = (event: TouchEvent) => {
      if (!start || event.changedTouches.length !== 1) return;
      const dx = event.changedTouches[0].clientX - start.x;
      const dy = event.changedTouches[0].clientY - start.y;
      if (Math.abs(dy) < 65 && ((start.edge === "left" && dx > 85) || (start.edge === "right" && dx < -85))) router.push("/");
      start = null;
    };
    window.addEventListener("touchstart", touchStart, { passive: true });
    window.addEventListener("touchend", touchEnd, { passive: true });
    return () => { window.removeEventListener("touchstart", touchStart); window.removeEventListener("touchend", touchEnd); };
  }, [pathname, router]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    let active = true;
    let remove: (() => Promise<void>) | undefined;
    void App.addListener("backButton", () => {
      if (window.location.pathname === "/") void App.minimizeApp();
      else router.push("/");
    }).then((handle) => { if (active) remove = () => handle.remove(); else void handle.remove(); });
    return () => { active = false; void remove?.(); };
  }, [router]);
  return null;
}
