import type { AdapterConfigFieldsProps } from "../types";
import {
 Field,
 ToggleField,
 DraftInput,
 help,
} from "../../components/agent-config-primitives";
import { LocalWorkspaceRuntimeFields } from "../local-workspace-runtime-fields";

const inputClass =
 "w-full rounded-md border border-border px-2.5 py-1.5 bg-transparent outline-none text-sm font-mono placeholder:text-muted-foreground/40";

// Hermes-specific config values (extends CreateConfigValues)
interface HermesConfigValues {
 model?: string;
 provider?: string;
 timeoutSec?: number;
 persistSession?: boolean;
 [key: string]: unknown;
}

export function HermesLocalConfigFields({
 mode,
 isCreate,
 adapterType,
 values,
 set,
 config,
 eff,
 mark,
 models,
}: AdapterConfigFieldsProps) {
 // Cast values to include Hermes-specific fields
 const v = values as HermesConfigValues | null;

 return (
 <>
 <Field label="Model">
 {isCreate ? (
 <input
 type="text"
 className={inputClass}
 value={v?.model ?? "anthropic/claude-sonnet-4"}
 onChange={(e) => set!({ model: e.target.value } as Partial<HermesConfigValues>)}
 placeholder="anthropic/claude-sonnet-4"
 />
 ) : (
 <DraftInput
 value={eff("adapterConfig", "model", String(config.model ?? "anthropic/claude-sonnet-4"))}
 onCommit={(v) => mark("adapterConfig", "model", v || "anthropic/claude-sonnet-4")}
 immediate
 className={inputClass}
 placeholder="anthropic/claude-sonnet-4"
 />
 )}
 </Field>

 <Field label="Provider" hint="LLM provider: auto, anthropic, openrouter, nous, localhost">
 {isCreate ? (
 <input
 type="text"
 className={inputClass}
 value={v?.provider ?? ""}
 onChange={(e) => set!({ provider: e.target.value } as Partial<HermesConfigValues>)}
 placeholder="auto, anthropic, openrouter, nous, localhost"
 />
 ) : (
 <DraftInput
 value={eff("adapterConfig", "provider", String(config.provider ?? ""))}
 onCommit={(v) => mark("adapterConfig", "provider", v || undefined)}
 immediate
 className={inputClass}
 placeholder="auto, anthropic, openrouter, nous, localhost"
 />
 )}
 </Field>

 <Field label="Timeout (seconds)" hint={help.timeoutSec}>
 {isCreate ? (
 <input
 type="number"
 className={inputClass}
 value={v?.timeoutSec ?? 0}
 onChange={(e) => set!({ timeoutSec: Number(e.target.value) } as Partial<HermesConfigValues>)}
 />
 ) : (
 <DraftInput
 value={String(eff("adapterConfig", "timeoutSec", config.timeoutSec ?? 0))}
 onCommit={(v) => mark("adapterConfig", "timeoutSec", Number(v))}
 immediate
 className={inputClass}
 />
 )}
 </Field>

 <ToggleField
 label="Persist session"
 hint="Resume the same session on subsequent runs"
 checked={
 isCreate
 ? v?.persistSession !== false
 : eff("adapterConfig", "persistSession", config.persistSession !== false)
 }
 onChange={(v) =>
 isCreate
 ? set!({ persistSession: v } as Partial<HermesConfigValues>)
 : mark("adapterConfig", "persistSession", v)
 }
 />

 <LocalWorkspaceRuntimeFields
 isCreate={isCreate}
 values={values}
 set={set}
 config={config}
 mark={mark}
 eff={eff}
 mode={mode}
 adapterType={adapterType}
 models={models}
 />
 </>
 );
}
