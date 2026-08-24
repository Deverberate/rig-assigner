import { useState, useEffect, useCallback } from "react";
import {
  RotateCcw,
  Trophy,
  Cpu,
  Box,
  Copy,
  Check,
  ArrowDown,
  ArrowUp,
  Target,
  CircuitBoard,
  MemoryStick,
  HardDrive,
  Plug,
  Fan,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";
import type { UserPreferences, BuildPreset, PrimaryUse } from "../types";
import { presets } from "../data/presets";

// ─── Status badge labels by primary use ─────────────────────────
const STATUS_BADGES: Record<PrimaryUse, string> = {
  gaming: "Esports High-FPS",
  "video-editing": "CUDA Accelerated Workstation",
  "college-student": "Student Workstation",
  office: "Productivity Optimized",
};

// ─── Component icons and labels ─────────────────────────────────
const COMPONENT_META: Record<string, { icon: LucideIcon; label: string }> = {
  cpu: { icon: Cpu, label: "Processor" },
  gpu: { icon: CircuitBoard, label: "Graphics Card" },
  ram: { icon: MemoryStick, label: "Memory" },
  storage: { icon: HardDrive, label: "Storage" },
  motherboard: { icon: LayoutGrid, label: "Motherboard" },
  psu: { icon: Plug, label: "Power Supply" },
  cooler: { icon: Fan, label: "CPU Cooler" },
  case: { icon: Box, label: "Case" },
};

// ─── Preset adjacency mapping by primary use ────────────────────
// Orders presets from cheapest to most expensive within each category
const CATEGORY_PRESETS: Record<PrimaryUse, string[]> = {
  gaming: ["gaming-1080p-budget", "gaming-1440p-mid", "gaming-4k-flagship"],
  "video-editing": ["video-1080p-budget", "video-4k-flagship"],
  "college-student": ["college-general-budget", "cs-ai-ml-mid", "cad-engineering-mid"],
  office: ["office-basic-budget", "office-heavy-mid"],
};

function getPresetIndex(presetId: string, category: PrimaryUse): number {
  const list = CATEGORY_PRESETS[category];
  const idx = list.indexOf(presetId);
  return idx >= 0 ? idx : 0;
}

function findAdjacentPresets(
  currentPreset: BuildPreset,
  category: PrimaryUse
): { lower: BuildPreset | null; upper: BuildPreset | null } {
  const list = CATEGORY_PRESETS[category];
  const idx = getPresetIndex(currentPreset.id, category);

  const lowerId = idx > 0 ? list[idx - 1] : null;
  const upperId = idx < list.length - 1 ? list[idx + 1] : null;

  const lower = lowerId ? presets.find((p) => p.id === lowerId) ?? null : null;
  const upper = upperId ? presets.find((p) => p.id === upperId) ?? null : null;

  return { lower, upper };
}

// ─── Props ──────────────────────────────────────────────────────
interface ResultsDashboardProps {
  initialPreset: BuildPreset;
  preferences: UserPreferences;
  onRestart: () => void;
}

// ─── Component ──────────────────────────────────────────────────
export default function ResultsDashboard({
  initialPreset,
  preferences,
  onRestart,
}: ResultsDashboardProps) {
  const [activePreset, setActivePreset] = useState<BuildPreset>(initialPreset);
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);

  // Fade-in on mount
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const category = preferences.primaryUse;
  const { lower, upper } = findAdjacentPresets(activePreset, category);

  const handleCopy = useCallback(async () => {
    const lines = [
      `🎮 RigAssigner Build: ${activePreset.title} (~$${activePreset.totalEstimatedPrice.toLocaleString()})`,
      `• CPU: ${activePreset.cpu.spec}`,
      `• GPU: ${activePreset.gpu.spec}`,
      `• RAM: ${activePreset.ram.spec}`,
      `• Storage: ${activePreset.storage.spec}`,
      `• Motherboard: ${activePreset.motherboard.spec}`,
      `• PSU: ${activePreset.psu.spec}`,
      `• Cooler: ${activePreset.cooler.spec}`,
      `• Case: ${activePreset.case.spec}`,
      "",
      "Generated via RigAssigner",
    ];
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [activePreset]);

  // Reset copied state when preset changes
  useEffect(() => {
    setCopied(false);
  }, [activePreset.id]);

  const componentKeys = [
    "cpu", "gpu", "ram", "storage", "motherboard", "psu", "cooler", "case",
  ] as const;

  return (
    <div
      className={`min-h-screen bg-slate-950 text-slate-100 px-4 py-12 transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <div className="max-w-4xl mx-auto">
        {/* ── Header ── */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            <span className="text-cyan-400">Rig</span> Assigner
          </h1>
          <p className="text-slate-400 mt-2">Your perfect build is ready.</p>
        </div>

        {/* ── Build title + price + badge ── */}
        <div className="rounded-xl border border-cyan-500/30 bg-slate-900/60 p-6 mb-6 shadow-[0_0_30px_rgba(34,211,238,0.08)]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-100">{activePreset.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/20">
                    {STATUS_BADGES[category]}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-700/50 text-slate-400 border border-slate-600/30">
                    {activePreset.budgetCategory === "budget"
                      ? "Value Build"
                      : activePreset.budgetCategory === "mid-tier"
                        ? "Recommended"
                        : "Flagship Build"}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-cyan-400">
                ${activePreset.totalEstimatedPrice.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500">estimated total</p>
            </div>
          </div>

          {/* Highlights */}
          {activePreset.highlights.length > 0 && (
            <div className="rounded-lg bg-slate-800/50 p-4">
              <p className="text-xs text-cyan-400 uppercase tracking-wider font-semibold mb-2">
                Why This Fits Your Workload
              </p>
              <div className="space-y-2">
                {activePreset.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-slate-300 leading-relaxed">{h}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Budget Tweaker ── */}
        <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 mb-6">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3 text-center">
            Budget Tier
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => lower && setActivePreset(lower)}
              disabled={!lower}
              className={
                "flex flex-col items-center gap-1 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 " +
                (lower
                  ? "bg-slate-800 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-700/50 text-slate-300 hover:text-slate-100 cursor-pointer"
                  : "bg-slate-800/30 border border-slate-800 text-slate-600 cursor-not-allowed")
              }
            >
              <ArrowDown className="w-4 h-4" />
              <span className="text-[11px]">Value / Trim</span>
              {lower && (
                <span className="text-[10px] text-slate-500">
                  ~${lower.totalEstimatedPrice.toLocaleString()}
                </span>
              )}
            </button>

            <div className="flex flex-col items-center gap-1 px-3 py-3 rounded-lg text-sm font-medium bg-cyan-500/10 border-2 border-cyan-500/30 text-cyan-400">
              <Target className="w-4 h-4" />
              <span className="text-[11px] font-semibold">Recommended</span>
              <span className="text-[10px] text-cyan-400/70">
                ~${activePreset.totalEstimatedPrice.toLocaleString()}
              </span>
            </div>

            <button
              onClick={() => upper && setActivePreset(upper)}
              disabled={!upper}
              className={
                "flex flex-col items-center gap-1 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 " +
                (upper
                  ? "bg-slate-800 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-700/50 text-slate-300 hover:text-slate-100 cursor-pointer"
                  : "bg-slate-800/30 border border-slate-800 text-slate-600 cursor-not-allowed")
              }
            >
              <ArrowUp className="w-4 h-4" />
              <span className="text-[11px]">Boost / Enthusiast</span>
              {upper && (
                <span className="text-[10px] text-slate-500">
                  ~${upper.totalEstimatedPrice.toLocaleString()}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── 8-Component Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {componentKeys.map((key) => {
            const part = activePreset[key];
            const meta = COMPONENT_META[key];
            const Icon = meta.icon;
            return (
              <div
                key={key}
                className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 hover:border-cyan-500/50 transition-all duration-150 group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">
                    {meta.label}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-200 leading-snug mb-1">
                  {part.spec}
                </p>
                <p className="text-xs text-cyan-400 font-medium">
                  {part.estimatedPrice === 0 ? "Included" : `$${part.estimatedPrice}`}
                </p>
              </div>
            );
          })}
        </div>

        {/* ── Action buttons ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-slate-100 transition-all duration-300"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Copied to Clipboard! ✓</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Spec Sheet
              </>
            )}
          </button>

          <button
            onClick={onRestart}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all duration-300"
          >
            <RotateCcw className="w-4 h-4" />
            Re-take Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
