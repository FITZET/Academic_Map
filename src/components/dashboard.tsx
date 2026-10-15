"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Filter } from "lucide-react";
import { useAcademicData } from "./data-provider";
import { MapPanel } from "./map-panel";

export function Dashboard() {
  const { data } = useAcademicData();
  const [directionId, setDirectionId] = useState("all");
  const [tagId, setTagId] = useState("all");
  const [continent, setContinent] = useState("全球");
  const researchers = useMemo(() => data.teachers.filter((teacher) =>
    (directionId === "all" || teacher.directionIds.includes(directionId)) &&
    (tagId === "all" || teacher.tagIds.includes(tagId)) &&
    (continent === "全球" || teacher.continent === continent)), [continent, data.teachers, directionId, tagId]);

  return <>
    <section className="minimal-intro">
      <div><span className="eyebrow">PERSONAL ACADEMIC MAP</span><h1>研究者地图</h1><p>按研究方向浏览研究者分布；点击红点，为研究者添加标签和互动记录。</p></div>
      <span className="researcher-count">{researchers.length} 位研究者</span>
    </section>
    <section className="minimal-filters" aria-label="地图筛选">
      <div className="direction-pills"><button className={directionId === "all" ? "active" : ""} onClick={() => setDirectionId("all")}>全部</button>{data.directions.map((direction) => <button key={direction.id} className={directionId === direction.id ? "active" : ""} onClick={() => setDirectionId(direction.id)}>{direction.name}</button>)}</div>
      <label className="tag-filter"><Filter size={15} /><select value={tagId} onChange={(event) => setTagId(event.target.value)}><option value="all">全部标签</option>{data.tags.map((tag) => <option key={tag.id} value={tag.id}>{tag.name}</option>)}</select></label>
    </section>
    <div className="minimal-map-layout">
      <MapPanel teachers={researchers} directions={data.directions} tags={data.tags} continent={continent} onContinentChange={setContinent} />
      <aside className="minimal-list"><div className="minimal-list-head"><strong>当前研究者</strong><span>{researchers.length}</span></div>{researchers.map((teacher) => <Link href={`/teacher?id=${teacher.id}`} className="minimal-researcher" key={teacher.id}><span className="avatar">{teacher.initials}</span><div><strong>{teacher.name}</strong><small>{teacher.institution}</small><em>{teacher.city} · {teacher.country}</em></div></Link>)}{researchers.length === 0 && <p className="minimal-empty">当前筛选没有研究者。</p>}</aside>
    </div>
  </>;
}
