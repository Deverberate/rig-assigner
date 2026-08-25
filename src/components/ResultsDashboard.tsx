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
  ExternalLink,
  FileText,
  Gauge,
  Zap,
  GitCompareArrows,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import type { UserPreferences, BuildPreset, PrimaryUse, ComponentPart } from "../types";
import { presets } from "../data/presets";

// ─── Icon name → Lucide component mapping ───────────────────────
const METRIC_ICON_MAP: Record<string, LucideIcon> = {
  Brain: Zap, Zap, Cpu, Target, Crosshair: Zap, Rocket: Zap, Gamepad2: Zap,
  Film: Zap, Clock: Zap, MemoryStick, Layers: Zap, Wrench: Zap, Ruler: Zap,
  Power: Zap, Globe: Zap, VolumeX: Zap, Monitor: Zap, Table: Zap, ShieldCheck: Zap,
  Home: Zap, Flashlight: Zap, Wand: Zap, Box, Gauge: Zap,
};

function getMetricIcon(iconName: string): LucideIcon {
  return METRIC_ICON_MAP[iconName] || Zap;
}

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

// ─── Preset adjacency mapping ───────────────────────────────────
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

// Component key list
const COMPONENT_KEYS = ["cpu", "gpu", "ram", "storage", "motherboard", "psu", "cooler", "case"] as const;

