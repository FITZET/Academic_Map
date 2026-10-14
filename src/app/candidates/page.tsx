"use client";

import { useState } from "react";
import { AlertTriangle, Check, Database, EyeOff, Merge, Search, ShieldCheck, UserPlus, X } from "lucide-react";
import { useAcademicData } from "@/components/data-provider";

export default function CandidatesPage() {
  const { data, acceptCandidate, updateCandidateStatus } = useAcademicData();
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const candidates = data.candidates.filter((candidate) => candidate.status === "pending" && candidate.name.toLowerCase().includes(query.toLowerCase()));
  const toggle = (id: string) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const acceptSelected = () => { selected.forEach(acceptCandidate); setSelected([]); };
  return <>
    <div className="page-heading"><div><span className="eyebrow">DISCOVERY REVIEW</span><h1>候选老师审核</h1><p>自动发现结果必须经过你的确认，才会正式进入学术地图。</p></div><div className="heading-actions"><button className="button ghost" disabled={!selected.length} onClick={() => selected.forEach((id) => updateCandidateStatus(id, "excluded"))}><X size={17} />批量排除</button><button className="button primary" disabled={!selected.length} onClick={acceptSelected}><Check size={17} />批量加入 ({selected.length})</button></div></div>
    <div className="review-notice"><ShieldCheck size={21} /><div><strong>人工审核保护已开启</strong><p>候选数据来自公开学术图谱，不会未经确认直接进入正式地图。</p></div><span>最后发现：今天 08:40</span></div>
    <div className="directory-toolbar"><label className="inline-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索候选老师…" /></label><span className="result-count">{candidates.length} 位待审核候选</span></div>
    <div className="candidate-list">{candidates.map((candidate) => <article className={selected.includes(candidate.id) ? "candidate-card selected" : "candidate-card"} key={candidate.id}>
      <label className="check-control"><input type="checkbox" checked={selected.includes(candidate.id)} onChange={() => toggle(candidate.id)} /><span /></label>
      <span className="avatar large">{candidate.initials}</span>
      <div className="candidate-main"><div className="candidate-name"><h2>{candidate.name}</h2><span className={`risk ${candidate.ambiguity === "低" ? "low" : "medium"}`}><AlertTriangle size={13} />同名风险 {candidate.ambiguity}</span></div><p>{candidate.title} · {candidate.institution}</p><small>{candidate.city} · {candidate.country}</small><div className="candidate-paper"><span>代表论文</span><strong>{candidate.representativePaper}</strong></div><div className="chip-row"><span className="chip">{data.directions.find((item) => item.id === candidate.directionId)?.name}</span><span className="chip">{candidate.inferredRole}</span><span className="chip">{candidate.source}</span></div></div>
      <div className="candidate-metrics"><div className="metric-ring" style={{ "--score": `${candidate.relevance * 3.6}deg` } as React.CSSProperties}><span>{candidate.relevance}<small>%</small></span></div><p>领域匹配度</p><dl><div><dt>相关论文</dt><dd>{candidate.relevantPaperCount}</dd></div><div><dt>信息完整度</dt><dd>{candidate.completeness}%</dd></div></dl></div>
      <div className="candidate-reason"><Database size={16} /><p>{candidate.reason}</p></div>
      <div className="candidate-actions"><button className="button primary" onClick={() => acceptCandidate(candidate.id)}><UserPlus size={16} />加入地图</button><button className="button ghost" onClick={() => updateCandidateStatus(candidate.id, "ignored")}><EyeOff size={16} />暂时忽略</button><button className="icon-button" title="合并重复人物"><Merge size={16} /></button></div>
    </article>)}</div>
    {candidates.length === 0 && <div className="large-empty"><Check size={30} /><h2>候选已全部处理</h2><p>可以从首页发起新的自动发现任务。</p></div>}
  </>;
}
