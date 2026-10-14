import type { AcademicProvider, ProviderWork } from "./types";

export class MockAcademicProvider implements AcademicProvider {
  readonly name = "Mock Provider";
  async searchWorks(query: string): Promise<ProviderWork[]> { return [{ externalId: "mock-work-1", title: `A representative study in ${query}`, year: 2026, venue: "Demo Conference", citationCount: 12, authors: [{ externalId: "mock-author-1", name: "Demo Scholar", institution: "Demo University" }] }]; }
  async getAuthorWorks(authorId: string): Promise<ProviderWork[]> { return this.searchWorks(authorId); }
}