// ─── Find changed parts between current and previous build ──────
function findChangedParts(
  current: BuildPreset,
  previous: { parts: ComponentPart[] }
): Map<string, { old: ComponentPart; new: ComponentPart }> {
  const changes = new Map<string, { old: ComponentPart; new: ComponentPart }>();
  const prevMap = new Map(previous.parts.map((p) => [p.name, p]));

  for (const key of COMPONENT_KEYS) {
    const currentPart = current[key];
    const prevPart = prevMap.get(currentPart.name);
    if (prevPart && prevPart.spec !== currentPart.spec) {
      changes.set(key, { old: prevPart, new: currentPart });
    }
  }
  return changes;
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
  const [plainCopied, setPlainCopied] = useState(false);
  const [visible, setVisible] = useState(false);
  const [crossFade, setCrossFade] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const category = preferences.primaryUse;
  const { lower, upper } = findAdjacentPresets(activePreset, category);

  const handleTierSwitch = useCallback((preset: BuildPreset) => {
    setCrossFade(true);
    setShowComparison(false);
    setTimeout(() => {
      setActivePreset(preset);
      setCrossFade(false);
    }, 150);
  }, []);

  const handleCopy = useCallback(async () => {
    const lines = [
      `\u{1F3AE} RigAssigner Build: ${activePreset.title} (~$${activePreset.totalEstimatedPrice.toLocaleString()})`,
      `\u2022 CPU: ${activePreset.cpu.spec}`,
      `\u2022 GPU: ${activePreset.gpu.spec}`,
      `\u2022 RAM: ${activePreset.ram.spec}`,
      `\u2022 Storage: ${activePreset.storage.spec}`,
      `\u2022 Motherboard: ${activePreset.motherboard.spec}`,
      `\u2022 PSU: ${activePreset.psu.spec}`,
      `\u2022 Cooler: ${activePreset.cooler.spec}`,
      `\u2022 Case: ${activePreset.case.spec}`,
      "",
      "Generated via RigAssigner",
    ];
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [activePreset]);

  const handleCopyPlain = useCallback(async () => {
    const lines = [
      `RigAssigner Build: ${activePreset.title} (~$${activePreset.totalEstimatedPrice.toLocaleString()})`,
      "",
      `CPU: ${activePreset.cpu.spec}`,
      `GPU: ${activePreset.gpu.spec}`,
      `RAM: ${activePreset.ram.spec}`,
      `Storage: ${activePreset.storage.spec}`,
      `Motherboard: ${activePreset.motherboard.spec}`,
      `PSU: ${activePreset.psu.spec}`,
      `Cooler: ${activePreset.cooler.spec}`,
      `Case: ${activePreset.case.spec}`,
      "",
      "Generated via RigAssigner",
    ];
    await navigator.clipboard.writeText(lines.join("\n"));
    setPlainCopied(true);
    setTimeout(() => setPlainCopied(false), 2000);
  }, [activePreset]);

  useEffect(() => {
    setCopied(false);
    setPlainCopied(false);
    setShowComparison(false);
  }, [activePreset.id]);

  const pcpartpickerUrl = `https://pcpartpicker.com/search/?q=${encodeURIComponent(activePreset.cpu.spec.split("(")[0].trim() + " " + activePreset.gpu.spec.split("(")[0].trim())}`;
  const amazonUrl = `https://www.amazon.com/s?k=${encodeURIComponent(activePreset.cpu.spec.split("(")[0].trim())}`;

  // Comparison data
  const hasPrevious = !!activePreset.previousBuild;
  const changedParts = hasPrevious ? findChangedParts(activePreset, activePreset.previousBuild!) : new Map();
  const priceDiff = hasPrevious ? activePreset.totalEstimatedPrice - activePreset.previousBuild!.totalPrice : 0;

  return (
    <div
      className={`min-h-screen bg-slate-950 text-slate-100 px-4 py-12 transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <div className="max-w-4xl mx-auto">
        {/* ── Header ── */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            <span className="text-cyan-400">Rig</span> Assigner
          </h1>
          <p className="text-slate-400 mt-2">Your perfect build is ready.</p>
        </div>

        {/* ── Live Meta Sync Badge ── */}
        {activePreset.lastUpdated && (
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              Meta Active: {activePreset.lastUpdated}
            </span>
          </div>
        )}

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
                  <span className="relative inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/20">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
                    </span>
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

          {/* Changelog Notice */}
          {activePreset.changeSummary && (
            <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 px-4 py-3 mb-4">
              <div className="flex items-start gap-2.5">
                <Zap className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] text-amber-400 uppercase tracking-wider font-semibold mb-0.5">
                    Recent Meta Shift
                  </p>
                  <p className="text-sm text-slate-300 leading-relaxed">{activePreset.changeSummary}</p>
                </div>
              </div>
            </div>
          )}

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

        {/* ── Performance Metrics Badges ── */}
        {activePreset.performanceMetrics.length > 0 && (
          <div className={`rounded-xl border border-slate-700 bg-slate-900/60 p-5 mb-6 transition-opacity duration-150 ${crossFade ? "opacity-0" : "opacity-100"}`}>
            <div className="flex items-center gap-2 mb-4">
              <Gauge className="w-4 h-4 text-cyan-400" />
              <p className="text-xs text-cyan-400 uppercase tracking-wider font-semibold">
                Expected Real-World Performance
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {activePreset.performanceMetrics.map((metric, i) => {
                const Icon = getMetricIcon(metric.iconName);
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-lg bg-slate-800/50 border border-slate-700/50 px-4 py-3 hover:border-cyan-500/30 transition-all duration-150"
                  >
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">{metric.label}</p>
                      <p className="text-sm font-semibold text-slate-200 truncate">{metric.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Budget Tweaker ── */}
        <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 mb-6">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3 text-center">Budget Tier</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => lower && handleTierSwitch(lower)}
              disabled={!lower}
              className={
                "flex flex-col items-center gap-1 px-2 py-2.5 sm:px-3 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 " +
                (lower
                  ? "bg-slate-800 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-700/50 text-slate-300 hover:text-slate-100 cursor-pointer"
                  : "bg-slate-800/30 border border-slate-800 text-slate-600 cursor-not-allowed")
              }
            >
              <ArrowDown className="w-4 h-4" />
              <span className="text-[11px]">Value / Trim</span>
              {lower && <span className="text-[10px] text-slate-500">~${lower.totalEstimatedPrice.toLocaleString()}</span>}
            </button>

            <div className="flex flex-col items-center gap-1 px-3 py-3 rounded-lg text-sm font-medium bg-cyan-500/10 border-2 border-cyan-500/30 text-cyan-400">
              <Target className="w-4 h-4" />
              <span className="text-[11px] font-semibold">Recommended</span>
              <span className="text-[10px] text-cyan-400/70">~${activePreset.totalEstimatedPrice.toLocaleString()}</span>
            </div>

            <button
              onClick={() => upper && handleTierSwitch(upper)}
              disabled={!upper}
              className={
                "flex flex-col items-center gap-1 px-2 py-2.5 sm:px-3 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 " +
                (upper
                  ? "bg-slate-800 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-700/50 text-slate-300 hover:text-slate-100 cursor-pointer"
                  : "bg-slate-800/30 border border-slate-800 text-slate-600 cursor-not-allowed")
              }
            >
              <ArrowUp className="w-4 h-4" />
              <span className="text-[11px]">Boost / Enthusiast</span>
              {upper && <span className="text-[10px] text-slate-500">~${upper.totalEstimatedPrice.toLocaleString()}</span>}
            </button>
          </div>
        </div>

        {/* ── Compare with Previous Meta ── */}
        {hasPrevious && (
          <div className="mb-6">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className={
                "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 border " +
                (showComparison
                  ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                  : "bg-slate-900/60 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300")
              }
            >
              <GitCompareArrows className="w-4 h-4" />
              {showComparison ? "Hide Previous Build" : `Compare with Previous Best ($${activePreset.previousBuild!.totalPrice.toLocaleString()})`}
            </button>

            {/* Comparison Drawer */}
            {showComparison && (
              <div className="mt-3 rounded-xl border border-slate-700 bg-slate-900/60 p-5 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Previous Build</p>
                    <p className="text-sm text-slate-300 font-medium">{activePreset.previousBuild!.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-400">${activePreset.previousBuild!.totalPrice.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-500">Retired {activePreset.previousBuild!.retiredDate}</p>
                  </div>
                </div>

                {/* Price delta */}
                <div className="flex items-center justify-center gap-2 mb-4 py-2 rounded-lg bg-slate-800/50">
                  <span className="text-xs text-slate-500">Price change:</span>
                  <span className={`text-sm font-bold ${priceDiff < 0 ? "text-emerald-400" : priceDiff > 0 ? "text-red-400" : "text-slate-400"}`}>
                    {priceDiff < 0 ? "\u2212" : priceDiff > 0 ? "+" : ""}${Math.abs(priceDiff).toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500">
                    ({priceDiff < 0 ? "saved" : priceDiff > 0 ? "more" : "same"})
                  </span>
                </div>

                {/* Changed parts diff */}
                {changedParts.size > 0 ? (
                  <div className="space-y-2">
                    <p className="text-xs text-cyan-400 uppercase tracking-wider font-semibold mb-2">Changed Components</p>
                    {Array.from(changedParts.entries()).map(([key, { old: oldPart, new: newPart }]) => {
                      const meta = COMPONENT_META[key];
                      const Icon = meta?.icon || Cpu;
                      return (
                        <div key={key} className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className="w-3.5 h-3.5 text-slate-500" />
                            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">{meta?.label || key}</span>
                          </div>
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <div className="flex-1 min-w-0 rounded-md bg-red-500/5 border border-red-500/15 px-2.5 py-1.5">
                              <p className="text-[10px] text-red-400/60 uppercase font-medium mb-0.5">Previous</p>
                              <p className="text-xs text-slate-400 line-through decoration-red-400/40">{oldPart.spec}</p>
                              <p className="text-[10px] text-slate-500">${oldPart.estimatedPrice}</p>
                            </div>
                            <ArrowRight className="w-3 h-3 text-slate-600 flex-shrink-0" />
                            <div className="flex-1 min-w-0 rounded-md bg-emerald-500/5 border border-emerald-500/15 px-2.5 py-1.5">
                              <p className="text-[10px] text-emerald-400/60 uppercase font-medium mb-0.5">Current</p>
                              <p className="text-xs text-slate-200 font-medium">{newPart.spec}</p>
                              <p className="text-[10px] text-emerald-400">${newPart.estimatedPrice}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 text-center py-2">No component changes detected.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── 8-Component Grid ── */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6 transition-opacity duration-150 ${crossFade ? "opacity-0" : "opacity-100"}`}>
          {COMPONENT_KEYS.map((key) => {
            const part = activePreset[key];
            const meta = COMPONENT_META[key];
            const Icon = meta.icon;
            const isChanged = showComparison && changedParts.has(key);
            return (
              <div
                key={key}
                className={
                  "rounded-xl border bg-slate-900/60 p-4 transition-all duration-150 group " +
                  (isChanged
                    ? "border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.1)]"
                    : "border-slate-700 hover:border-cyan-500/50")
                }
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors " +
                    (isChanged ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-slate-400 group-hover:text-cyan-400")
                  }>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">{meta.label}</span>
                  {isChanged && (
                    <span className="ml-auto px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                      UPDATED
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-slate-200 leading-snug mb-1">{part.spec}</p>
                <p className="text-xs text-cyan-400 font-medium">
                  {part.estimatedPrice === 0 ? "Included" : `$${part.estimatedPrice}`}
                </p>
              </div>
            );
          })}
        </div>

        {/* ── Action buttons ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 flex-wrap">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-slate-100 transition-all duration-300"
          >
            {copied ? (
              <><Check className="w-4 h-4 text-green-400" /><span className="text-green-400">Copied! \u2713</span></>
            ) : (
              <><Copy className="w-4 h-4" />Copy Spec Sheet</>
            )}
          </button>

          <button
            onClick={handleCopyPlain}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-slate-100 transition-all duration-300"
          >
            {plainCopied ? (
              <><Check className="w-4 h-4 text-green-400" /><span className="text-green-400">Copied! \u2713</span></>
            ) : (
              <><FileText className="w-4 h-4" />Copy Plain Text</>
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

        {/* ── External Links ── */}
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          <a
            href={pcpartpickerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm border border-slate-700 bg-slate-900/60 hover:bg-slate-800 hover:border-emerald-500/50 text-slate-400 hover:text-emerald-400 transition-all duration-300"
          >
            <ExternalLink className="w-4 h-4" />
            Search on PCPartPicker
          </a>

          <a
            href={amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm border border-slate-700 bg-slate-900/60 hover:bg-slate-800 hover:border-amber-500/50 text-slate-400 hover:text-amber-400 transition-all duration-300"
          >
            <ExternalLink className="w-4 h-4" />
            Search on Amazon
          </a>
        </div>
      </div>
    </div>
  );
}
