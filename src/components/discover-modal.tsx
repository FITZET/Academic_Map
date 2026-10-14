"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Radar, Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAcademicData } from "./data-provider";

export function DiscoverModal({ onClose }: { onClose: () => void }) {
  const { data } = useAcademicData();
  const router = useRouter();
  const [directionId, setDirectionId] = useState(data.directions[0]?.id ?? "");
  const [stage, setStage] = useState<"form" | "running" | "done">("form");
  const start = () => {
    setStage("running");
    window.setTimeout(() => setStage("done"), 1300);
  };
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal-card discover-card" onMouseDown={(event) => event.stopPropagation()}>
    <div className="modal-head"><div><span className="eyebrow">智能发现</span><h2>发现领域相关老师</h2></div><button className="icon-button" onClick={onClose}><X size={18} /></button></div>
    {stage === "form" && <div className="form-stack"><label>选择研究方向<select value={directionId} onChange={(event) => setDirectionId(event.target.value)}>{data.directions.map((direction) => <option value={direction.id} key={direction.id}>{direction.name}</option>)}</select></label><div className="discovery-source-list"><span><CheckCircle2 />OpenAlex</span><span><CheckCircle2 />Semantic Scholar</span><span><CheckCircle2 />ORCID</span></div><div className="info-panel"><Sparkles size={18} /><p>系统将检索相关论文、聚合作者并进行身份推断。所有结果都会先进入候选区，不会直接出现在地图上。</p></div><button className="button primary full" onClick={start}><Radar size={17} />开始发现</button></div>}
    {stage === "running" && <div className="discovery-running"><div className="radar"><i /><span /></div><h3>正在分析学术网络</h3><p>检索论文 · 聚合作者 · 校验机构 · 计算匹配度</p></div>}
    {stage === "done" && <div className="discovery-running done"><CheckCircle2 size={48} /><h3>发现任务已完成</h3><p>已准备 3 位高匹配度候选老师，等待你的审核。</p><button className="button primary" onClick={() => router.push(`/candidates?direction=${directionId}`)}>前往审核 <ArrowRight size={17} /></button></div>}
  </div></div>;
}
