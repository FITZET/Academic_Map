"use client";

import dynamic from "next/dynamic";
import { Layers3 } from "lucide-react";
import type { ResearchDirection, Tag, Teacher } from "@/lib/types";

const MapCanvas = dynamic(() => import("./map-canvas"), { ssr: false, loading: () => <div className="map-loading"><span /><p>正在载入学术地图…</p></div> });

export function MapPanel(props: { teachers: Teacher[]; directions: ResearchDirection[]; tags: Tag[]; continent: string; onContinentChange: (value: string) => void }) {
  const continents = ["全球", "亚洲", "欧洲", "北美洲", "南美洲", "非洲", "大洋洲"];
  return <section className="map-card">
    <div className="map-toolbar">
      <div className="continent-tabs">{continents.map((item) => <button key={item} className={props.continent === item ? "active" : ""} onClick={() => props.onContinentChange(item)}>{item}</button>)}</div>
      <button className="map-layer-button"><Layers3 size={16} /> 图层</button>
    </div>
    <MapCanvas teachers={props.teachers} directions={props.directions} tags={props.tags} continent={props.continent} />
    <div className="map-legend"><span><i className="dot red" />已确认老师</span><span><i className="dot orange" />待审核候选</span><strong>{props.teachers.length} 位老师</strong></div>
  </section>;
}
