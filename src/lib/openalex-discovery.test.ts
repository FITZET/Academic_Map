import { afterEach, describe, expect, it, vi } from "vitest";
import { discoverOpenAlexCandidates } from "./openalex-discovery";

afterEach(() => vi.unstubAllGlobals());

describe("OpenAlex live discovery", () => {
  it("aggregates repeated authors and keeps results in candidate form", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [
        { title: "Paper A", cited_by_count: 10, authorships: [{ author: { id: "https://openalex.org/A1", display_name: "Ada Scholar" }, institutions: [{ display_name: "Example University", country_code: "GB", type: "education" }] }] },
        { title: "Paper B", cited_by_count: 20, authorships: [{ author: { id: "https://openalex.org/A1", display_name: "Ada Scholar" }, institutions: [{ display_name: "Example University", country_code: "GB", type: "education" }] }] },
      ] }),
    }));

    const result = await discoverOpenAlexCandidates({ query: "medical imaging", directionId: "medical", fromYear: 2022 });

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ name: "Ada Scholar", relevantPaperCount: 2, country: "英国", source: "OpenAlex · 实时数据", status: "pending" });
  });
});
