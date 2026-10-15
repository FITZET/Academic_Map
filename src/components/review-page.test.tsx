import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AcademicMapProvider } from "./data-provider";
import { ReviewPage } from "./review-page";
import { initialData } from "@/lib/mock-data";

const candidate = { id: "test-candidate", name: "测试学者", initials: "测", title: "教授", institution: "测试大学", city: "北京", country: "中国", continent: "亚洲", latitude: 39.9042, longitude: 116.4074, profileUrl: "https://example.edu.cn/test", representativePaper: "", relevantPaperCount: 0, relevance: 0, reason: "测试", inferredRole: "待核对", source: "豆包联网搜索", ambiguity: "中" as const, completeness: 100, status: "pending" as const, directionId: "robotics" };

describe("候选学者人工审核", () => {
  beforeEach(() => { window.localStorage.clear(); window.localStorage.setItem("academic-atlas-data-v1", JSON.stringify({ ...initialData, teachers: [], candidates: [candidate], interactions: [] })); });

  it("没有勾选来源核对时不能上图，确认后才加入正式研究者", async () => {
    render(<AcademicMapProvider><ReviewPage /></AcademicMapProvider>);
    await screen.findByText("测试学者");
    fireEvent.click(screen.getByRole("button", { name: "确认加入地图" }));
    expect(screen.getByRole("alert")).toHaveTextContent("请核对来源");
    expect(JSON.parse(window.localStorage.getItem("academic-atlas-data-v1")!).teachers).toHaveLength(0);
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: "确认加入地图" }));
    await waitFor(() => expect(JSON.parse(window.localStorage.getItem("academic-atlas-data-v1")!).teachers).toHaveLength(1));
    expect(screen.getByText(/没有待审核学者/)).toBeInTheDocument();
  });
});
