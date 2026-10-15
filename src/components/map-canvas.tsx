"use client";

import Link from "next/link";
import { useEffect } from "react";
import { CircleMarker, ImageOverlay, MapContainer, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { feature } from "topojson-client";
import { geoMercator, geoPath } from "d3-geo";
import type { GeoSphere } from "d3-geo";
import type { GeometryCollection, Topology } from "topojson-specification";
import type { FeatureCollection, Geometry } from "geojson";
import worldAtlas from "world-atlas/countries-110m.json";
import type { ResearchDirection, Tag, Teacher } from "@/lib/types";

const worldCountries = feature(
  worldAtlas as unknown as Topology,
  (worldAtlas as unknown as Topology).objects.countries as GeometryCollection,
) as unknown as FeatureCollection<Geometry>;

const projection = geoMercator()
  .scale(1000 / (2 * Math.PI))
  .translate([500, 500])
  .clipExtent([[0, 0], [1000, 1000]]);
const countryPath = geoPath(projection)(worldCountries) ?? "";
const spherePath = geoPath(projection)({ type: "Sphere" } as GeoSphere) ?? "";
const worldSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><path d="${spherePath}" fill="#dfe9ed"/><path d="${countryPath}" fill="#eef2f1" stroke="#b8c4c9" stroke-width="0.75" vector-effect="non-scaling-stroke"/></svg>`;
const worldMapUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(worldSvg)}`;

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
    <MapContainer center={[24, 12]} zoom={2} minZoom={2} maxZoom={9} zoomControl={false} className="leaflet-map" worldCopyJump maxBounds={[[-85, -190], [85, 190]]}>
      <ImageOverlay url={worldMapUrl} bounds={[[-85.0511, -180], [85.0511, 180]]} opacity={1} />
      <MapController teachers={teachers} continent={continent} />
      {teachers.map((teacher) => (
        <CircleMarker key={teacher.id} center={[teacher.latitude, teacher.longitude]} radius={9} pathOptions={{ color: "#ffffff", weight: 3, fillColor: "#c94d50", fillOpacity: 1 }}>
          <Popup minWidth={280} offset={[0, -4]}>
            <div className="map-popup">
              <div className="map-popup-person"><span className="avatar">{teacher.initials}</span><div><strong>{teacher.name}</strong><small>{teacher.title}</small></div></div>
              <p className="map-popup-institution">{teacher.institution}<br />{teacher.city} · {teacher.country}</p>
              <div className="chip-row">{teacher.directionIds.slice(0, 2).map((id) => <span className="chip" key={id}>{directions.find((item) => item.id === id)?.name}</span>)}{teacher.tagIds.slice(0, 1).map((id) => { const tag = tags.find((item) => item.id === id); return tag ? <span className="chip" key={id} style={{ color: tag.color, background: tag.background }}>{tag.name}</span> : null; })}</div>
              <Link href={`/teacher?id=${teacher.id}`} className="button primary full">查看标签与互动记录 →</Link>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
