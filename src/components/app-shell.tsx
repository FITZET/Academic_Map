"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BookOpen, Compass, Database, Globe2, Moon, Search, Settings, Sun, Tags, Users, X } from "lucide-react";
import { useAcademicData } from "./data-provider";
import { searchData } from "@/lib/domain";
import { UpdateChecker } from "./update-checker";

const navigation = [
  { href: "/", label: "学术地图", icon: Globe2 },
  { href: "/directions", label: "研究方向", icon: Compass },
  { href: "/teachers", label: "学者资料库", icon: Users },
  { href: "/candidates", label: "候选老师", icon: Database },
  { href: "/publications", label: "论文动态", icon: BookOpen },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data } = useAcademicData();
  const [query, setQuery] = useState("");
  const [dark, setDark] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const results = useMemo(() => searchData(data, query), [data, query]);

  useEffect(() => {
    const stored = window.localStorage.getItem("academic-atlas-theme");
    const shouldUseDark = stored === "dark";
    setDark(shouldUseDark);
    document.documentElement.dataset.theme = shouldUseDark ? "dark" : "light";
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    window.localStorage.setItem("academic-atlas-theme", next ? "dark" : "light");
  };

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (query.trim()) router.push(`/teachers?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
  };

  return (
    <div className="app-shell">
      <UpdateChecker />
      <aside className="sidebar">
        <Link href="/" className="brand" aria-label="Academic Atlas 首页">
          <span className="brand-mark"><Globe2 size={22} /></span>
          <span><strong>Academic</strong><em>Atlas</em></span>
        </Link>
        <nav className="main-nav" aria-label="主导航">
          {navigation.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return <Link key={item.href} href={item.href} className={active ? "nav-item active" : "nav-item"}><item.icon size={18} /><span>{item.label}</span>{item.href === "/candidates" && <b>{data.candidates.filter((candidate) => candidate.status === "pending").length}</b>}</Link>;
          })}
        </nav>
        <div className="sidebar-section">
          <p className="eyebrow">研究方向</p>
          {data.directions.slice(0, 5).map((direction) => <Link href={`/?direction=${direction.id}`} className="direction-link" key={direction.id}><i style={{ background: direction.color }} />{direction.name}<span>{data.teachers.filter((teacher) => teacher.directionIds.includes(direction.id)).length}</span></Link>)}
        </div>
        <div className="sidebar-footer">
          <button className="nav-item button-reset" onClick={toggleTheme}>{dark ? <Sun size={18} /> : <Moon size={18} />}<span>{dark ? "浅色模式" : "深色模式"}</span></button>
          <Link href="/settings" className={pathname.startsWith("/settings") ? "nav-item active" : "nav-item"}><Settings size={18} /><span>系统设置</span></Link>
          <div className="profile-mini"><span>林</span><div><strong>林博士</strong><small>仅自己可见</small></div><span className="privacy-dot" /></div>
        </div>
      </aside>
      <div className="main-frame">
        <header className="topbar">
          <button className="mobile-brand" onClick={() => router.push("/")}><Globe2 size={20} /> Academic Atlas</button>
          <form className="global-search" onSubmit={submitSearch}>
            <Search size={18} />
            <input value={query} onChange={(event) => { setQuery(event.target.value); setSearchOpen(Boolean(event.target.value)); }} onFocus={() => setSearchOpen(Boolean(query))} placeholder="搜索老师、机构、标签或论文…" aria-label="全局搜索" />
            <kbd>⌘ K</kbd>
            {searchOpen && <div className="search-popover">
              <div className="search-popover-head"><span>搜索结果</span><button type="button" onClick={() => setSearchOpen(false)}><X size={15} /></button></div>
              {results.teachers.slice(0, 4).map((teacher) => <button type="button" key={teacher.id} onClick={() => { router.push(`/teacher?id=${teacher.id}`); setSearchOpen(false); setQuery(""); }}><span className="avatar tiny">{teacher.initials}</span><span><strong>{teacher.name}</strong><small>{teacher.institution}</small></span></button>)}
              {results.teachers.length === 0 && <p className="empty-inline">没有匹配结果，按 Enter 查看完整搜索。</p>}
            </div>}
          </form>
          <div className="topbar-actions"><span className="sync-status"><i /> 今日 03:22 已同步</span><button className="icon-button" aria-label="标签"><Tags size={18} /></button></div>
        </header>
        <main className="page-content">{children}</main>
      </div>
      <nav className="mobile-bottom-nav" aria-label="移动端导航">
        {navigation.slice(0, 5).map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return <Link key={item.href} href={item.href} className={active ? "active" : ""}><item.icon size={19} /><span>{item.label.replace("学者资料库", "学者").replace("候选老师", "候选").replace("论文动态", "论文")}</span></Link>;
        })}
      </nav>
    </div>
  );
}
