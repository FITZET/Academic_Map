"use client";

import { useEffect, useState } from "react";
import { Download, RefreshCw, X } from "lucide-react";
import { APP_VERSION, compareVersions, GITHUB_REPOSITORY, RELEASES_URL } from "@/lib/version";

type ReleaseInfo = {
  tag_name: string;
  html_url: string;
  name?: string;
  assets?: Array<{ name: string; browser_download_url: string }>;
};

const LAST_CHECK_KEY = "academic-atlas-update-check";

export function UpdateChecker() {
  const [release, setRelease] = useState<ReleaseInfo | null>(null);

  useEffect(() => {
    const check = async () => {
      const lastCheck = Number(window.localStorage.getItem(LAST_CHECK_KEY) ?? 0);
      if (Date.now() - lastCheck < 24 * 60 * 60 * 1000) return;
      window.localStorage.setItem(LAST_CHECK_KEY, String(Date.now()));
      try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_REPOSITORY}/releases/latest`, { headers: { Accept: "application/vnd.github+json" } });
        if (!response.ok) return;
        const latest = await response.json() as ReleaseInfo;
        if (compareVersions(latest.tag_name, APP_VERSION) > 0) setRelease(latest);
      } catch {
        // Update checks are best-effort and never block the app.
      }
    };
    void check();
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
