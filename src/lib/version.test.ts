import { describe, expect, it } from "vitest";
import { compareVersions } from "./version";

describe("version comparison", () => {
  it("detects newer semantic versions", () => {
    expect(compareVersions("0.2.0", "0.1.9")).toBeGreaterThan(0);
    expect(compareVersions("v1.0.0", "1.0.0")).toBe(0);
    expect(compareVersions("0.1.0", "0.2.0")).toBeLessThan(0);
  });
});
