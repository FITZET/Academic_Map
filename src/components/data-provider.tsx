"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { initialData } from "@/lib/mock-data";
import type { AppData, CandidateTeacher, Interaction, ResearchDirection, Teacher } from "@/lib/types";

type NewTeacher = Pick<Teacher, "name" | "englishName" | "title" | "institution" | "department" | "city" | "country" | "continent" | "latitude" | "longitude" | "bio" | "directionIds" | "tagIds">;

type DataContextValue = {
  data: AppData;
  addTeacher: (teacher: NewTeacher) => string;
  updateTeacher: (id: string, updates: Partial<Teacher>, lockFields?: string[]) => void;
  acceptCandidate: (id: string) => void;
  updateCandidateStatus: (id: string, status: CandidateTeacher["status"]) => void;
  addCandidates: (candidates: CandidateTeacher[]) => void;
  addInteraction: (interaction: Omit<Interaction, "id">) => void;
  addDirection: (direction: Omit<ResearchDirection, "id" | "teacherCount">) => void;
  resetDemo: () => void;
};

const DataContext = createContext<DataContextValue | null>(null);
const STORAGE_KEY = "academic-atlas-data-v1";
const countryLocations: Record<string, { continent: string; latitude: number; longitude: number }> = {
  AU: { continent: "大洋洲", latitude: -25.27, longitude: 133.78 }, CA: { continent: "北美洲", latitude: 56.13, longitude: -106.35 },
  CH: { continent: "欧洲", latitude: 46.82, longitude: 8.23 }, CN: { continent: "亚洲", latitude: 35.86, longitude: 104.2 },
  DE: { continent: "欧洲", latitude: 51.17, longitude: 10.45 }, ES: { continent: "欧洲", latitude: 40.46, longitude: -3.75 },
  FR: { continent: "欧洲", latitude: 46.23, longitude: 2.21 }, GB: { continent: "欧洲", latitude: 55.38, longitude: -3.44 },
  HK: { continent: "亚洲", latitude: 22.32, longitude: 114.17 }, IN: { continent: "亚洲", latitude: 20.59, longitude: 78.96 },
  IT: { continent: "欧洲", latitude: 41.87, longitude: 12.57 }, JP: { continent: "亚洲", latitude: 36.2, longitude: 138.25 },
  KR: { continent: "亚洲", latitude: 35.91, longitude: 127.77 }, NL: { continent: "欧洲", latitude: 52.13, longitude: 5.29 },
  SE: { continent: "欧洲", latitude: 60.13, longitude: 18.64 }, SG: { continent: "亚洲", latitude: 1.35, longitude: 103.82 },
  US: { continent: "北美洲", latitude: 37.09, longitude: -95.71 },
};

export function AcademicMapProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(initialData);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setData(JSON.parse(saved) as AppData);
    } catch {
      // Corrupt local demo data falls back to the bundled fixture.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, hydrated]);

  const value = useMemo<DataContextValue>(() => ({
    data,
    addTeacher: (teacher) => {
      const id = `${teacher.englishName || teacher.name}`.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-").replace(/^-|-$/g, "") + `-${Date.now().toString(36)}`;
      const initials = (teacher.englishName || teacher.name).split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
      setData((current) => ({ ...current, teachers: [...current.teachers, { ...teacher, id, initials, email: "", homepage: "", scholarUrl: "", bioSource: "手动录入", bioApproved: true, publications: [], identities: [], relevance: 100, lastUpdated: "刚刚", lastSynced: "尚未同步", lockedFields: Object.keys(teacher) }] }));
      return id;
    },
    updateTeacher: (id, updates, lockFields = []) => setData((current) => ({
      ...current,
      teachers: current.teachers.map((teacher) => teacher.id === id ? { ...teacher, ...updates, lockedFields: [...new Set([...teacher.lockedFields, ...lockFields])], lastUpdated: "刚刚" } : teacher),
    })),
    acceptCandidate: (id) => setData((current) => {
      const candidate = current.candidates.find((item) => item.id === id);
      if (!candidate) return current;
      const location = countryLocations[candidate.countryCode ?? ""] ?? { continent: "待确认", latitude: 0, longitude: 0 };
      const teacher: Teacher = {
        id: `teacher-${candidate.id}`, name: candidate.name, englishName: candidate.name, initials: candidate.initials, title: candidate.title, institution: candidate.institution, department: "待补充", city: candidate.city, country: candidate.country, continent: location.continent, latitude: location.latitude, longitude: location.longitude, bio: "候选老师已加入，请补充并确认个人简介。", bioSource: `${candidate.source} · 待确认`, bioApproved: false, directionIds: [candidate.directionId], tagIds: [], publications: [{ id: `pub-${candidate.id}`, title: candidate.representativePaper, authors: candidate.name, year: new Date().getFullYear(), venue: "待确认", citations: 0, source: candidate.source, discoveredAt: new Date().toISOString().slice(0, 10), directionIds: [candidate.directionId] }], identities: candidate.externalAuthorId ? [{ source: "OpenAlex", value: candidate.externalAuthorId.split("/").pop() ?? candidate.externalAuthorId, url: candidate.externalAuthorId }] : [], relevance: candidate.relevance, lastUpdated: "刚刚", lastSynced: "尚未启用", lockedFields: [],
      };
      return { ...current, teachers: [...current.teachers, teacher], candidates: current.candidates.filter((item) => item.id !== id) };
    }),
    updateCandidateStatus: (id, status) => setData((current) => ({ ...current, candidates: current.candidates.map((candidate) => candidate.id === id ? { ...candidate, status } : candidate) })),
    addCandidates: (candidates) => setData((current) => {
      const incomingKeys = new Set(candidates.map((candidate) => candidate.externalAuthorId || candidate.name.toLowerCase()));
      const retained = current.candidates.filter((candidate) => !incomingKeys.has(candidate.externalAuthorId || candidate.name.toLowerCase()));
      return { ...current, candidates: [...candidates, ...retained] };
    }),
    addInteraction: (interaction) => setData((current) => ({ ...current, interactions: [{ ...interaction, id: `interaction-${Date.now().toString(36)}` }, ...current.interactions] })),
    addDirection: (direction) => setData((current) => ({ ...current, directions: [...current.directions, { ...direction, id: `direction-${Date.now().toString(36)}`, teacherCount: 0 }] })),
    resetDemo: () => setData(initialData),
  }), [data]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useAcademicData() {
  const value = useContext(DataContext);
  if (!value) throw new Error("useAcademicData must be used inside AcademicMapProvider");
  return value;
}
