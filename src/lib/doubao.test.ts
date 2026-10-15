import { afterEach, describe, expect, it, vi } from "vitest";
import { Capacitor, CapacitorHttp } from "@capacitor/core";
import { discoverScholars, explainArkError, normalizeArkKey, parseScholarResponse, safeWebUrl, testArkConnection } from "./doubao";
import type { ResearchDirection } from "./types";

vi.mock("@capacitor/core", () => ({ Capacitor: { isNativePlatform: vi.fn(() => false) }, CapacitorHttp: { post: vi.fn() } }));

const direction: ResearchDirection = { id: "robotics", name: "机器人", keywords: ["embodied AI"], description: "", color: "#315e82", teacherCount: 0 };
const webResult = { output: [
  { type: "web_search_call" },
  { type: "message", content: [{ type: "output_text", text: JSON.stringify({ scholars: [
    { name: "张老师", institution: "某大学", city: "北京", country: "中国", profile_url: "https://example.edu.cn/faculty/zhang", reason: "研究机器人" },
    { name: "没有来源的人", institution: "未知机构", city: "上海" },
  ] }) }] },
] };

describe("豆包候选学者", () => {
  afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

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
    expect(body.tool_choice).toEqual({ type: "web_search" });
    expect(body.model).toBe("doubao-seed-evolving");
    expect(body.store).toBe(false);
    expect(options.body).toContain("机器人");
    expect(options.body).not.toContain("互动记录");
  });

  it("基础连接测试沿用官方 Responses 格式，但不要求搜索服务", async () => {
    const request = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ status: "completed", output: [] }) });
    vi.stubGlobal("fetch", request);
    await testArkConnection("Bearer local-test-key");
    const body = JSON.parse(request.mock.calls[0][1].body);
    expect(body.model).toBe("doubao-seed-evolving");
    expect(body.tools).toBeUndefined();
    expect(body.input[0].content[0].type).toBe("input_text");
    expect(normalizeArkKey("Authorization: Bearer local-test-key")).toBe("local-test-key");
  });

  it("Android 使用原生网络请求而不是 WebView fetch", async () => {
    vi.spyOn(Capacitor, "isNativePlatform").mockReturnValue(true);
    const native = vi.spyOn(CapacitorHttp, "post").mockResolvedValue({ status: 200, data: webResult, headers: {}, url: "https://ark.cn-beijing.volces.com/api/v3/responses" });
    vi.stubGlobal("fetch", vi.fn(() => { throw new Error("WebView fetch should not run"); }));
    await discoverScholars(direction, "local-test-key");
    expect(native).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ model: "doubao-seed-evolving" }) }));
  });

  it("区分搜索服务未开通与模型权限错误", () => {
    expect(explainArkError(403, "AccessDenied", true)).toContain("豆包搜索 Custom 版");
    expect(explainArkError(403, "AccessDenied")).toContain("模型或资源");
    expect(explainArkError(404, "ModelNotOpen")).toContain("模型 ID");
  });
});
