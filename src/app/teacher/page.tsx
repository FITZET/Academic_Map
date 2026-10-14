"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { TeacherDetail } from "@/components/teacher-detail";

function TeacherRoute() {
  const params = useSearchParams();
  return <TeacherDetail id={params.get("id") ?? ""} />;
}

export default function TeacherPage() {
  return <Suspense fallback={<div className="page-loading">正在载入老师档案…</div>}><TeacherRoute /></Suspense>;
}
