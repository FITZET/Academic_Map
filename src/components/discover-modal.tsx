"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Radar, Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAcademicData } from "./data-provider";
import { discoverOpenAlexCandidates } from "@/lib/openalex-discovery";

export function DiscoverModal({ onClose }: { onClose: () => void }) {
  const { data, addCandidates } = useAcademicData();
  const router = useRouter();
  const [directionId, setDirectionId] = useState(data.directions[0]?.id ?? "");
  const [stage, setStage] = useState<"form" | "running" | "done">("form");
  const [query, setQuery] = useState(data.directions[0]?.keywords.join(" ") ?? "");
  const [fromYear, setFromYear] = useState(new Date().getFullYear() - 5);
  const [resultCount, setResultCount] = useState(0);
  const [error, setError] = useState("");
  const selectDirection = (id: string) => {
    setDirectionId(id);
    setQuery(data.directions.find((direction) => direction.id === id)?.keywords.join(" ") ?? "");
  };
  const start = async () => {
    setError("");
    setStage("running");
    try {
      const candidates = await discoverOpenAlexCandidates({
        query,
        directionId,
        fromYear,
        excludedNames: data.teachers.flatMap((teacher) => [teacher.name, teacher.englishName]),
      });
      addCandidates(candidates);
      setResultCount(candidates.length);
      setStage("done");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "未知网络错误");
      setStage("form");
    }
  };
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal-card discover-card" onMouseDown={(event) => event.stopPropagation()}>
    <div className="modal-head"><div><span className="eyebrow">智能发现</span><h2>发现领域相关老师</h2></div><button className="icon-button" onClick={onClose}><X size={18} /></button></div>
    {stage === "form" && <div className="form-stack"><label>选择研究方向<select value={directionId} onChange={(event) => selectDirection(event.target.value)}>{data.directions.map((direction) => <option value={direction.id} key={direction.id}>{direction.name}</option>)}</select></label><label>检索关键词<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="例如 medical image segmentation" /></label><label>论文起始年份<input type="number" min="1900" max={new Date().getFullYear()} value={fromYear} onChange={(event) => setFromYear(Number(event.target.value))} /></label><div className="discovery-source-list"><span><CheckCircle2 />OpenAlex 实时接口</span><span className="muted-source">其他来源尚未接入</span></div>{error && <div className="form-error">检索失败：{error}</div>}<div className="info-panel"><Sparkles size={18} /><p>系统会实时检索 OpenAlex 论文并聚合作者。身份与机构仍需你审核，结果不会直接进入正式地图。</p></div><button className="button primary full" onClick={start} disabled={!query.trim()}><Radar size={17} />开始实时发现</button></div>}
    {stage === "running" && <div className="discovery-running"><div className="radar"><i /><span /></div><h3>正在分析学术网络</h3><p>检索论文 · 聚合作者 · 校验机构 · 计算匹配度</p></div>}
    {stage === "done" && <div className="discovery-running done"><CheckCircle2 size={48} /><h3>OpenAlex 检索完成</h3><p>已生成 {resultCount} 位候选研究者，等待你的审核。</p><button className="button primary" onClick={() => router.push(`/candidates?direction=${directionId}`)}>前往审核 <ArrowRight size={17} /></button></div>}
  </div></div>;
}
