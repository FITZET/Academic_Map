"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { initialData } from "@/lib/mock-data";
import type { AppData, Interaction } from "@/lib/types";

type DataContextValue = {
  data: AppData;
  addInteraction: (interaction: Omit<Interaction, "id">) => void;
  toggleTeacherTag: (teacherId: string, tagId: string) => void;
  createTag: (name: string) => string;
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
  }), [data]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useAcademicData() {
  const value = useContext(DataContext);
  if (!value) throw new Error("useAcademicData must be used inside AcademicMapProvider");
  return value;
}
