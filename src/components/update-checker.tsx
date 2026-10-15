"use client";

import { useEffect, useState } from "react";
import { Download, RefreshCw, X } from "lucide-react";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { APP_VERSION, compareVersions, GITHUB_REPOSITORY, RELEASES_URL } from "@/lib/version";

type ReleaseInfo = {
  tag_name: string;
  html_url: string;
  name?: string;
  assets?: Array<{ name: string; browser_download_url: string }>;
};

const LAST_CHECK_KEY = `academic-atlas-update-check-${APP_VERSION}`;

export function UpdateChecker() {
  const [release, setRelease] = useState<ReleaseInfo | null>(null);

  useEffect(() => {
    let checking = false;
    const check = async () => {
      if (checking) return;
      const lastCheck = Number(window.localStorage.getItem(LAST_CHECK_KEY) ?? 0);
      if (Date.now() - lastCheck < 24 * 60 * 60 * 1000) return;
      checking = true;
      try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_REPOSITORY}/releases/latest`, { headers: { Accept: "application/vnd.github+json" }, cache: "no-store" });
        if (!response.ok) return;
        const latest = await response.json() as ReleaseInfo;
        const currentVersion = Capacitor.isNativePlatform() ? (await App.getInfo()).version : APP_VERSION;
        window.localStorage.setItem(LAST_CHECK_KEY, String(Date.now()));
        if (compareVersions(latest.tag_name, currentVersion) > 0 && latest.assets?.some((asset) => asset.name.toLowerCase().endsWith(".apk"))) setRelease(latest);
      } catch {
        // Update checks are best-effort and never block the app.
      } finally { checking = false; }
    };
    void check();
    const visible = () => { if (document.visibilityState === "visible") void check(); };
    document.addEventListener("visibilitychange", visible);
    window.addEventListener("focus", check);
    let remove: (() => Promise<void>) | undefined;
    if (Capacitor.isNativePlatform()) void App.addListener("appStateChange", ({ isActive }) => { if (isActive) void check(); }).then((handle) => { remove = () => handle.remove(); });
    return () => { document.removeEventListener("visibilitychange", visible); window.removeEventListener("focus", check); void remove?.(); };
  }, []);

  if (!release) return null;
  const apk = release.assets?.find((asset) => asset.name.toLowerCase().endsWith(".apk"));
  const downloadUrl = apk?.browser_download_url ?? release.html_url ?? RELEASES_URL;
  return <div className="update-toast" role="status">
    <span className="update-icon"><RefreshCw size={19} /></span>
    <div><strong>发现新版本 {release.tag_name}</strong><p>当前版本 {APP_VERSION}。下载新版 APK 后，Android 会提示你确认安装。</p></div>
    <a className="button primary" href={downloadUrl} target="_blank" rel="noreferrer"><Download size={16} />下载更新</a>
    <button className="icon-button" onClick={() => setRelease(null)} aria-label="稍后更新"><X size={16} /></button>
  </div>;
}
