"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Grid2X2, List, Plus, Search, SlidersHorizontal } from "lucide-react";
import { useAcademicData } from "./data-provider";
import { AddTeacherModal } from "./add-teacher-modal";

export function TeachersDirectory() {
  const { data } = useAcademicData();
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [direction, setDirection] = useState("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [addOpen, setAddOpen] = useState(false);
  const teachers = useMemo(() => data.teachers.filter((teacher) => {
    const haystack = [teacher.name, teacher.englishName, teacher.institution, teacher.city, teacher.country, teacher.bio, ...teacher.publications.map((paper) => paper.title)].join(" ").toLowerCase();
    return (!query || haystack.includes(query.toLowerCase())) && (direction === "all" || teacher.directionIds.includes(direction));
  }), [data.teachers, direction, query]);
  return <>
    <div className="page-heading"><div><span className="eyebrow">SCHOLAR DIRECTORY</span><h1>学者资料库</h1><p>管理经过确认的老师、研究画像与外部学术身份。</p></div><button className="button primary" onClick={() => setAddOpen(true)}><Plus size={17} />新增老师</button></div>
    <div className="directory-toolbar"><label className="inline-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索姓名、机构或论文…" /></label><label className="select-control"><SlidersHorizontal size={16} /><select value={direction} onChange={(event) => setDirection(event.target.value)}><option value="all">全部研究方向</option>{data.directions.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label><div className="view-toggle"><button className={view === "grid" ? "active" : ""} onClick={() => setView("grid")}><Grid2X2 size={16} /></button><button className={view === "list" ? "active" : ""} onClick={() => setView("list")}><List size={16} /></button></div></div>
    <div className={view === "grid" ? "teacher-directory-grid" : "teacher-directory-list"}>{teachers.map((teacher) => <Link href={`/teacher?id=${teacher.id}`} className="teacher-profile-card" key={teacher.id}><div className="profile-card-top"><span className="avatar large">{teacher.initials}</span><span className="score-pill">{teacher.relevance}% 匹配</span></div><h2>{teacher.name}</h2><p>{teacher.title}</p><strong>{teacher.institution}</strong><small>{teacher.city} · {teacher.country}</small><div className="chip-row">{teacher.directionIds.slice(0, 2).map((id) => <span className="chip" key={id}>{data.directions.find((item) => item.id === id)?.name}</span>)}</div><div className="profile-card-footer"><span>{teacher.publications.length} 篇论文</span><span>更新于 {teacher.lastUpdated}</span></div></Link>)}</div>
    {teachers.length === 0 && <div className="large-empty"><Search size={28} /><h2>没有找到匹配老师</h2><p>尝试更换关键词或研究方向。</p></div>}
    {addOpen && <AddTeacherModal onClose={() => setAddOpen(false)} />}
  </>;
}
