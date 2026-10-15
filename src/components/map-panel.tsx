"use client";

import dynamic from "next/dynamic";
import type { ResearchDirection, Tag, Teacher } from "@/lib/types";

const MapCanvas = dynamic(() => import("./map-canvas"), { ssr: false, loading: () => <div className="map-loading"><span /><p>正在载入地图…</p></div> });

export function MapPanel(props: { teachers: Teacher[]; directions: ResearchDirection[]; tags: Tag[]; continent: string; onContinentChange: (value: string) => void }) {
  const continents = ["全球", "亚洲", "欧洲", "北美洲", "南美洲", "非洲", "大洋洲"];
  return <section className="map-card minimal-map-card">
    <div className="map-toolbar"><div className="continent-tabs">{continents.map((item) => <button key={item} className={props.continent === item ? "active" : ""} onClick={() => props.onContinentChange(item)}>{item}</button>)}</div></div>
    <MapCanvas teachers={props.teachers} directions={props.directions} tags={props.tags} continent={props.continent} />
    <div className="map-legend"><span><i className="dot red" />研究者</span><strong>{props.teachers.length} 位</strong></div>
  </section>;
}
