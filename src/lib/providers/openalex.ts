import type { AcademicProvider, ProviderWork } from "./types";

type OpenAlexResponse = { results?: Array<Record<string, unknown>> };

export class OpenAlexProvider implements AcademicProvider {
  readonly name = "OpenAlex";
  constructor(private readonly apiKey = process.env.OPENALEX_API_KEY) {}

  private async request(path: string) {
    const url = new URL(`https://api.openalex.org${path}`);
    if (this.apiKey) url.searchParams.set("api_key", this.apiKey);
    const response = await fetch(url, { headers: { "User-Agent": "AcademicAtlas/0.1 (personal research tool)" }, next: { revalidate: 3600 } });
    if (!response.ok) throw new Error(`OpenAlex request failed with ${response.status}`);
    return response.json() as Promise<OpenAlexResponse>;
  }

  async searchWorks(query: string, fromYear = new Date().getFullYear() - 5): Promise<ProviderWork[]> {
    const params = new URLSearchParams({ search: query, filter: `from_publication_date:${fromYear}-01-01`, per_page: "25", select: "id,title,doi,publication_year,primary_location,cited_by_count,authorships" });
    const data = await this.request(`/works?${params}`);
    return (data.results ?? []).map(mapOpenAlexWork);
  }

  async getAuthorWorks(authorId: string, since?: string): Promise<ProviderWork[]> {
    const filters = [`authorships.author.id:${authorId}`];
    if (since) filters.push(`from_publication_date:${since}`);
    const params = new URLSearchParams({ filter: filters.join(","), sort: "publication_date:desc", per_page: "100", select: "id,title,doi,publication_year,primary_location,cited_by_count,authorships" });
    const data = await this.request(`/works?${params}`);
    return (data.results ?? []).map(mapOpenAlexWork);
  }
}

function mapOpenAlexWork(raw: Record<string, unknown>): ProviderWork {
  const authorships = (raw.authorships as Array<Record<string, unknown>> | undefined) ?? [];
  const primaryLocation = raw.primary_location as Record<string, unknown> | undefined;
  const source = primaryLocation?.source as Record<string, unknown> | undefined;
  return {
    externalId: String(raw.id ?? ""), title: String(raw.title ?? "Untitled"), doi: raw.doi ? String(raw.doi) : undefined, year: Number(raw.publication_year ?? 0), venue: source?.display_name ? String(source.display_name) : undefined, citationCount: Number(raw.cited_by_count ?? 0), authors: authorships.map((item) => { const author = item.author as Record<string, unknown> | undefined; const institutions = item.institutions as Array<Record<string, unknown>> | undefined; return { externalId: String(author?.id ?? ""), name: String(author?.display_name ?? "Unknown"), institution: institutions?.[0]?.display_name ? String(institutions[0].display_name) : undefined }; }),
  };
}
