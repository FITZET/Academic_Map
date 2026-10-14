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
  addInteraction: (interaction: Omit<Interaction, "id">) => void;
  addDirection: (direction: Omit<ResearchDirection, "id" | "teacherCount">) => void;
  resetDemo: () => void;
};

const DataContext = createContext<DataContextValue | null>(null);
const STORAGE_KEY = "academic-atlas-data-v1";

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
      const teacher: Teacher = {
        id: `teacher-${candidate.id}`, name: candidate.name, englishName: candidate.name, initials: candidate.initials, title: candidate.title, institution: candidate.institution, department: "待补充", city: candidate.city, country: candidate.country, continent: candidate.country === "英国" ? "欧洲" : candidate.country === "巴西" ? "南美洲" : "亚洲", latitude: candidate.country === "英国" ? 51.5072 : candidate.country === "巴西" ? -23.5505 : 12.9716, longitude: candidate.country === "英国" ? -0.1276 : candidate.country === "巴西" ? -46.6333 : 77.5946, bio: "候选老师已加入，请补充并确认个人简介。", bioSource: `${candidate.source} · 待确认`, bioApproved: false, directionIds: [candidate.directionId], tagIds: [], publications: [{ id: `pub-${candidate.id}`, title: candidate.representativePaper, authors: candidate.name, year: 2026, venue: "待确认", citations: 0, source: candidate.source, discoveredAt: "2026-10-14", directionIds: [candidate.directionId] }], identities: [], relevance: candidate.relevance, lastUpdated: "刚刚", lastSynced: "等待首次同步", lockedFields: [],
      };
      return { ...current, teachers: [...current.teachers, teacher], candidates: current.candidates.filter((item) => item.id !== id) };
    }),
    updateCandidateStatus: (id, status) => setData((current) => ({ ...current, candidates: current.candidates.map((candidate) => candidate.id === id ? { ...candidate, status } : candidate) })),
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
