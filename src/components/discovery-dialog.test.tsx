import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Clipboard } from "@capacitor/clipboard";
import { Capacitor } from "@capacitor/core";
import { AcademicMapProvider } from "./data-provider";
import { DiscoveryDialog } from "./discovery-dialog";

vi.mock("@capacitor/core", () => ({ Capacitor: { isNativePlatform: vi.fn(() => true) }, CapacitorHttp: { post: vi.fn() } }));
vi.mock("@capacitor/clipboard", () => ({ Clipboard: { read: vi.fn() } }));

describe("API Key 配置", () => {
  beforeEach(() => { window.localStorage.clear(); vi.restoreAllMocks(); });

  it("使用普通文本键盘并提供独立粘贴按钮", async () => {
    vi.spyOn(Capacitor, "isNativePlatform").mockReturnValue(true);
    vi.spyOn(Clipboard, "read").mockResolvedValue({ value: "Bearer pasted-key", type: "text/plain" });
    render(<AcademicMapProvider><DiscoveryDialog directionId="robotics" onClose={() => {}} /></AcademicMapProvider>);
    fireEvent.click(screen.getByRole("button", { name: "配置豆包 API Key" }));
    const input = screen.getByRole("textbox", { name: "方舟 API Key" }) as HTMLInputElement;
    expect(input.type).toBe("text");
    expect(input).toHaveClass("masked-key");
    fireEvent.click(screen.getByRole("button", { name: "粘贴" }));
    await waitFor(() => expect(input.value).toBe("pasted-key"));
    fireEvent.click(screen.getByRole("button", { name: "保存到本机" }));
    expect(window.localStorage.getItem("academic-map-ark-key-v1")).toBe("pasted-key");
  });
});
