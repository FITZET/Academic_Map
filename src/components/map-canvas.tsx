"use client";

import Link from "next/link";
import { useEffect } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import type { ResearchDirection, Tag, Teacher } from "@/lib/types";

const continentCenters: Record<string, { center: [number, number]; zoom: number }> = {
  全球: { center: [24, 12], zoom: 2 },
  亚洲: { center: [34, 100], zoom: 3 },
  欧洲: { center: [51, 12], zoom: 4 },
  北美洲: { center: [43, -101], zoom: 3 },
  南美洲: { center: [-17, -60], zoom: 3 },
  非洲: { center: [2, 20], zoom: 3 },
  大洋洲: { center: [-25, 135], zoom: 3 },
};

function MapController({ teachers, continent }: { teachers: Teacher[]; continent: string }) {
  const map = useMap();
  useEffect(() => {
    if (continent !== "全球") {
      const target = continentCenters[continent];
      map.flyTo(target.center, target.zoom, { duration: 0.7 });
      return;
    }
    if (teachers.length > 1) {
      map.fitBounds(L.latLngBounds(teachers.map((teacher) => [teacher.latitude, teacher.longitude])), { padding: [56, 56], maxZoom: 3 });
    }
  }, [continent, map, teachers]);
  return null;
}

export default function MapCanvas({ teachers, directions, tags, continent }: { teachers: Teacher[]; directions: ResearchDirection[]; tags: Tag[]; continent: string }) {
  return (
    <MapContainer center={[24, 12]} zoom={2} minZoom={2} maxZoom={9} zoomControl={false} className="leaflet-map" worldCopyJump>
      <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapController teachers={teachers} continent={continent} />
      {teachers.map((teacher) => (
        <CircleMarker key={teacher.id} center={[teacher.latitude, teacher.longitude]} radius={9} pathOptions={{ color: "#ffffff", weight: 3, fillColor: "#c94d50", fillOpacity: 1 }}>
          <Popup minWidth={280} offset={[0, -4]}>
            <div className="map-popup">
              <div className="map-popup-person"><span className="avatar">{teacher.initials}</span><div><strong>{teacher.name}</strong><small>{teacher.title}</small></div><em>{teacher.relevance}% 匹配</em></div>
              <p className="map-popup-institution">{teacher.institution}<br />{teacher.city} · {teacher.country}</p>
              <div className="chip-row">{teacher.directionIds.slice(0, 2).map((id) => <span className="chip" key={id}>{directions.find((item) => item.id === id)?.name}</span>)}{teacher.tagIds.slice(0, 1).map((id) => { const tag = tags.find((item) => item.id === id); return tag ? <span className="chip" key={id} style={{ color: tag.color, background: tag.background }}>{tag.name}</span> : null; })}</div>
              <div className="map-popup-paper"><span>最近论文</span><strong>{teacher.publications[0]?.title ?? "暂无论文"}</strong></div>
              <Link href={`/teacher?id=${teacher.id}`} className="button primary full">查看老师档案 →</Link>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
