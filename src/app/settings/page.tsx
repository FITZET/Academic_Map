"use client";

import { CheckCircle2, Database, Download, KeyRound, RefreshCw, RotateCcw, ShieldCheck } from "lucide-react";
import { useAcademicData } from "@/components/data-provider";

export default function SettingsPage() {
  const { data, resetDemo } = useAcademicData();
  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `academic-atlas-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  };
  return <><div className="page-heading"><div><span className="eyebrow">SYSTEM & PRIVACY</span><h1>系统设置</h1><p>管理数据源、自动同步、隐私与本地备份。</p></div></div><div className="settings-grid"><section className="content-card settings-section"><div className="settings-title"><Database /><div><h2>学术数据源</h2><p>Provider 采用独立适配器，后续可以随时替换。</p></div></div>{["OpenAlex", "Semantic Scholar", "ORCID", "Crossref", "DBLP"].map((provider, index) => <div className="provider-row" key={provider}><span className="provider-mark">{provider.slice(0, 2).toUpperCase()}</span><div><strong>{provider}</strong><small>{index === 0 ? "主要数据源" : "交叉验证与补充"}</small></div><span className={index < 2 ? "status connected" : "status demo"}>{index < 2 ? "已连接" : "模拟模式"}</span></div>)}</section><section className="content-card settings-section"><div className="settings-title"><RefreshCw /><div><h2>每日同步</h2><p>通过唯一作者标识更新论文并记录日志。</p></div></div><div className="setting-control"><div><strong>自动同步</strong><small>每天凌晨检查所有已确认老师</small></div><button className="switch on"><i /></button></div><div className="setting-control"><div><strong>执行时间</strong><small>使用 Asia/Shanghai 时区</small></div><input type="time" defaultValue="03:00" /></div><div className="sync-success"><CheckCircle2 /><span><strong>最近一次同步成功</strong><small>2026-10-15 03:22 · 新增 3 篇论文</small></span></div></section><section className="content-card settings-section"><div className="settings-title"><ShieldCheck /><div><h2>隐私与数据</h2><p>私人互动与公开学术资料严格分层。</p></div></div><div className="privacy-rule"><KeyRound /><span><strong>私人互动不对外发送</strong><small>笔记、爱好、合影和个人印象不会进入 Provider 请求。</small></span></div><button className="button ghost full" onClick={exportData}><Download size={16} />导出完整 JSON 备份</button><button className="button danger-subtle full" onClick={() => window.confirm("确定恢复演示数据？本地修改将丢失。") && resetDemo()}><RotateCcw size={16} />恢复演示数据</button></section></div></>;
}
