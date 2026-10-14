import type { AppData, Publication, Teacher } from "./types";

export function normalizeText(value: string) {
  return value.trim().toLocaleLowerCase().replace(/\s+/g, " ");
}

export function deduplicatePublications(items: Publication[]) {
  const seen = new Map<string, Publication>();
  for (const item of items) {
    const key = item.doi
      ? `doi:${normalizeText(item.doi)}`
      : `title:${normalizeText(item.title)}|year:${item.year}`;
    const current = seen.get(key);
    if (!current || item.citations > current.citations) seen.set(key, item);
  }
  return [...seen.values()];
}

export function applyAutomaticTeacherUpdate(
  teacher: Teacher,
  incoming: Partial<Teacher>,
): Teacher {
  const result = { ...teacher };
  for (const [key, value] of Object.entries(incoming)) {
    if (value === undefined || teacher.lockedFields.includes(key)) continue;
    (result as unknown as Record<string, unknown>)[key] = value;
  }
  if (incoming.publications) {
    result.publications = deduplicatePublications([
      ...teacher.publications,
      ...incoming.publications,
    ]);
  }
  return result;
}

export function searchData(data: AppData, query: string) {
  const needle = normalizeText(query);
  if (!needle) return { teachers: [], publications: [] };

  const directionNames = new Map(data.directions.map((item) => [item.id, item.name]));
  const tagNames = new Map(data.tags.map((item) => [item.id, item.name]));

  const teachers = data.teachers.filter((teacher) => {
    const haystack = [
      teacher.name,
      teacher.englishName,
      teacher.institution,
      teacher.city,
      teacher.country,
      ...teacher.directionIds.map((id) => directionNames.get(id) ?? ""),
      ...teacher.tagIds.map((id) => tagNames.get(id) ?? ""),
      ...teacher.publications.map((publication) => publication.title),
    ]
      .join(" ")
      .toLocaleLowerCase();
    return haystack.includes(needle);
  });

  const publications = data.teachers.flatMap((teacher) =>
    teacher.publications
      .filter((publication) => normalizeText(publication.title).includes(needle))
      .map((publication) => ({ ...publication, teacherId: teacher.id, teacherName: teacher.name })),
  );

  return { teachers, publications };
}
