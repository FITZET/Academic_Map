export type ResearchDirection = {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  color: string;
  teacherCount: number;
};

export type Tag = { id: string; name: string; color: string; background: string };

export type Publication = {
  id: string;
  title: string;
  authors: string;
  year: number;
  venue: string;
  doi?: string;
  citations: number;
  source: string;
  openAccessUrl?: string;
  discoveredAt: string;
  isNew?: boolean;
  isImportant?: boolean;
  directionIds: string[];
};

export type ExternalIdentity = {
  source: "OpenAlex" | "ORCID" | "Semantic Scholar" | "DBLP" | "Google Scholar";
  value: string;
  url?: string;
};

export type Teacher = {
  id: string;
  name: string;
  englishName: string;
  initials: string;
  title: string;
  institution: string;
  department: string;
  city: string;
  country: string;
  continent: string;
  latitude: number;
  longitude: number;
  email?: string;
  homepage?: string;
  scholarUrl?: string;
  bio: string;
  bioSource: string;
  bioApproved: boolean;
  directionIds: string[];
  tagIds: string[];
  publications: Publication[];
  identities: ExternalIdentity[];
  relevance: number;
  lastUpdated: string;
  lastSynced: string;
  lockedFields: string[];
};

export type CandidateTeacher = {
  id: string;
  name: string;
  initials: string;
  title: string;
  institution: string;
  city: string;
  country: string;
  representativePaper: string;
  relevantPaperCount: number;
  relevance: number;
  reason: string;
  inferredRole: string;
  source: string;
  ambiguity: "低" | "中" | "高";
  completeness: number;
  status: "pending" | "ignored" | "excluded";
  directionId: string;
  externalAuthorId?: string;
  countryCode?: string;
  continent?: string;
  latitude?: number;
  longitude?: number;
  profileUrl?: string;
  evidenceUrl?: string;
  searchedAt?: string;
};

export type Interaction = {
  id: string;
  teacherId: string;
  date: string;
  location: string;
  eventName: string;
  type: string;
  content: string;
  hobbies: string[];
  impression: string;
  followUp: string;
};

export type AppData = {
  directions: ResearchDirection[];
  tags: Tag[];
  teachers: Teacher[];
  candidates: CandidateTeacher[];
  interactions: Interaction[];
};
