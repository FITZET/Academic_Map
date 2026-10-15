import type { CandidateTeacher, ResearchDirection } from "./types";

export const ARK_ENDPOINT = "https://ark.cn-beijing.volces.com/api/v3/responses";
export const DEFAULT_ARK_MODEL = "doubao-seed-2-1-pro-260915";
export const ARK_KEY_STORAGE = "academic-map-ark-key-v1";
export const ARK_MODEL_STORAGE = "academic-map-ark-model-v1";

type ArkResponse = { output?: Array<{ type?: string; content?: Array<{ type?: string; text?: string }> }>; error?: { message?: string } };
type ScholarResult = { name?: unknown; title?: unknown; institution?: unknown; city?: unknown; country?: unknown; continent?: unknown; latitude?: unknown; longitude?: unknown; profile_url?: unknown; evidence_url?: unknown; reason?: unknown };

const string = (value: unknown) => typeof value === "string" ? value.trim() : "";
const coordinate = (value: unknown) => typeof value === "number" && Number.isFinite(value) ? value : undefined;

export function safeWebUrl(value: unknown): string | undefined {
  const raw = string(value);
  try {
    const url = new URL(raw);
    return url.protocol === "https:" && !url.username && !url.password ? url.toString() : undefined;
  } catch { return undefined; }
}

const cityCoordinates: Record<string, [number, number, string]> = {
  "北京": [39.9042, 116.4074, "亚洲"], "beijing": [39.9042, 116.4074, "亚洲"],
  "上海": [31.2304, 121.4737, "亚洲"], "shanghai": [31.2304, 121.4737, "亚洲"],
  "广州": [23.1291, 113.2644, "亚洲"], "guangzhou": [23.1291, 113.2644, "亚洲"],
  "深圳": [22.5431, 114.0579, "亚洲"], "shenzhen": [22.5431, 114.0579, "亚洲"],
  "杭州": [30.2741, 120.1551, "亚洲"], "hangzhou": [30.2741, 120.1551, "亚洲"],
  "南京": [32.0603, 118.7969, "亚洲"], "nanjing": [32.0603, 118.7969, "亚洲"],
  "武汉": [30.5928, 114.3055, "亚洲"], "wuhan": [30.5928, 114.3055, "亚洲"],
  "成都": [30.5728, 104.0668, "亚洲"], "chengdu": [30.5728, 104.0668, "亚洲"],
  "西安": [34.3416, 108.9398, "亚洲"], "xi'an": [34.3416, 108.9398, "亚洲"],
  "合肥": [31.8206, 117.2272, "亚洲"], "hefei": [31.8206, 117.2272, "亚洲"],
  "香港": [22.3193, 114.1694, "亚洲"], "hong kong": [22.3193, 114.1694, "亚洲"],
  "新加坡": [1.3521, 103.8198, "亚洲"], "singapore": [1.3521, 103.8198, "亚洲"],
  "东京": [35.6762, 139.6503, "亚洲"], "tokyo": [35.6762, 139.6503, "亚洲"],
  "伦敦": [51.5072, -0.1276, "欧洲"], "london": [51.5072, -0.1276, "欧洲"],
  "苏黎世": [47.3769, 8.5417, "欧洲"], "zurich": [47.3769, 8.5417, "欧洲"],
  "波士顿": [42.3601, -71.0589, "北美洲"], "boston": [42.3601, -71.0589, "北美洲"],
  "旧金山": [37.7749, -122.4194, "北美洲"], "san francisco": [37.7749, -122.4194, "北美洲"],
};

export function parseScholarResponse(response: ArkResponse, directionId: string): CandidateTeacher[] {
  if (!response.output?.some((item) => item.type === "web_search_call")) throw new Error("豆包未执行联网搜索，本次结果未保存。请确认模型支持联网搜索。");
  const content = response.output.flatMap((item) => item.type === "message" ? (item.content ?? []).filter((part) => part.type === "output_text").map((part) => part.text ?? "") : []).join("\n");
  const json = content.match(/\{[\s\S]*\}/)?.[0];
  if (!json) throw new Error("豆包没有返回可读取的学者列表，请重试。");
  let parsed: { scholars?: ScholarResult[] };
  try { parsed = JSON.parse(json) as { scholars?: ScholarResult[] }; } catch { throw new Error("豆包返回的列表格式不正确，请重试。"); }
  if (!Array.isArray(parsed.scholars)) throw new Error("豆包没有返回学者列表，请重试。");
  return parsed.scholars.slice(0, 12).flatMap((item) => {
    const name = string(item.name), institution = string(item.institution), profileUrl = safeWebUrl(item.profile_url), evidenceUrl = safeWebUrl(item.evidence_url);
    if (!name || !institution || (!profileUrl && !evidenceUrl)) return [];
    const city = string(item.city);
    const known = cityCoordinates[city.toLocaleLowerCase()];
    const lat = coordinate(item.latitude), lng = coordinate(item.longitude);
    const latitude = known?.[0] ?? (lat !== undefined && Math.abs(lat) <= 90 ? lat : undefined);
    const longitude = known?.[1] ?? (lng !== undefined && Math.abs(lng) <= 180 ? lng : undefined);
    return [{ id: `candidate-${crypto.randomUUID()}`, name, initials: name.slice(0, 2).toUpperCase(), title: string(item.title) || "研究者", institution, city, country: string(item.country), continent: known?.[2] ?? string(item.continent), latitude, longitude, profileUrl, evidenceUrl, representativePaper: "", relevantPaperCount: 0, relevance: 0, reason: string(item.reason), inferredRole: "待人工核对", source: "豆包联网搜索", ambiguity: "中" as const, completeness: [name, institution, city, profileUrl || evidenceUrl].filter(Boolean).length * 25, status: "pending" as const, directionId, searchedAt: new Date().toISOString() }];
  });
}

export async function discoverScholars(direction: ResearchDirection, apiKey: string, model = DEFAULT_ARK_MODEL, signal?: AbortSignal): Promise<CandidateTeacher[]> {
  if (!apiKey.trim()) throw new Error("请先配置豆包方舟 API Key。");
  const prompt = `请先使用联网搜索，寻找“${direction.name}”研究方向的真实高校教师或科研机构研究员。辅助关键词：${direction.keywords.join("、") || "无"}。优先搜索中国可访问的高校、科研机构官方主页以及中文学术平台。只返回能找到可核对的 HTTPS 人物主页或机构介绍页的学者；不要编造人物、机构、URL 或坐标；学生和无法确认身份的人不要列入。最多 8 人。只输出 JSON 对象，格式为 {"scholars":[{"name":"姓名","title":"职称","institution":"机构","city":"城市","country":"国家","continent":"亚洲/欧洲/北美洲/南美洲/非洲/大洋洲","latitude":null,"longitude":null,"profile_url":"https://...","evidence_url":"https://...","reason":"与领域相关的简短理由"}]}。如果找不到证据则返回 {"scholars":[]}。经纬度不确定时用 null。`;
  let response: Response;
  try {
    response = await fetch(ARK_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey.trim()}` }, body: JSON.stringify({ model: model.trim() || DEFAULT_ARK_MODEL, stream: false, store: false, tools: [{ type: "web_search", sources: ["doubao"] }], input: [{ role: "user", content: [{ type: "input_text", text: prompt }] }] }), signal });
  } catch { throw new Error("连接豆包失败。请检查网络和 API 服务可用性。"); }
  const result = await response.json() as ArkResponse;
  if (!response.ok) throw new Error(result.error?.message || `豆包请求失败（HTTP ${response.status}）。`);
  return parseScholarResponse(result, direction.id);
}
