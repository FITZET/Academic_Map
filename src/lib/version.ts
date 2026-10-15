export const APP_VERSION = "0.3.0";
export const GITHUB_REPOSITORY = "FITZET/Academic_Map";
export const RELEASES_URL = `https://github.com/${GITHUB_REPOSITORY}/releases`;

export function compareVersions(left: string, right: string) {
  const a = left.replace(/^v/, "").split(".").map(Number);
  const b = right.replace(/^v/, "").split(".").map(Number);
  for (let index = 0; index < Math.max(a.length, b.length); index += 1) {
    const difference = (a[index] ?? 0) - (b[index] ?? 0);
    if (difference !== 0) return difference;
  }
  return 0;
}
