"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useAcademicData } from "./data-provider";
import type { CandidateTeacher } from "@/lib/types";

function ReviewCard({ candidate }: { candidate: CandidateTeacher }) {
  const { data, reviewCandidate } = useAcademicData();
  const [draft, setDraft] = useState(candidate);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const validLocation = Number.isFinite(draft.latitude) && Number.isFinite(draft.longitude) && Math.abs(draft.latitude!) <= 90 && Math.abs(draft.longitude!) <= 180;
  const accept = () => {
    if (!verified || !draft.name.trim() || !draft.institution.trim() || !draft.continent || !validLocation) { setError("请核对来源，并填写姓名、机构、大洲和有效经纬度。"); return; }
    const duplicate = data.teachers.find((teacher) => teacher.name.toLocaleLowerCase() === draft.name.trim().toLocaleLowerCase() && teacher.institution.toLocaleLowerCase() === draft.institution.trim().toLocaleLowerCase());
    if (duplicate) { setError("地图里已有同名且同机构的研究者，请先核查，避免重复添加。"); return; }
    reviewCandidate(candidate.id, "accept", draft);
  };
  const update = (field: keyof CandidateTeacher, value: string) => setDraft((current) => ({ ...current, [field]: field === "latitude" || field === "longitude" ? (value === "" ? undefined : Number(value)) : value }));
  return <article className="review-card">
    <div className="review-card-head"><div><strong>{candidate.name}</strong><span>{data.directions.find((item) => item.id === candidate.directionId)?.name}</span></div><small>豆包联网搜索 · 待核对</small></div>
    <p className="simple-muted">{candidate.reason || "请检查其研究方向与身份。"}</p>
    <div className="review-links">{candidate.profileUrl && <a href={candidate.profileUrl} target="_blank" rel="noreferrer">人物主页 <ExternalLink size={13} /></a>}{candidate.evidenceUrl && candidate.evidenceUrl !== candidate.profileUrl && <a href={candidate.evidenceUrl} target="_blank" rel="noreferrer">其他证据 <ExternalLink size={13} /></a>}</div>
    <div className="review-fields">
      <label className="simple-field">姓名<input value={draft.name} onChange={(event) => update("name", event.target.value)} /></label>
      <label className="simple-field">职称<input value={draft.title} onChange={(event) => update("title", event.target.value)} /></label>
      <label className="simple-field wide">机构<input value={draft.institution} onChange={(event) => update("institution", event.target.value)} /></label>
      <label className="simple-field">城市<input value={draft.city} onChange={(event) => update("city", event.target.value)} /></label>
      <label className="simple-field">国家<input value={draft.country} onChange={(event) => update("country", event.target.value)} /></label>
      <label className="simple-field">大洲<select value={draft.continent || ""} onChange={(event) => update("continent", event.target.value)}><option value="">请选择</option>{["亚洲", "欧洲", "北美洲", "南美洲", "非洲", "大洋洲"].map((item) => <option key={item}>{item}</option>)}</select></label>
      <label className="simple-field">纬度<input type="number" step="any" value={draft.latitude ?? ""} onChange={(event) => update("latitude", event.target.value)} /></label>
      <label className="simple-field">经度<input type="number" step="any" value={draft.longitude ?? ""} onChange={(event) => update("longitude", event.target.value)} /></label>
    </div>
    <label className="review-confirm"><input type="checkbox" checked={verified} onChange={(event) => setVerified(event.target.checked)} />我已打开来源网页，核对身份、机构与位置</label>
    {error && <p className="simple-error" role="alert">{error}</p>}
    <div className="simple-actions"><button className="button primary" onClick={accept}>确认加入地图</button><button className="button ghost" onClick={() => reviewCandidate(candidate.id, "ignore")}>暂时忽略</button><button className="button ghost" onClick={() => reviewCandidate(candidate.id, "exclude")}>排除</button></div>
  </article>;
}

export function ReviewPage() {
  const { data } = useAcademicData();
  const pending = data.candidates.filter((candidate) => candidate.status === "pending");
  return <><Link href="/" className="back-link"><ArrowLeft size={16} />返回地图</Link><div className="review-heading"><span className="eyebrow">HUMAN REVIEW</span><h1>待审核学者</h1><p>豆包的搜索结果可能有同名或来源错误。只有你确认后，学者才会显示在地图上。</p></div><div className="review-list">{pending.map((candidate) => <ReviewCard key={candidate.id} candidate={candidate} />)}{pending.length === 0 && <div className="minimal-section"><p className="simple-muted">没有待审核学者。回地图选择研究领域，点击“发现学者”开始搜索。</p><Link href="/" className="button primary">返回地图</Link></div>}</div></>;
}
