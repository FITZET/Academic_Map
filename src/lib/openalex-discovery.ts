import type { CandidateTeacher } from "./types";

type OpenAlexInstitution = {
  display_name?: string;
  country_code?: string;
  type?: string;
};

type OpenAlexAuthorship = {
  author_position?: string;
  is_corresponding?: boolean;
  author?: { id?: string; display_name?: string };
  institutions?: OpenAlexInstitution[];
};

type OpenAlexWork = {
  title?: string;
  publication_year?: number;
  cited_by_count?: number;
  authorships?: OpenAlexAuthorship[];
};

type AuthorAggregate = {
  id: string;
  name: string;
  institution: string;
  countryCode: string;
  institutionType: string;
  papers: number;
  citations: number;
  representativePaper: string;
};

const countryNames: Record<string, string> = {
  AU: "澳大利亚", CA: "加拿大", CH: "瑞士", CN: "中国", DE: "德国", ES: "西班牙",
  FR: "法国", GB: "英国", HK: "中国香港", IN: "印度", IT: "意大利", JP: "日本",
  KR: "韩国", NL: "荷兰", SE: "瑞典", SG: "新加坡", US: "美国",
};

export async function discoverOpenAlexCandidates(options: {
  query: string;
  directionId: string;
  fromYear: number;
  excludedNames?: string[];
}): Promise<CandidateTeacher[]> {
  const params = new URLSearchParams({
    search: options.query,
    filter: `from_publication_date:${options.fromYear}-01-01`,
    sort: "cited_by_count:desc",
    per_page: "40",
    select: "id,title,publication_year,cited_by_count,authorships",
  });
  const response = await fetch(`https://api.openalex.org/works?${params}`);
  if (!response.ok) throw new Error(`OpenAlex 返回 ${response.status}`);
  const payload = await response.json() as { results?: OpenAlexWork[] };
  const authors = new Map<string, AuthorAggregate>();
  const excluded = new Set((options.excludedNames ?? []).map((name) => name.toLowerCase()));

  for (const work of payload.results ?? []) {
    for (const authorship of work.authorships ?? []) {
      const id = authorship.author?.id;
      const name = authorship.author?.display_name?.trim();
      const institution = authorship.institutions?.[0];
      if (!id || !name || excluded.has(name.toLowerCase()) || !institution?.display_name) continue;
      const existing = authors.get(id) ?? {
        id, name, institution: institution.display_name, countryCode: institution.country_code ?? "",
        institutionType: institution.type ?? "", papers: 0, citations: 0, representativePaper: work.title ?? "待确认",
      };
      existing.papers += 1;
      existing.citations += work.cited_by_count ?? 0;
      if ((work.cited_by_count ?? 0) >= existing.citations / Math.max(existing.papers, 1)) {
        existing.representativePaper = work.title ?? existing.representativePaper;
      }
      authors.set(id, existing);
    }
  }

  return [...authors.values()]
    .sort((a, b) => (b.papers * 20 + Math.log10(b.citations + 1) * 10) - (a.papers * 20 + Math.log10(a.citations + 1) * 10))
    .slice(0, 12)
    .map((author, index) => ({
      id: `openalex-${author.id.split("/").pop()}`,
      externalAuthorId: author.id,
      name: author.name,
      initials: author.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
      title: author.institutionType === "education" ? "教师候选（待确认）" : "研究员候选（待确认）",
      institution: author.institution,
      city: "待确认",
      country: countryNames[author.countryCode] ?? (author.countryCode || "待确认"),
      countryCode: author.countryCode,
      representativePaper: author.representativePaper,
      relevantPaperCount: author.papers,
      relevance: Math.max(65, Math.min(98, 96 - index * 2 + Math.min(author.papers, 4))),
      reason: `OpenAlex 实时检索中出现 ${author.papers} 篇相关论文，累计引用约 ${author.citations} 次`,
      inferredRole: author.institutionType === "education" ? "教师候选 · 需人工确认" : "研究人员 · 需人工确认",
      source: "OpenAlex · 实时数据",
      ambiguity: author.papers > 2 ? "低" : "中",
      completeness: author.countryCode ? 82 : 68,
      status: "pending",
      directionId: options.directionId,
    }));
}
