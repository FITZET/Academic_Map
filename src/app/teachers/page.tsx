import { Suspense } from "react";
import { TeachersDirectory } from "@/components/teachers-directory";

export default function TeachersPage() {
  return <Suspense fallback={<div className="page-loading">正在载入学者资料库…</div>}><TeachersDirectory /></Suspense>;
}
