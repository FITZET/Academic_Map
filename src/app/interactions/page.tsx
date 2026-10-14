"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { InteractionPage } from "@/components/interaction-page";

function InteractionRoute() {
  const params = useSearchParams();
  return <InteractionPage teacherId={params.get("teacher") ?? ""} />;
}

export default function InteractionsPage() {
  return <Suspense fallback={<div className="page-loading">正在载入互动记录…</div>}><InteractionRoute /></Suspense>;
}
