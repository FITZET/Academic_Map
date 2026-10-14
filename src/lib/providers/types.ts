export type ProviderAuthor = {
  externalId: string;
  name: string;
  institution?: string;
  city?: string;
  country?: string;
  orcid?: string;
};

export type ProviderWork = {
  externalId: string;
  title: string;
  doi?: string;
  year: number;
  venue?: string;
  citationCount: number;
  authors: ProviderAuthor[];
};

export interface AcademicProvider {
  readonly name: string;
  searchWorks(query: string, fromYear?: number): Promise<ProviderWork[]>;
  getAuthorWorks(authorId: string, since?: string): Promise<ProviderWork[]>;
}
