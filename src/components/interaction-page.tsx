"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, CalendarDays, Camera, LockKeyhole, MapPin, Plus, Sparkles } from "lucide-react";
import { useAcademicData } from "./data-provider";

export function InteractionPage({ teacherId }: { teacherId: string }) {
  const { data, addInteraction } = useAcademicData();
  const teacher = data.teachers.find((item) => item.id === teacherId);
  const records = data.interactions.filter((item) => item.teacherId === teacherId);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ date: "2026-10-15", location: "", eventName: "", type: "线下交流", content: "", hobbies: "", impression: "", followUp: "" });
  if (!teacher) return <div className="large-empty"><h1>没有找到这位老师</h1></div>;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    addInteraction({ ...form, teacherId, hobbies: form.hobbies.split(/[、,，]/).map((item) => item.trim()).filter(Boolean) });
    setOpen(false);
  };

  return <>
    <Link href={`/teacher?id=${teacher.id}`} className="back-link"><ArrowLeft size={16} />返回 {teacher.name} 的资料页</Link>
    <div className="page-heading interaction-heading"><div><span className="eyebrow">PRIVATE RELATIONSHIP NOTES</span><h1>与 {teacher.name} 的互动</h1><p>记录真实交流、共同活动与下一次联系计划。</p></div><button className="button primary" onClick={() => setOpen(!open)}><Plus size={17} />新增互动记录</button></div>
    <div className="private-banner"><LockKeyhole size={20} /><div><strong>这是你的私人空间</strong><p>以下内容不会出现在公开搜索，也不会发送给任何外部学术数据服务。</p></div></div>
    {open && <form className="interaction-form content-card" onSubmit={submit}>
      <div className="form-grid three"><label>日期<input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></label><label>地点<input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="城市 / 会场" /></label><label>互动类型<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option>线下交流</option><option>线上会议</option><option>邮件联系</option><option>共同活动</option></select></label></div>
      <label>活动名称<input value={form.eventName} onChange={(e) => setForm({ ...form, eventName: e.target.value })} placeholder="例如：MICCAI Workshop" /></label>
      <label>交流记录<textarea rows={4} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="聊了什么？有哪些值得记住的信息？" /></label>
      <div className="form-grid"><label>爱好（用逗号分隔）<input value={form.hobbies} onChange={(e) => setForm({ ...form, hobbies: e.target.value })} /></label><label>后续计划<input value={form.followUp} onChange={(e) => setForm({ ...form, followUp: e.target.value })} /></label></div>
      <label>个人印象<input value={form.impression} onChange={(e) => setForm({ ...form, impression: e.target.value })} /></label>
      <div className="upload-placeholder"><Camera size={20} /><span>拖入合影或附件</span><small>MVP 中展示交互入口，接入 S3 后可正式上传</small></div>
      <div className="modal-actions"><button type="button" className="button ghost" onClick={() => setOpen(false)}>取消</button><button className="button primary">保存记录</button></div>
    </form>}
    <div className="interaction-layout"><section className="interaction-timeline">
      {records.map((record) => <article className="interaction-record" key={record.id}><div className="record-date"><strong>{record.date.slice(5)}</strong><span>{record.date.slice(0, 4)}</span></div><div className="record-line"><i /></div><div className="content-card record-card"><div className="record-head"><div><span>{record.type}</span><h2>{record.eventName || "互动记录"}</h2></div><div><span><CalendarDays size={14} />{record.date}</span><span><MapPin size={14} />{record.location}</span></div></div><p>{record.content}</p><div className="record-columns"><div><small>个人印象</small><strong>{record.impression || "—"}</strong></div><div><small>后续事项</small><strong>{record.followUp || "—"}</strong></div></div>{record.hobbies.length > 0 && <div className="chip-row"><Sparkles size={14} />{record.hobbies.map((hobby) => <span className="chip" key={hobby}>{hobby}</span>)}</div>}</div></article>)}
      {records.length === 0 && !open && <div className="large-empty"><CalendarDays size={30} /><h2>还没有互动记录</h2><p>记录第一次见面、一次邮件交流或共同参加的活动。</p></div>}
    </section><aside className="relationship-summary content-card"><span className="eyebrow">RELATIONSHIP SNAPSHOT</span><h2>关系摘要</h2><dl><div><dt>互动次数</dt><dd>{records.length}</dd></div><div><dt>最近见面</dt><dd>{records[0]?.date ?? "暂无"}</dd></div><div><dt>共同活动</dt><dd>{records.filter((item) => item.eventName).length}</dd></div></dl><h3>已知爱好</h3><div className="chip-row">{[...new Set(records.flatMap((record) => record.hobbies))].map((item) => <span className="chip" key={item}>{item}</span>)}</div></aside></div>
  </>;
}
