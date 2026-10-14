import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === "true";
const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: isStaticExport ? "export" : undefined,
  trailingSlash: isStaticExport,
  basePath: isGitHubPages ? "/Academic_Map" : "",
  assetPrefix: isGitHubPages ? "/Academic_Map/" : undefined,
};

export default nextConfig;
