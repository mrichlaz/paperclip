import type { UIAdapterModule, TranscriptEntry } from "../types";
import type { CreateConfigValues } from "@paperclipai/adapter-utils";
import { HermesLocalConfigFields } from "./config-fields";

// Simple stdout parser for Hermes CLI output
function parseHermesStdoutLine(line: string, ts: string): TranscriptEntry[] {
 if (!line) return [];
 const timestamp = ts || new Date().toISOString();

 if (line.startsWith("[hermes]")) {
 if (line.includes("Session:")) {
 const sessionId = line.match(/Session:\s*(\S+)/)?.[1] || "";
 return [{ kind: "init", ts: timestamp, model: "hermes", sessionId }];
 }
 return [{ kind: "assistant", ts: timestamp, text: line }];
 }

 if (line.toLowerCase().includes("error") || line.toLowerCase().includes("exception")) {
 return [{ kind: "stderr", ts: timestamp, text: line }];
 }

 return [{ kind: "stdout", ts: timestamp, text: line }];
}

// Build adapter config from form values
function buildHermesConfig(values: CreateConfigValues): Record<string, unknown> {
 const v = values as unknown as Record<string, unknown>;
 return {
 model: v.model,
 provider: v.provider,
 timeoutSec: v.timeoutSec,
 persistSession: v.persistSession ?? true,
 };
}

export const hermesLocalUIAdapter: UIAdapterModule = {
 type: "hermes_local",
 label: "Hermes (local)",
 parseStdoutLine: parseHermesStdoutLine,
 ConfigFields: HermesLocalConfigFields,
 buildAdapterConfig: buildHermesConfig,
};
