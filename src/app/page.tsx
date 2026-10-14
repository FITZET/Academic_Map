import { Suspense } from "react";
import { Dashboard } from "@/components/dashboard";

export default function HomePage() {
  return <Suspense fallback={<div className="page-loading">正在载入学术地图…</div>}><Dashboard /></Suspense>;
}
