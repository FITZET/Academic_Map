"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Filter, Plus, Search, X } from "lucide-react";
import { useAcademicData } from "./data-provider";
import { MapPanel } from "./map-panel";
import { DiscoveryDialog } from "./discovery-dialog";
import { isDemoTeacher } from "@/lib/demo";

export function Dashboard() {
  const { data, createDirection } = useAcademicData();
  const [directionId, setDirectionId] = useState("all");
  const [tagId, setTagId] = useState("all");
  const [continent, setContinent] = useState("全球");
  const [showNewDirection, setShowNewDirection] = useState(false);
  const [showDiscovery, setShowDiscovery] = useState(false);
  const [newName, setNewName] = useState("");
  const [newKeywords, setNewKeywords] = useState("");
  const pendingCount = data.candidates.filter((candidate) => candidate.status === "pending").length;
  const submitDirection = (event: React.FormEvent) => {
    event.preventDefault();
    const id = createDirection(newName, newKeywords);
    if (id) { setDirectionId(id); setShowNewDirection(false); setNewName(""); setNewKeywords(""); }
  };
  const researchers = useMemo(() => data.teachers.filter((teacher) =>
    (directionId === "all" || teacher.directionIds.includes(directionId)) &&
    (tagId === "all" || teacher.tagIds.includes(tagId)) &&
    (continent === "全球" || teacher.continent === continent)), [continent, data.teachers, directionId, tagId]);

  return <>
    <section className="minimal-intro">
      <div><span className="eyebrow">PERSONAL ACADEMIC MAP</span><h1>研究者地图</h1><p>按领域发现和整理学者；审核后上图，标签与互动只保存在本机。</p></div>
      <span className="researcher-count">{researchers.length} 位研究者</span>
    </section>
    <div className="minimal-actions"><button className="button ghost" onClick={() => setShowNewDirection(true)}><Plus size={15} />新建领域</button><button className="button primary" onClick={() => setShowDiscovery(true)}><Search size={15} />发现学者</button><Link href="/review" className="button ghost">待审核 {pendingCount}</Link></div>
    <section className="minimal-filters" aria-label="地图筛选">
      <div className="direction-pills"><button className={directionId === "all" ? "active" : ""} onClick={() => setDirectionId("all")}>全部</button>{data.directions.map((direction) => <button key={direction.id} className={directionId === direction.id ? "active" : ""} onClick={() => setDirectionId(direction.id)}>{direction.name}</button>)}</div>
      <label className="tag-filter"><Filter size={15} /><select value={tagId} onChange={(event) => setTagId(event.target.value)}><option value="all">全部标签</option>{data.tags.map((tag) => <option key={tag.id} value={tag.id}>{tag.name}</option>)}</select></label>
    </section>
    <div className="minimal-map-layout">
      <MapPanel teachers={researchers} directions={data.directions} tags={data.tags} continent={continent} onContinentChange={setContinent} />
      <aside className="minimal-list"><div className="minimal-list-head"><strong>当前研究者</strong><span>{researchers.length}</span></div>{researchers.map((teacher) => <Link href={`/teacher?id=${teacher.id}`} className="minimal-researcher" key={teacher.id}><span className="avatar">{teacher.initials}</span><div><strong>{teacher.name}{isDemoTeacher(teacher.id) && <span className="demo-label">示例</span>}</strong><small>{teacher.institution}</small><em>{teacher.city} · {teacher.country}</em></div></Link>)}{researchers.length === 0 && <p className="minimal-empty">当前筛选没有研究者。</p>}</aside>
    </div>
    <p className="demo-notice">内置研究者为虚构界面示例，不代表真实学者。豆包搜索到的学者须经你核对来源后才会加入地图。</p>
    {showDiscovery && <DiscoveryDialog directionId={directionId} onClose={() => setShowDiscovery(false)} />}
    {showNewDirection && <div className="simple-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowNewDirection(false); }}><form className="simple-modal" role="dialog" aria-modal="true" aria-labelledby="new-direction-title" onSubmit={submitDirection}><div className="simple-modal-head"><div><span className="eyebrow">RESEARCH FIELD</span><h2 id="new-direction-title">新建研究领域</h2></div><button type="button" className="icon-button" onClick={() => setShowNewDirection(false)} aria-label="关闭"><X size={17} /></button></div><label className="simple-field">领域名称<input autoFocus required value={newName} onChange={(event) => setNewName(event.target.value)} placeholder="例如：医学图像分割" /></label><label className="simple-field">搜索关键词（可选）<textarea rows={3} value={newKeywords} onChange={(event) => setNewKeywords(event.target.value)} placeholder="可用逗号分隔中英文关键词" /></label><div className="simple-actions"><button className="button primary">创建领域</button></div></form></div>}
  </>;
}
