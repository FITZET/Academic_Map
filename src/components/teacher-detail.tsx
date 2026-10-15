"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, CalendarDays, MapPin, Plus, Tag as TagIcon } from "lucide-react";
import { useAcademicData } from "./data-provider";
import { isDemoTeacher } from "@/lib/demo";
import { safeWebUrl } from "@/lib/doubao";

export function TeacherDetail({ id }: { id: string }) {
  const { data, addInteraction, createTag, toggleTeacherTag } = useAcademicData();
  const teacher = data.teachers.find((item) => item.id === id);
  const [newTag, setNewTag] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), location: "", eventName: "", content: "", hobbies: "", followUp: "" });
  if (!teacher) return <div className="minimal-empty-page"><h1>没有找到这位研究者</h1><Link href="/" className="button primary">返回地图</Link></div>;
  const records = data.interactions.filter((item) => item.teacherId === teacher.id);
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    addInteraction({ teacherId: teacher.id, date: form.date, location: form.location, eventName: form.eventName, type: "互动", content: form.content, hobbies: form.hobbies.split(/[、,，]/).map((item) => item.trim()).filter(Boolean), impression: "", followUp: form.followUp });
    setForm({ date: new Date().toISOString().slice(0, 10), location: "", eventName: "", content: "", hobbies: "", followUp: "" });
    setShowForm(false);
  };
  const addTag = () => {
    const tagId = createTag(newTag);
    if (tagId && !teacher.tagIds.includes(tagId)) toggleTeacherTag(teacher.id, tagId);
    setNewTag("");
  };

  return <>
    <Link href="/" className="back-link"><ArrowLeft size={16} />返回地图</Link>
    <section className="minimal-profile">
      <span className="avatar profile-avatar">{teacher.initials}</span>
      <div><h1>{teacher.name}{isDemoTeacher(teacher.id) && <span className="demo-label">虚构示例</span>}</h1><p>{teacher.title} · {teacher.institution}</p><small><MapPin size={14} />{teacher.city} · {teacher.country}</small>{!isDemoTeacher(teacher.id) && safeWebUrl(teacher.homepage) && <a className="profile-source" href={safeWebUrl(teacher.homepage)} target="_blank" rel="noreferrer">查看已审核的人物来源 ↗</a>}</div>
    </section>
    <div className="minimal-detail-grid">
      <section className="minimal-section">
        <div className="section-heading"><div><span className="eyebrow">TAGS</span><h2>标签</h2></div></div>
        <div className="selected-tags">{teacher.tagIds.length ? teacher.tagIds.map((id) => { const tag = data.tags.find((item) => item.id === id); return tag ? <button key={tag.id} className="active-tag" style={{ color: tag.color, background: tag.background }} onClick={() => toggleTeacherTag(teacher.id, tag.id)}>{tag.name} ×</button> : null; }) : <p>还没有标签。</p>}</div>
        <div className="tag-choice-row">{data.tags.filter((tag) => !teacher.tagIds.includes(tag.id)).map((tag) => <button key={tag.id} onClick={() => toggleTeacherTag(teacher.id, tag.id)}><TagIcon size={13} />{tag.name}</button>)}</div>
        <div className="new-tag-row"><input value={newTag} onChange={(event) => setNewTag(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addTag(); } }} placeholder="新建标签" /><button className="button ghost" onClick={addTag}>添加</button></div>
      </section>
      <section className="minimal-section interaction-section">
        <div className="section-heading"><div><span className="eyebrow">PRIVATE NOTES</span><h2>互动记录</h2></div><button className="button primary" onClick={() => setShowForm((open) => !open)}><Plus size={16} />记录互动</button></div>
        {showForm && <form className="minimal-interaction-form" onSubmit={submit}><div><label>日期<input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></label><label>地点<input value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} placeholder="城市或会场" /></label></div><label>活动 / 场景<input value={form.eventName} onChange={(event) => setForm({ ...form, eventName: event.target.value })} placeholder="例如：会议交流" /></label><label>记录<textarea rows={4} required value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} placeholder="这次互动中值得记住的内容" /></label><div><label>爱好<input value={form.hobbies} onChange={(event) => setForm({ ...form, hobbies: event.target.value })} placeholder="逗号分隔" /></label><label>后续事项<input value={form.followUp} onChange={(event) => setForm({ ...form, followUp: event.target.value })} placeholder="下一步联系计划" /></label></div><button className="button primary">保存到本机</button></form>}
        <div className="minimal-records">{records.map((record) => <article key={record.id}><time><CalendarDays size={14} />{record.date}</time><strong>{record.eventName || record.location || "互动记录"}</strong><p>{record.content}</p>{record.hobbies.length > 0 && <div className="chip-row">{record.hobbies.map((hobby) => <span className="chip" key={hobby}>{hobby}</span>)}</div>}{record.followUp && <small>后续：{record.followUp}</small>}</article>)}{records.length === 0 && !showForm && <p className="minimal-empty">还没有互动记录。</p>}</div>
      </section>
    </div>
  </>;
}
