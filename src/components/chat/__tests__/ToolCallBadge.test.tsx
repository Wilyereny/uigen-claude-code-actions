import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallBadge, getToolLabel } from "../ToolCallBadge";

afterEach(() => {
  cleanup();
});

// --- getToolLabel unit tests ---

test("getToolLabel: str_replace_editor create in-progress", () => {
  expect(getToolLabel("str_replace_editor", { command: "create", path: "/components/App.tsx" }, "call")).toBe("Creating file App.tsx");
});

test("getToolLabel: str_replace_editor create completed", () => {
  expect(getToolLabel("str_replace_editor", { command: "create", path: "/components/App.tsx" }, "result")).toBe("Created file App.tsx");
});

test("getToolLabel: str_replace_editor str_replace completed", () => {
  expect(getToolLabel("str_replace_editor", { command: "str_replace", path: "/components/Counter.jsx" }, "result")).toBe("Edited file Counter.jsx");
});

test("getToolLabel: str_replace_editor insert in-progress", () => {
  expect(getToolLabel("str_replace_editor", { command: "insert", path: "/lib/index.ts" }, "call")).toBe("Editing file index.ts");
});

test("getToolLabel: str_replace_editor undo_edit completed", () => {
  expect(getToolLabel("str_replace_editor", { command: "undo_edit", path: "/components/App.tsx" }, "result")).toBe("Reverted file App.tsx");
});

test("getToolLabel: str_replace_editor view completed", () => {
  expect(getToolLabel("str_replace_editor", { command: "view", path: "/components/App.tsx" }, "result")).toBe("Read file App.tsx");
});

test("getToolLabel: file_manager rename in-progress", () => {
  expect(getToolLabel("file_manager", { command: "rename", path: "/components/App.tsx" }, "call")).toBe("Renaming App.tsx");
});

test("getToolLabel: file_manager delete completed", () => {
  expect(getToolLabel("file_manager", { command: "delete", path: "/components/App.tsx" }, "result")).toBe("Deleted App.tsx");
});

test("getToolLabel: unknown tool in-progress fallback", () => {
  expect(getToolLabel("unknown_tool", {}, "call")).toBe("Running unknown_tool");
});

test("getToolLabel: unknown tool completed fallback", () => {
  expect(getToolLabel("unknown_tool", {}, "result")).toBe("Ran unknown_tool");
});

test("getToolLabel: missing path omits filename", () => {
  expect(getToolLabel("str_replace_editor", { command: "create" }, "call")).toBe("Creating");
  expect(getToolLabel("str_replace_editor", { command: "create" }, "result")).toBe("Created");
});

test("getToolLabel: partial-call treated as in-progress", () => {
  expect(getToolLabel("str_replace_editor", { command: "create", path: "/App.tsx" }, "partial-call")).toBe("Creating file App.tsx");
});

// --- ToolCallBadge render tests ---

test("ToolCallBadge shows label text", () => {
  render(<ToolCallBadge toolName="str_replace_editor" args={{ command: "create", path: "/components/App.tsx" }} state="call" />);
  expect(screen.getByText("Creating file App.tsx")).toBeDefined();
});

test("ToolCallBadge shows completed label when state is result", () => {
  render(<ToolCallBadge toolName="str_replace_editor" args={{ command: "create", path: "/components/App.tsx" }} state="result" />);
  expect(screen.getByText("Created file App.tsx")).toBeDefined();
});

test("ToolCallBadge shows spinner when in-progress", () => {
  const { container } = render(
    <ToolCallBadge toolName="str_replace_editor" args={{ command: "create", path: "/App.tsx" }} state="call" />
  );
  expect(container.querySelector(".animate-spin")).toBeDefined();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

test("ToolCallBadge shows green dot when completed", () => {
  const { container } = render(
    <ToolCallBadge toolName="str_replace_editor" args={{ command: "create", path: "/App.tsx" }} state="result" />
  );
  expect(container.querySelector(".bg-emerald-500")).toBeDefined();
  expect(container.querySelector(".animate-spin")).toBeNull();
});
