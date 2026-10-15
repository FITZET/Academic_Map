const demoTeacherIds = new Set(["maya-chen", "elena-rossi", "akira-sato", "lin-yuxin", "jonas-berg", "sarah-williams"]);

export function isDemoTeacher(id: string) { return demoTeacherIds.has(id); }
