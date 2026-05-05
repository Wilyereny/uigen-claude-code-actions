"use client";

import { Loader2 } from "lucide-react";

interface ToolCallBadgeProps {
  toolName: string;
  args: Record<string, unknown>;
  state: "partial-call" | "call" | "result";
}

function basename(filePath: string): string {
  return filePath.split("/").pop() ?? filePath;
}

export function getToolLabel(
  toolName: string,
  args: Record<string, unknown>,
  state: "partial-call" | "call" | "result"
): string {
  const done = state === "result";
  const file = typeof args.path === "string" ? basename(args.path) : null;
  const withFile = (verb: string, pastVerb: string) =>
    file
      ? `${done ? pastVerb : verb} file ${file}`
      : `${done ? pastVerb : verb}`;

  if (toolName === "str_replace_editor") {
    switch (args.command) {
      case "create":
        return withFile("Creating", "Created");
      case "str_replace":
      case "insert":
        return withFile("Editing", "Edited");
      case "undo_edit":
        return withFile("Reverting", "Reverted");
      case "view":
        return withFile("Reading", "Read");
    }
  }

  if (toolName === "file_manager") {
    switch (args.command) {
      case "rename":
        return file
          ? `${done ? "Renamed" : "Renaming"} ${file}`
          : done
            ? "Renamed"
            : "Renaming";
      case "delete":
        return file
          ? `${done ? "Deleted" : "Deleting"} ${file}`
          : done
            ? "Deleted"
            : "Deleting";
    }
  }

  return done ? `Ran ${toolName}` : `Running ${toolName}`;
}

export function ToolCallBadge({ toolName, args, state }: ToolCallBadgeProps) {
  const label = getToolLabel(toolName, args, state);
  const isDone = state === "result";

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isDone ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}
