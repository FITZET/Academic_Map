"use client";

import { useState } from "react";
import { LockKeyhole, X } from "lucide-react";
import { useAcademicData } from "./data-provider";

export function AddTeacherModal({ onClose }: { onClose: () => void }) {
  const { data, addTeacher } = useAcademicData();
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [directionId, setDirectionId] = useState(data.directions[0]?.id ?? "");
  const [city, setCity] = useState("");
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name || !institution) return;
    addTeacher({ name, englishName: name, title: "待补充", institution, department: "待补充", city: city || "待定位", country: "待补充", continent: "亚洲", latitude: 35, longitude: 105, bio: "手动新增的老师，请继续完善简介。", directionIds: [directionId], tagIds: [] });
    onClose();
  };
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal-card" onMouseDown={(event) => event.stopPropagation()}>
    <div className="modal-head"><div><span className="eyebrow">手动录入</span><h2>快速新增老师</h2></div><button className="icon-button" onClick={onClose}><X size={18} /></button></div>
    <form onSubmit={submit} className="form-stack">
      <label>老师姓名<input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="中文名或英文名" /></label>
      <label>学校 / 机构<input value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="例如：清华大学" /></label>
      <div className="form-grid"><label>城市<input value={city} onChange={(e) => setCity(e.target.value)} placeholder="北京" /></label><label>研究方向<select value={directionId} onChange={(e) => setDirectionId(e.target.value)}>{data.directions.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label></div>
      <div className="privacy-note"><LockKeyhole size={17} /><span><strong>人工数据将自动锁定</strong><small>后续学术数据同步不会覆盖你填写的内容。</small></span></div>
      <div className="modal-actions"><button type="button" className="button ghost" onClick={onClose}>取消</button><button className="button primary" disabled={!name || !institution}>加入地图</button></div>
    </form>
  </div></div>;
}
