"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { initialData } from "@/lib/mock-data";
import type { AppData, CandidateTeacher, Interaction, ResearchDirection, Teacher } from "@/lib/types";

type DataContextValue = {
  data: AppData;
  addInteraction: (interaction: Omit<Interaction, "id">) => void;
  toggleTeacherTag: (teacherId: string, tagId: string) => void;
  createTag: (name: string) => string;
  createDirection: (name: string, keywords: string) => string;
  addCandidates: (candidates: CandidateTeacher[]) => number;
  reviewCandidate: (candidateId: string, decision: "accept" | "ignore" | "exclude", changes?: Partial<CandidateTeacher>) => void;
};

const DataContext = createContext<DataContextValue | null>(null);
const STORAGE_KEY = "academic-atlas-data-v1";

export function AcademicMapProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(initialData);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as AppData;
        setData({ ...initialData, ...parsed, candidates: (parsed.candidates ?? []).filter((candidate) => !["c1", "c2", "c3"].includes(candidate.id)) });
      }
    } catch {
      // The built-in local sample is used if stored data is invalid.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, hydrated]);

  const value = useMemo<DataContextValue>(() => ({
    data,
    addInteraction: (interaction) => setData((current) => ({ ...current, interactions: [{ ...interaction, id: `interaction-${Date.now().toString(36)}` }, ...current.interactions] })),
    toggleTeacherTag: (teacherId, tagId) => setData((current) => ({
      ...current,
      teachers: current.teachers.map((teacher) => teacher.id !== teacherId ? teacher : { ...teacher, tagIds: teacher.tagIds.includes(tagId) ? teacher.tagIds.filter((id) => id !== tagId) : [...teacher.tagIds, tagId] }),
    })),
    createTag: (name) => {
      const cleanName = name.trim();
      if (!cleanName) return "";
      const existing = data.tags.find((tag) => tag.name === cleanName);
      if (existing) return existing.id;
      const id = `tag-${Date.now().toString(36)}`;
      const palette = [{ color: "#315e82", background: "#e7f0f6" }, { color: "#397b73", background: "#e5f2ef" }, { color: "#876626", background: "#f7f0dc" }, { color: "#765687", background: "#f1eaf5" }];
      const paletteItem = palette[Date.now() % palette.length];
      setData((current) => ({ ...current, tags: [...current.tags, { id, name: cleanName, ...paletteItem }] }));
      return id;
    },
    createDirection: (name, keywords) => {
      const cleanName = name.trim();
      if (!cleanName) return "";
      const existing = data.directions.find((direction) => direction.name.toLocaleLowerCase() === cleanName.toLocaleLowerCase());
      if (existing) return existing.id;
      const id = `direction-${crypto.randomUUID()}`;
      const direction: ResearchDirection = { id, name: cleanName, description: "", keywords: keywords.split(/[,，、\n]/).map((value) => value.trim()).filter(Boolean), color: "#315e82", teacherCount: 0 };
      setData((current) => ({ ...current, directions: [...current.directions, direction] }));
      return id;
    },
    addCandidates: (candidates) => {
      const existing = new Set(data.candidates.filter((candidate) => candidate.status !== "ignored").map((candidate) => `${candidate.directionId}|${candidate.profileUrl || candidate.name + candidate.institution}`.toLocaleLowerCase()));
      const unique = candidates.filter((candidate) => {
        const key = `${candidate.directionId}|${candidate.profileUrl || candidate.name + candidate.institution}`.toLocaleLowerCase();
        if (existing.has(key)) return false;
        if (data.teachers.some((teacher) => (candidate.profileUrl && teacher.homepage === candidate.profileUrl) || (teacher.name.toLocaleLowerCase() === candidate.name.toLocaleLowerCase() && teacher.institution.toLocaleLowerCase() === candidate.institution.toLocaleLowerCase()))) return false;
        existing.add(key);
        return true;
      });
      setData((current) => ({ ...current, candidates: [...unique, ...current.candidates] }));
      return unique.length;
    },
    reviewCandidate: (candidateId, decision, changes) => setData((current) => {
      const original = current.candidates.find((candidate) => candidate.id === candidateId);
      if (!original || original.status !== "pending") return current;
      const candidate = { ...original, ...changes };
      if (decision !== "accept") return { ...current, candidates: current.candidates.map((item) => item.id === candidateId ? { ...candidate, status: decision === "exclude" ? "excluded" : "ignored" } : item) };
      if (!candidate.name.trim() || !candidate.institution.trim() || !candidate.continent || !candidate.profileUrl && !candidate.evidenceUrl || !Number.isFinite(candidate.latitude) || !Number.isFinite(candidate.longitude) || Math.abs(candidate.latitude!) > 90 || Math.abs(candidate.longitude!) > 180) return current;
      if (current.teachers.some((teacher) => teacher.name.toLocaleLowerCase() === candidate.name.trim().toLocaleLowerCase() && teacher.institution.toLocaleLowerCase() === candidate.institution.trim().toLocaleLowerCase())) return current;
      const teacher: Teacher = { id: `teacher-${crypto.randomUUID()}`, name: candidate.name.trim(), englishName: candidate.name.trim(), initials: candidate.name.trim().slice(0, 2).toUpperCase(), title: candidate.title || "研究者", institution: candidate.institution.trim(), department: "", city: candidate.city.trim(), country: candidate.country.trim(), continent: candidate.continent, latitude: candidate.latitude!, longitude: candidate.longitude!, homepage: candidate.profileUrl || candidate.evidenceUrl, bio: "", bioSource: candidate.evidenceUrl || candidate.profileUrl || "", bioApproved: false, directionIds: [candidate.directionId], tagIds: [], publications: [], identities: [], relevance: candidate.relevance, lastUpdated: new Date().toISOString(), lastSynced: "", lockedFields: ["name", "institution", "city", "country", "latitude", "longitude"] };
      return { ...current, teachers: [...current.teachers, teacher], candidates: current.candidates.filter((item) => item.id !== candidateId) };
    }),
  }), [data]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useAcademicData() {
  const value = useContext(DataContext);
  if (!value) throw new Error("useAcademicData must be used inside AcademicMapProvider");
  return value;
}
