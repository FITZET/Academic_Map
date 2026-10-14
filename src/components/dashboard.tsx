"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowRight, BookOpen, ChevronDown, Clock3, Filter, Plus, Radar, RefreshCw, Sparkles, UserCheck } from "lucide-react";
import { useAcademicData } from "./data-provider";
import { MapPanel } from "./map-panel";
import { AddTeacherModal } from "./add-teacher-modal";
import { DiscoverModal } from "./discover-modal";

export function Dashboard() {
  const { data } = useAcademicData();
  const searchParams = useSearchParams();
  const [selectedDirection, setSelectedDirection] = useState(searchParams.get("direction") ?? "all");
  const [continent, setContinent] = useState("全球");
  const [tag, setTag] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [discoverOpen, setDiscoverOpen] = useState(false);

  const visibleTeachers = useMemo(() => data.teachers.filter((teacher) => {
    const directionMatch = selectedDirection === "all" || teacher.directionIds.includes(selectedDirection);
    const continentMatch = continent === "全球" || teacher.continent === continent;
    const tagMatch = tag === "all" || teacher.tagIds.includes(tag);
    return directionMatch && continentMatch && tagMatch;
  }), [continent, data.teachers, selectedDirection, tag]);

  const publications = data.teachers.flatMap((teacher) => teacher.publications.map((publication) => ({ ...publication, teacher }))).sort((a, b) => b.discoveredAt.localeCompare(a.discoveredAt));
  const pendingCount = data.candidates.filter((candidate) => candidate.status === "pending").length;
  const activeDirection = data.directions.find((direction) => direction.id === selectedDirection);

  return <>
    <div className="page-heading dashboard-heading">
      <div><span className="eyebrow">PERSONAL RESEARCH INTELLIGENCE</span><h1>{activeDirection?.name ?? "我的学术地图"}</h1><p>{activeDirection?.description ?? "从地理分布出发，追踪你关心的研究者、论文与真实连接。"}</p></div>
      <div className="heading-actions"><button className="button ghost" onClick={() => setAddOpen(true)}><Plus size={17} />新增老师</button><button className="button primary" onClick={() => setDiscoverOpen(true)}><Radar size={17} />自动发现老师</button></div>
    </div>

    <section className="stat-grid">
      <article className="stat-card"><div className="stat-icon blue"><UserCheck size={20} /></div><div><span>已确认老师</span><strong>{data.teachers.length}</strong><small>覆盖 {new Set(data.teachers.map((teacher) => teacher.country)).size} 个国家</small></div><span className="trend">+2 本月</span></article>
      <article className="stat-card"><div className="stat-icon orange"><Sparkles size={20} /></div><div><span>待审核候选</span><strong>{pendingCount}</strong><small>平均匹配度 91%</small></div><Link href="/candidates">去审核 <ArrowRight size={14} /></Link></article>
      <article className="stat-card"><div className="stat-icon green"><BookOpen size={20} /></div><div><span>今日新增论文</span><strong>{publications.filter((paper) => paper.isNew).length}</strong><small>来自 {new Set(publications.filter((paper) => paper.isNew).map((paper) => paper.teacher.id)).size} 位老师</small></div><Link href="/publications">查看动态 <ArrowRight size={14} /></Link></article>
      <article className="stat-card"><div className="stat-icon violet"><RefreshCw size={20} /></div><div><span>同步健康度</span><strong>98%</strong><small>下次同步 明日 03:00</small></div><span className="healthy">正常</span></article>
    </section>

    <div className="map-section-head">
      <div className="segmented-control"><button className={selectedDirection === "all" ? "active" : ""} onClick={() => setSelectedDirection("all")}>全部方向</button>{data.directions.map((direction) => <button key={direction.id} className={selectedDirection === direction.id ? "active" : ""} onClick={() => setSelectedDirection(direction.id)}>{direction.name}</button>)}</div>
      <div className="filter-actions"><label><Filter size={15} /><select value={tag} onChange={(event) => setTag(event.target.value)}><option value="all">全部标签</option>{data.tags.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select><ChevronDown size={14} /></label></div>
    </div>

    <div className="map-layout">
      <MapPanel teachers={visibleTeachers} directions={data.directions} tags={data.tags} continent={continent} onContinentChange={setContinent} />
      <aside className="map-list-panel">
        <div className="panel-title"><div><span className="eyebrow">当前视图</span><h2>{continent === "全球" ? "全球学者" : continent}</h2></div><span>{visibleTeachers.length} 位</span></div>
        <div className="teacher-scroll-list">{visibleTeachers.map((teacher) => <Link href={`/teacher?id=${teacher.id}`} className="teacher-list-item" key={teacher.id}><span className="avatar">{teacher.initials}</span><div><strong>{teacher.name}</strong><small>{teacher.institution}</small><em>{teacher.city} · {teacher.country}</em></div><span className="score">{teacher.relevance}%</span></Link>)}{visibleTeachers.length === 0 && <div className="empty-state"><p>当前筛选下没有老师</p><button onClick={() => { setTag("all"); setContinent("全球"); }}>清除筛选</button></div>}</div>
      </aside>
    </div>

    <section className="dashboard-lower-grid">
      <article className="content-card recent-papers"><div className="card-heading"><div><span className="eyebrow">LIVE UPDATES</span><h2>最近新增论文</h2></div><Link href="/publications">查看全部 <ArrowRight size={15} /></Link></div>{publications.slice(0, 4).map((paper) => <div className="paper-row" key={paper.id}><div className={paper.isNew ? "paper-date new" : "paper-date"}><strong>{paper.discoveredAt.slice(5)}</strong><span>{paper.isNew ? "NEW" : paper.year}</span></div><div className="paper-main"><strong>{paper.title}</strong><p>{paper.teacher.name} · {paper.venue} · 引用 {paper.citations}</p><div className="chip-row">{paper.directionIds.map((id) => <span className="chip" key={id}>{data.directions.find((item) => item.id === id)?.name}</span>)}</div></div><button className="icon-button"><ArrowRight size={16} /></button></div>)}</article>
      <article className="content-card activity-card"><div className="card-heading"><div><span className="eyebrow">SYNC OVERVIEW</span><h2>更新摘要</h2></div><button className="icon-button"><RefreshCw size={16} /></button></div><div className="timeline"><div><i className="green" /><span><strong>论文同步完成</strong><small>6 位老师，新增 3 篇论文</small></span><time>03:22</time></div><div><i className="orange" /><span><strong>1 条机构变更待确认</strong><small>自动同步不会覆盖人工信息</small></span><time>03:18</time></div><div><i className="blue" /><span><strong>候选发现任务完成</strong><small>医学图像分割 · 3 位候选</small></span><time>昨天</time></div></div><div className="next-sync"><Clock3 size={17} /><span><strong>下次自动同步</strong><small>2026 年 10 月 15 日 03:00</small></span></div></article>
    </section>
    {addOpen && <AddTeacherModal onClose={() => setAddOpen(false)} />}
    {discoverOpen && <DiscoverModal onClose={() => setDiscoverOpen(false)} />}
  </>;
}
