"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, BookOpen, Search, Star } from "lucide-react";
import { useAcademicData } from "@/components/data-provider";

export default function PublicationsPage() {
  const { data } = useAcademicData();
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("all");
  const rows = useMemo(() => data.teachers.flatMap((teacher) => teacher.publications.map((publication) => ({ ...publication, teacher }))).filter((paper) => (!query || paper.title.toLowerCase().includes(query.toLowerCase())) && (year === "all" || String(paper.year) === year)).sort((a, b) => b.year - a.year || b.citations - a.citations), [data.teachers, query, year]);
  return <><div className="page-heading"><div><span className="eyebrow">PUBLICATION TRACKER</span><h1>论文动态</h1><p>追踪已收录老师的最新成果，并保留来源和同步记录。</p></div><button className="button primary"><BookOpen size={17} />手动同步</button></div><div className="directory-toolbar"><label className="inline-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索论文标题…" /></label><label className="select-control"><select value={year} onChange={(event) => setYear(event.target.value)}><option value="all">全部年份</option><option value="2026">2026</option><option value="2025">2025</option></select></label><span className="result-count">共 {rows.length} 篇</span></div><section className="publication-table content-card"><div className="table-head"><span>论文</span><span>年份 / 来源</span><span>引用</span><span /></div>{rows.map((paper) => <article key={paper.id}><div className="publication-title"><button className={paper.isImportant ? "star active" : "star"}><Star size={16} /></button><div><strong>{paper.title}</strong><p>{paper.authors}</p><span>{paper.venue} · 归属 {paper.teacher.name}</span></div></div><div><strong>{paper.year}</strong><small>{paper.source}</small>{paper.isNew && <em className="new-badge">今日新增</em>}</div><div className="citation-count"><strong>{paper.citations}</strong><small>次引用</small></div><button className="icon-button"><ArrowUpRight size={17} /></button></article>)}</section></>;
}
