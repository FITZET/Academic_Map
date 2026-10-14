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
  const providers = [
    { name: "OpenAlex", note: "自动发现老师（浏览器实时请求）", status: "实时可用", live: true },
    { name: "Semantic Scholar", note: "Provider 接口已预留", status: "尚未接入", live: false },
    { name: "ORCID", note: "Provider 接口已预留", status: "尚未接入", live: false },
    { name: "Crossref", note: "Provider 接口已预留", status: "尚未接入", live: false },
    { name: "DBLP", note: "Provider 接口已预留", status: "尚未接入", live: false },
  ];
  return <><div className="page-heading"><div><span className="eyebrow">SYSTEM & PRIVACY</span><h1>系统设置</h1><p>这里显示当前版本真正可用的连接能力，不再使用模拟同步状态。</p></div></div><div className="settings-grid"><section className="content-card settings-section"><div className="settings-title"><Database /><div><h2>学术数据源</h2><p>自动发现结果始终先进入候选审核区。</p></div></div>{providers.map((provider) => <div className="provider-row" key={provider.name}><span className="provider-mark">{provider.name.slice(0, 2).toUpperCase()}</span><div><strong>{provider.name}</strong><small>{provider.note}</small></div><span className={provider.live ? "status connected" : "status demo"}>{provider.status}</span></div>)}</section><section className="content-card settings-section"><div className="settings-title"><RefreshCw /><div><h2>每日同步</h2><p>静态 GitHub Pages 无法在浏览器关闭后执行私有后台任务。</p></div></div><div className="setting-control"><div><strong>自动同步</strong><small>需部署后端任务队列后启用</small></div><button className="switch" disabled aria-label="自动同步尚未启用"><i /></button></div><div className="setting-control"><div><strong>当前存储</strong><small>浏览器 / App 本地存储</small></div><strong>本机</strong></div><div className="sync-pending"><CheckCircle2 /><span><strong>OpenAlex 在线发现可用</strong><small>论文每日同步、日志和跨设备同步尚未部署。</small></span></div></section><section className="content-card settings-section"><div className="settings-title"><ShieldCheck /><div><h2>隐私与数据</h2><p>私人互动与公开学术资料严格分层。</p></div></div><div className="privacy-rule"><KeyRound /><span><strong>私人互动不对外发送</strong><small>笔记、爱好、合影和个人印象不会进入 Provider 请求。</small></span></div><button className="button ghost full" onClick={exportData}><Download size={16} />导出完整 JSON 备份</button><button className="button danger-subtle full" onClick={() => window.confirm("确定恢复演示数据？本地修改将丢失。") && resetDemo()}><RotateCcw size={16} />恢复演示数据</button></section></div></>;
}
