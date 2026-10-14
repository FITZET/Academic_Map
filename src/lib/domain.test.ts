import { describe, expect, it } from "vitest";
import { applyAutomaticTeacherUpdate, deduplicatePublications, searchData } from "./domain";
import { initialData } from "./mock-data";

describe("academic data rules", () => {
  it("deduplicates publications by DOI and keeps the richer citation record", () => {
    const original = initialData.teachers[0].publications[0];
    const duplicate = { ...original, id: "duplicate", citations: original.citations + 10 };
    expect(deduplicatePublications([original, duplicate])).toHaveLength(1);
    expect(deduplicatePublications([original, duplicate])[0].citations).toBe(28);
  });

  it("does not overwrite manually locked fields", () => {
    const teacher = initialData.teachers[0];
    const updated = applyAutomaticTeacherUpdate(teacher, {
      bio: "This should not overwrite the manual biography",
      title: "Professor",
    });
    expect(updated.bio).toBe(teacher.bio);
    expect(updated.title).toBe("Professor");
  });

  it("searches across teacher, institution, direction, tag and publication title", () => {
    expect(searchData(initialData, "Stanford").teachers[0].id).toBe("maya-chen");
    expect(searchData(initialData, "重点关注").teachers.length).toBeGreaterThan(0);
    expect(searchData(initialData, "Sparse Memory").publications[0].teacherId).toBe("akira-sato");
  });
});
