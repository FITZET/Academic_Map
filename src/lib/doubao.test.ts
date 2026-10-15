import { afterEach, describe, expect, it, vi } from "vitest";
import { discoverScholars, parseScholarResponse, safeWebUrl } from "./doubao";
import type { ResearchDirection } from "./types";

const direction: ResearchDirection = { id: "robotics", name: "机器人", keywords: ["embodied AI"], description: "", color: "#315e82", teacherCount: 0 };
const webResult = { output: [
  { type: "web_search_call" },
  { type: "message", content: [{ type: "output_text", text: JSON.stringify({ scholars: [
    { name: "张老师", institution: "某大学", city: "北京", country: "中国", profile_url: "https://example.edu.cn/faculty/zhang", reason: "研究机器人" },
    { name: "没有来源的人", institution: "未知机构", city: "上海" },
  ] }) }] },
] };

describe("豆包候选学者", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("只接收联网搜索且有可核对链接的结果，并补足已知城市坐标", () => {
    const candidates = parseScholarResponse(webResult, direction.id);
    expect(candidates).toHaveLength(1);
    expect(candidates[0]).toMatchObject({ name: "张老师", status: "pending", directionId: "robotics", latitude: 39.9042, longitude: 116.4074, continent: "亚洲" });
  });

  it("拒绝没有实际联网搜索的模型回答", () => {
    expect(() => parseScholarResponse({ output: [webResult.output[1]] }, direction.id)).toThrow("未执行联网搜索");
  });

  it("拒绝非 HTTPS 来源链接", () => {
    expect(safeWebUrl("javascript:alert(1)")).toBeUndefined();
    expect(safeWebUrl("http://example.edu.cn")).toBeUndefined();
    expect(safeWebUrl("https://example.edu.cn/professor")).toBe("https://example.edu.cn/professor");
  });

  it("只把领域资料发给官方接口，不发送私人互动", async () => {
    const request = vi.fn().mockResolvedValue({ ok: true, json: async () => webResult });
    vi.stubGlobal("fetch", request);
    await discoverScholars(direction, "local-test-key");
    const [url, options] = request.mock.calls[0];
    const body = JSON.parse(options.body);
    expect(url).toBe("https://ark.cn-beijing.volces.com/api/v3/responses");
    expect(options.headers.Authorization).toBe("Bearer local-test-key");
    expect(body.tools).toEqual([{ type: "web_search", sources: ["doubao"] }]);
    expect(body.store).toBe(false);
    expect(options.body).toContain("机器人");
    expect(options.body).not.toContain("互动记录");
  });
});
