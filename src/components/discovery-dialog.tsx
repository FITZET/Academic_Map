"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, KeyRound, Search, X } from "lucide-react";
import { ARK_KEY_STORAGE, ARK_MODEL_STORAGE, DEFAULT_ARK_MODEL, discoverScholars } from "@/lib/doubao";
import { useAcademicData } from "./data-provider";

export function DiscoveryDialog({ directionId, onClose }: { directionId: string; onClose: () => void }) {
  const { data, addCandidates } = useAcademicData();
  const [selectedId, setSelectedId] = useState(directionId === "all" ? data.directions[0]?.id ?? "" : directionId);
  const [key, setKey] = useState("");
  const [model, setModel] = useState(DEFAULT_ARK_MODEL);
  const [showKey, setShowKey] = useState(false);
  const [configure, setConfigure] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [found, setFound] = useState(false);

  useEffect(() => {
    setKey(window.localStorage.getItem(ARK_KEY_STORAGE) ?? "");
    setModel(window.localStorage.getItem(ARK_MODEL_STORAGE) ?? DEFAULT_ARK_MODEL);
  }, []);

  const saveConfig = () => {
    if (key.trim()) window.localStorage.setItem(ARK_KEY_STORAGE, key.trim());
    else window.localStorage.removeItem(ARK_KEY_STORAGE);
    window.localStorage.setItem(ARK_MODEL_STORAGE, model.trim() || DEFAULT_ARK_MODEL);
    setConfigure(false);
    setMessage(key.trim() ? "API 配置已保存在本机。" : "API Key 已从本机删除。");
  };

  const search = async () => {
    const direction = data.directions.find((item) => item.id === selectedId);
    if (!direction) return;
    if (!key.trim()) { setConfigure(true); setMessage("请先输入豆包方舟 API Key。"); return; }
    setBusy(true); setMessage(""); setFound(false);
    try {
      const candidates = await discoverScholars(direction, key, model);
      const added = addCandidates(candidates);
      setFound(added > 0);
      setMessage(added ? `找到 ${candidates.length} 位有来源的学者，其中 ${added} 位进入待审核区。` : "未找到新的、可核对来源的学者。请更换关键词或稍后重试。");
    } catch (error) { setMessage(error instanceof Error ? error.message : "搜索失败，请稍后重试。"); }
    finally { setBusy(false); }
  };

  return <div className="simple-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="simple-modal" role="dialog" aria-modal="true" aria-labelledby="discovery-title">
      <div className="simple-modal-head"><div><span className="eyebrow">DOUBAO WEB SEARCH</span><h2 id="discovery-title">发现相关学者</h2></div><button className="icon-button" onClick={onClose} aria-label="关闭"><X size={17} /></button></div>
      <p className="simple-muted">只发送研究方向和关键词给豆包，不发送标签或私人互动记录。搜索结果不会自动上图。</p>
      <label className="simple-field">研究领域<select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>{data.directions.map((direction) => <option key={direction.id} value={direction.id}>{direction.name}</option>)}</select></label>
      <button className="inline-action" onClick={() => setConfigure((value) => !value)}><KeyRound size={15} />{key ? "修改豆包 API 配置" : "配置豆包 API Key"}</button>
      {configure && <div className="api-config">
        <label className="simple-field">方舟 API Key<div className="secret-input"><input type={showKey ? "text" : "password"} autoComplete="off" value={key} onChange={(event) => setKey(event.target.value)} placeholder="输入你自己的 Ark API Key" /><button type="button" onClick={() => setShowKey((value) => !value)}>{showKey ? "隐藏" : "显示"}</button></div></label>
        <label className="simple-field">模型 ID<input value={model} onChange={(event) => setModel(event.target.value)} placeholder={DEFAULT_ARK_MODEL} /></label>
        <div className="simple-actions"><button className="button primary" onClick={saveConfig}>保存到本机</button><button className="button ghost" onClick={() => { setKey(""); window.localStorage.removeItem(ARK_KEY_STORAGE); setMessage("API Key 已删除。"); }}>删除 Key</button></div>
        <small className="simple-muted">Key 存储于本机应用数据中；使用网页预览时，存储于当前浏览器。请勿在公用设备上保存。搜索会产生方舟 API 费用。</small>
      </div>}
      <div className="simple-actions"><button className="button primary" onClick={search} disabled={busy || !selectedId}><Search size={15} />{busy ? "正在联网搜索…" : "开始搜索"}</button>{found && <Link className="button ghost" href="/review" onClick={onClose}>去审核 <ArrowRight size={15} /></Link>}</div>
      {message && <p className="simple-feedback" role="status">{message}</p>}
    </section>
  </div>;
}
