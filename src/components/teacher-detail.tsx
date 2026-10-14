"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowUpRight, BookOpen, Check, ExternalLink, HeartHandshake, LockKeyhole, Mail, MapPin, Pencil, RefreshCw, ShieldCheck, Star } from "lucide-react";
import { useAcademicData } from "./data-provider";

export function TeacherDetail({ id }: { id: string }) {
  const { data, updateTeacher } = useAcademicData();
  const teacher = data.teachers.find((item) => item.id === id);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(teacher?.bio ?? "");
  const [year, setYear] = useState("all");
  const papers = useMemo(() => teacher?.publications.filter((paper) => year === "all" || String(paper.year) === year) ?? [], [teacher, year]);
  if (!teacher) return <div className="large-empty"><h1>没有找到这位老师</h1><Link href="/teachers" className="button primary">返回资料库</Link></div>;
  const saveBio = () => { updateTeacher(teacher.id, { bio, bioApproved: true, bioSource: "手动编辑 · 已锁定" }, ["bio"]); setEditing(false); };
  return <>
    <Link href="/teachers" className="back-link"><ArrowLeft size={16} />返回学者资料库</Link>
    <section className="teacher-hero">
      <span className="avatar hero-avatar">{teacher.initials}</span>
      <div className="teacher-identity"><div className="teacher-title-row"><div><span className="eyebrow">CONFIRMED SCHOLAR</span><h1>{teacher.name}</h1><p>{teacher.englishName}</p></div><span className="confirmed"><ShieldCheck size={15} />已确认</span></div><h2>{teacher.title} · {teacher.department}</h2><p className="institution-line"><MapPin size={16} />{teacher.institution} · {teacher.city}, {teacher.country}</p><div className="chip-row">{teacher.directionIds.map((directionId) => <span className="chip" key={directionId}>{data.directions.find((item) => item.id === directionId)?.name}</span>)}{teacher.tagIds.map((tagId) => { const tag = data.tags.find((item) => item.id === tagId); return tag ? <span className="chip" key={tagId} style={{ color: tag.color, background: tag.background }}>{tag.name}</span> : null; })}</div></div>
      <div className="teacher-hero-actions"><button className="button ghost" onClick={() => setEditing(true)}><Pencil size={16} />编辑资料</button><button className="button ghost" disabled title="部署私有后端后启用"><RefreshCw size={16} />同步需后端</button><Link href={`/interactions?teacher=${teacher.id}`} className="button primary"><HeartHandshake size={17} />我的互动记录</Link></div>
    </section>
    <div className="teacher-detail-grid">
      <div className="teacher-detail-main">
        <section className="content-card profile-section"><div className="card-heading"><div><span className="eyebrow">PROFILE</span><h2>个人简介</h2></div>{teacher.lockedFields.includes("bio") && <span className="locked"><LockKeyhole size={14} />人工锁定</span>}</div>{editing ? <div className="bio-editor"><textarea value={bio} onChange={(event) => setBio(event.target.value)} rows={5} /><div><button className="button ghost" onClick={() => setEditing(false)}>取消</button><button className="button primary" onClick={saveBio}><Check size={16} />保存并锁定</button></div></div> : <p className="bio-copy">{teacher.bio}</p>}<footer><span>来源：{teacher.bioSource}</span><span>更新：{teacher.lastUpdated}</span></footer></section>
        <section className="content-card profile-section"><div className="card-heading"><div><span className="eyebrow">PUBLICATIONS</span><h2>论文列表 <small>{teacher.publications.length}</small></h2></div><select value={year} onChange={(event) => setYear(event.target.value)}><option value="all">全部年份</option><option value="2026">2026</option><option value="2025">2025</option></select></div>{papers.map((paper) => <article className="detail-paper" key={paper.id}><button className={paper.isImportant ? "star active" : "star"}><Star size={17} /></button><div><div className="paper-labels">{paper.isNew && <span className="new-badge">今日新增</span>}<span>{paper.year}</span><span>{paper.venue}</span></div><h3>{paper.title}</h3><p>{paper.authors}</p><footer><span>引用 {paper.citations}</span><span>来源：{paper.source}</span>{paper.doi && <span>DOI {paper.doi}</span>}</footer></div><button className="icon-button"><ArrowUpRight size={17} /></button></article>)}</section>
      </div>
      <aside className="teacher-detail-side">
        <section className="content-card info-list"><span className="eyebrow">CONTACT</span><h2>联系与主页</h2>{teacher.email && <a href={`mailto:${teacher.email}`}><Mail size={16} /><span><small>邮箱</small>{teacher.email}</span></a>}{teacher.homepage && <a href={teacher.homepage} target="_blank"><ExternalLink size={16} /><span><small>个人主页</small>访问机构页面</span></a>}{teacher.scholarUrl && <a href={teacher.scholarUrl} target="_blank"><BookOpen size={16} /><span><small>Google Scholar</small>打开外部链接</span></a>}</section>
        <section className="content-card identity-list"><span className="eyebrow">IDENTIFIERS</span><h2>学术身份</h2>{teacher.identities.map((identity) => <a href={identity.url} target="_blank" key={identity.source}><span><small>{identity.source}</small><strong>{identity.value}</strong></span><ExternalLink size={15} /></a>)}</section>
        <section className="content-card sync-card"><div><RefreshCw size={19} /><span><strong>本地资料模式</strong><small>记录值：{teacher.lastSynced}</small></span></div><p>自动论文同步需要部署私有后端后才会运行。</p></section>
      </aside>
    </div>
  </>;
}
