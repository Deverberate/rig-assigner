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
  Monitor,
  Battery,
  Smartphone,
  Weight,
  Camera,
  Wifi,
  Laptop,
  ChevronDown,
  Keyboard,
  Mouse,
  Headphones,
  Gamepad2,
  CheckSquare,
  Square,
  type LucideIcon,
} from "lucide-react";
import type {
  UserPreferences,
  BuildPreset,
  LaptopPreset,
  PhonePreset,
  PrimaryUse,
  ComponentPart,
  PeripheralItem,
} from "../types";
import { laptopPresets } from "../data/laptopPresets";
import { phonePresets } from "../data/phonePresets";
import {
  findAdjacentPresets as findAdjacentPC,
  findAdjacentLaptops,
  findAdjacentPhones,
} from "../utils/matcher";
import { peripherals } from "../data/peripherals";
import ComponentDetailModal from "./ComponentDetailModal";

// ─── Type guards ───────────────────────────────────────────────
function isBuildPreset(p: BuildPreset | LaptopPreset | PhonePreset): p is BuildPreset {
  return "cpu" in p && "gpu" in p;
}
function isLaptopPreset(p: BuildPreset | LaptopPreset | PhonePreset): p is LaptopPreset {
  return "laptopSpec" in p;
}
function isPhonePreset(p: BuildPreset | LaptopPreset | PhonePreset): p is PhonePreset {
  return "phoneSpec" in p;
}

// ─── Icon mapping for metrics ──────────────────────────────────
const METRIC_ICON_MAP: Record<string, LucideIcon> = {
  Brain: Zap, Zap, Cpu, Target, Crosshair: Zap, Rocket: Zap, Gamepad2: Zap,
  Film: Zap, Clock: Zap, MemoryStick, Layers: Zap, Wrench: Zap, Ruler: Zap,
  Power: Zap, Globe: Zap, VolumeX: Zap, Monitor, Table: Zap, ShieldCheck: Zap,
  Home: Zap, Flashlight: Zap, Wand: Zap, Box, Gauge: Zap, Battery, Camera,
  Aperture: Zap, Feather: Zap, TrendingUp: Zap,
};

function getMetricIcon(iconName: string): LucideIcon {
  return METRIC_ICON_MAP[iconName] || Zap;
}

// ─── Status badge labels by primary use ────────────────────────
const STATUS_BADGES: Record<PrimaryUse, string> = {
  gaming: "Esports High-FPS",
  "video-editing": "CUDA Accelerated Workstation",
  "college-student": "Student Workstation",
  office: "Productivity Optimized",
};

const LAPTOP_STATUS_BADGES: Record<PrimaryUse, string> = {
  gaming: "Portable Gaming",
  "video-editing": "Creative Mobile Workstation",
  "college-student": "Student Laptop",
  office: "Business Ultrabook",
};

const PHONE_STATUS_BADGES: Record<PrimaryUse, string> = {
  gaming: "Mobile Gaming Beast",
  "video-editing": "Pro Camera Phone",
  "college-student": "Student Value Pick",
  office: "Everyday Smartphone",
};

// ─── PC Component metadata ─────────────────────────────────────
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

const COMPONENT_KEYS = ["cpu", "gpu", "ram", "storage", "motherboard", "psu", "cooler", "case"] as const;

// ─── Peripheral icon map ──────────────────────────────────────
const PERIPHERAL_ICONS: Record<string, LucideIcon> = {
  Keyboard,
  Mouse,
  Monitor,
  Headphones,
  Gamepad2,
};

const PERIPHERAL_CATEGORY_LABELS: Record<string, string> = {
  keyboard: "Keyboard",
  mouse: "Mouse",
  monitor: "Monitor",
  audio: "Audio",
  controller: "Controller",
};

// ─── PC Preset adjacency (delegated to matcher) ──────────────

// ─── Changed parts helper ──────────────────────────────────────
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

// ─── Props ─────────────────────────────────────────────────────
interface ResultsDashboardProps {
  initialPreset: BuildPreset | LaptopPreset | PhonePreset;
  preferences: UserPreferences;
  onRestart: () => void;
}

// ─── Component ─────────────────────────────────────────────────
export default function ResultsDashboard({
  initialPreset,
  preferences,
  onRestart,
}: ResultsDashboardProps) {
  const [activePreset, setActivePreset] = useState<BuildPreset | LaptopPreset | PhonePreset>(initialPreset);
  const [copied, setCopied] = useState(false);
  const [plainCopied, setPlainCopied] = useState(false);
  const [visible, setVisible] = useState(false);
  const [crossFade, setCrossFade] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [compareTargetId, setCompareTargetId] = useState<string | null>(null);
  const [modalPart, setModalPart] = useState<{ part: ComponentPart; key: string } | null>(null);
  const [selectedPeripherals, setSelectedPeripherals] = useState<Set<string>>(new Set());
  const [showPeripherals, setShowPeripherals] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const deviceCategory = preferences.deviceCategory;
  const category = preferences.primaryUse;

  // ─── Adjacent presets for budget tweaker ─────────────────────
  const { lower, upper } = (() => {
    if (isBuildPreset(activePreset)) {
      return findAdjacentPC(activePreset, category);
    }
    if (isLaptopPreset(activePreset)) {
      return findAdjacentLaptops(activePreset, laptopPresets);
    }
    if (isPhonePreset(activePreset)) {
      return findAdjacentPhones(activePreset, phonePresets);
    }
    return { lower: null, upper: null };
  })();

  const handleTierSwitch = useCallback(
    (preset: BuildPreset | LaptopPreset | PhonePreset) => {
      setCrossFade(true);
      setShowComparison(false);
      setTimeout(() => {
        setActivePreset(preset);
        setCrossFade(false);
      }, 150);
    },
    []
  );

  // ─── Peripherals ────────────────────────────────────────────
  const peripheralTotal = peripherals
    .filter((p) => selectedPeripherals.has(p.id))
    .reduce((sum, p) => sum + p.price, 0);

  const togglePeripheral = useCallback((id: string) => {
    setSelectedPeripherals((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Group peripherals by category
  const peripheralGroups = peripherals.reduce<Record<string, PeripheralItem[]>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  // ─── Copy functions ──────────────────────────────────────────
  const buildCopyText = useCallback(
    (markdown: boolean) => {
      const lines: string[] = [];
      const bullet = markdown ? "\u2022 " : "";
      const prefix = markdown ? "\u{1F3AE} " : "";

      lines.push(
        `${prefix}RigAssigner ${deviceCategory === "pc" ? "Build" : deviceCategory === "laptop" ? "Laptop" : "Phone"}: ${activePreset.title} (~$${activePreset.totalEstimatedPrice.toLocaleString()})`
      );
      lines.push("");

      if (isBuildPreset(activePreset)) {
        lines.push(`${bullet}CPU: ${activePreset.cpu.spec}`);
        lines.push(`${bullet}GPU: ${activePreset.gpu.spec}`);
        lines.push(`${bullet}RAM: ${activePreset.ram.spec}`);
        lines.push(`${bullet}Storage: ${activePreset.storage.spec}`);
        lines.push(`${bullet}Motherboard: ${activePreset.motherboard.spec}`);
        lines.push(`${bullet}PSU: ${activePreset.psu.spec}`);
        lines.push(`${bullet}Cooler: ${activePreset.cooler.spec}`);
        lines.push(`${bullet}Case: ${activePreset.case.spec}`);
      } else if (isLaptopPreset(activePreset)) {
        const s = activePreset.laptopSpec;
        lines.push(`${bullet}Display: ${s.display.spec}`);
        lines.push(`${bullet}SoC: ${s.soc.spec}`);
        lines.push(`${bullet}Battery: ${s.battery.spec}`);
        lines.push(`${bullet}Cameras: ${s.cameras.spec}`);
        lines.push(`${bullet}Weight: ${s.weight}`);
        lines.push(`${bullet}Ports: ${s.ports}`);
        lines.push(`${bullet}OS: ${s.os}`);
      } else if (isPhonePreset(activePreset)) {
        const s = activePreset.phoneSpec;
        lines.push(`${bullet}Display: ${s.display.spec}`);
        lines.push(`${bullet}Chipset: ${s.chipset.spec}`);
        lines.push(`${bullet}Battery: ${s.battery.spec}`);
        lines.push(`${bullet}Cameras: ${s.cameras.spec}`);
        lines.push(`${bullet}Weight: ${s.weight}`);
        lines.push(`${bullet}OS: ${s.os}`);
        lines.push(`${bullet}Connectivity: ${s.connectivity}`);
      }

      // Peripherals
      const selected = peripherals.filter((p) => selectedPeripherals.has(p.id));
      if (selected.length > 0) {
        lines.push("");
        lines.push("--- Peripherals ---");
        selected.forEach((p) => lines.push(`${bullet}${PERIPHERAL_CATEGORY_LABELS[p.category] || p.category}: ${p.name} ($${p.price})`));
        lines.push("");
        lines.push(`Total Setup: $${(activePreset.totalEstimatedPrice + peripheralTotal).toLocaleString()}`);
      }

      lines.push("");
      lines.push("Generated via RigAssigner");
      return lines.join("\n");
    },
    [activePreset, deviceCategory, selectedPeripherals, peripheralTotal]
  );

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(buildCopyText(true));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [buildCopyText]);

  const handleCopyPlain = useCallback(async () => {
    await navigator.clipboard.writeText(buildCopyText(false));
    setPlainCopied(true);
    setTimeout(() => setPlainCopied(false), 2000);
  }, [buildCopyText]);

  useEffect(() => {
    setCopied(false);
    setPlainCopied(false);
    setShowComparison(false);
    setCompareTargetId(null);
  }, [activePreset]);

  // ─── External links (PC only) ───────────────────────────────
  const pcpartpickerUrl = isBuildPreset(activePreset)
    ? `https://pcpartpicker.com/search/?q=${encodeURIComponent(activePreset.cpu.spec.split("(")[0].trim() + " " + activePreset.gpu.spec.split("(")[0].trim())}`
    : "";
  const amazonUrl = `https://www.amazon.com/s?k=${encodeURIComponent(
    isBuildPreset(activePreset)
      ? activePreset.cpu.spec.split("(")[0].trim()
      : isLaptopPreset(activePreset)
        ? activePreset.title
        : activePreset.title
  )}`;

  // ─── Comparison data (PC only) ──────────────────────────────
  const hasPrevious = isBuildPreset(activePreset) && !!activePreset.previousBuild;
  const changedParts =
    hasPrevious ? findChangedParts(activePreset as BuildPreset, (activePreset as BuildPreset).previousBuild!) : new Map();
  const priceDiff =
    hasPrevious ? activePreset.totalEstimatedPrice - (activePreset as BuildPreset).previousBuild!.totalPrice : 0;

  // ─── Status badge ───────────────────────────────────────────
  const statusBadge = (() => {
    if (deviceCategory === "laptop") return LAPTOP_STATUS_BADGES[category];
    if (deviceCategory === "phone") return PHONE_STATUS_BADGES[category];
    return STATUS_BADGES[category];
  })();

  // ─── Device icon for header ─────────────────────────────────
  const DeviceIcon = deviceCategory === "laptop" ? Laptop : deviceCategory === "phone" ? Smartphone : Trophy;

  // ─── Spec sheet for laptop/phone ─────────────────────────────
  const renderLaptopSpecs = () => {
    if (!isLaptopPreset(activePreset)) return null;
    const s = activePreset.laptopSpec;
    const specs = [
      { icon: Monitor, label: "Display", value: s.display.spec },
      { icon: Cpu, label: "SoC / Processor", value: s.soc.spec },
      { icon: Battery, label: "Battery", value: s.battery.spec },
      { icon: Camera, label: "Cameras", value: s.cameras.spec },
      { icon: Weight, label: "Weight", value: s.weight },
      { icon: LayoutGrid, label: "Ports", value: s.ports },
      { icon: Zap, label: "Operating System", value: s.os },
    ];
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6 transition-opacity duration-150 ${crossFade ? "opacity-0" : "opacity-100"}`}>
        {specs.map((spec, i) => {
          const Icon = spec.icon;
          return (
            <div
              key={i}
              className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 transition-all duration-150 group hover:border-cyan-500/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">{spec.label}</span>
              </div>
              <p className="text-sm font-medium text-slate-200 leading-snug">{spec.value}</p>
            </div>
          );
        })}
      </div>
    );
  };

  const renderPhoneSpecs = () => {
    if (!isPhonePreset(activePreset)) return null;
    const s = activePreset.phoneSpec;
    const specs = [
      { icon: Monitor, label: "Display", value: s.display.spec },
      { icon: Cpu, label: "Chipset", value: s.chipset.spec },
      { icon: Battery, label: "Battery", value: s.battery.spec },
      { icon: Camera, label: "Cameras", value: s.cameras.spec },
      { icon: Weight, label: "Weight", value: s.weight },
      { icon: Zap, label: "Operating System", value: s.os },
      { icon: Wifi, label: "Connectivity", value: s.connectivity },
    ];
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6 transition-opacity duration-150 ${crossFade ? "opacity-0" : "opacity-100"}`}>
        {specs.map((spec, i) => {
          const Icon = spec.icon;
          return (
            <div
              key={i}
              className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 transition-all duration-150 group hover:border-cyan-500/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">{spec.label}</span>
              </div>
              <p className="text-sm font-medium text-slate-200 leading-snug">{spec.value}</p>
            </div>
          );
        })}
      </div>
    );
  };

  // ─── PC component grid ──────────────────────────────────────
  const renderPCGrid = () => {
    if (!isBuildPreset(activePreset)) return null;
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6 transition-opacity duration-150 ${crossFade ? "opacity-0" : "opacity-100"}`}>
        {COMPONENT_KEYS.map((key) => {
          const part = activePreset[key];
          const meta = COMPONENT_META[key];
          const Icon = meta.icon;
          const isChanged = showComparison && changedParts.has(key);
          return (
            <div
              key={key}
              role="button"
              tabIndex={0}
              onClick={() => setModalPart({ part, key })}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setModalPart({ part, key }); }}
              className={
                "rounded-xl border bg-slate-900/60 p-4 transition-all duration-150 group cursor-pointer hover:border-cyan-400 active:scale-[0.99] " +
                (isChanged
                  ? "border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.1)]"
                  : "border-slate-700 hover:border-cyan-500/50")
              }
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors " +
                    (isChanged
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-slate-800 text-slate-400 group-hover:text-cyan-400")
                  }
                >
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
    );
  };

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
          <p className="text-slate-400 mt-2">
            Your perfect {deviceCategory === "pc" ? "build" : deviceCategory} is ready.
          </p>
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
                <DeviceIcon className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-100">{activePreset.title}</h2>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="relative inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/20">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
                    </span>
                    {statusBadge}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-700/50 text-slate-400 border border-slate-600/30">
                    {activePreset.budgetCategory === "budget"
                      ? "Value Pick"
                      : activePreset.budgetCategory === "mid-tier"
                        ? "Recommended"
                        : "Flagship"}
                  </span>
                  {isLaptopPreset(activePreset) && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-violet-500/15 text-violet-400 border border-violet-500/20">
                      {activePreset.brand}
                    </span>
                  )}
                  {isPhonePreset(activePreset) && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-violet-500/15 text-violet-400 border border-violet-500/20">
                      {activePreset.brand}
                    </span>
                  )}
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

        {/* ── Performance Metrics ── */}
        {activePreset.performanceMetrics.length > 0 && (
          <div
            className={`rounded-xl border border-slate-700 bg-slate-900/60 p-5 mb-6 transition-opacity duration-150 ${crossFade ? "opacity-0" : "opacity-100"}`}
          >
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
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3 text-center">
            Budget Tier
          </p>
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
              {upper && (
                <span className="text-[10px] text-slate-500">
                  ~${upper.totalEstimatedPrice.toLocaleString()}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── Compare with Alternative (Laptop / Phone) ── */}
        {(isLaptopPreset(activePreset) || isPhonePreset(activePreset)) && (
          <div className="mb-6">
            <button
              onClick={() => {
                if (showComparison) {
                  setShowComparison(false);
                  setCompareTargetId(null);
                } else {
                  // Auto-select first non-current preset as default comparison
                  const allPresets = isLaptopPreset(activePreset) ? laptopPresets : phonePresets;
                  const other = allPresets.find((p) => p.id !== activePreset.id);
                  setCompareTargetId(other?.id ?? null);
                  setShowComparison(true);
                }
              }}
              className={
                "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 border " +
                (showComparison
                  ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                  : "bg-slate-900/60 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300")
              }
            >
              <GitCompareArrows className="w-4 h-4" />
              {showComparison ? "Hide Comparison" : "Compare with Alternative"}
            </button>

            {showComparison && compareTargetId && (
              <div className="mt-3 rounded-xl border border-slate-700 bg-slate-900/60 p-5 transition-all duration-300">
                {/* Comparison target picker */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Compare with:</span>
                  {(isLaptopPreset(activePreset) ? laptopPresets : phonePresets)
                    .filter((p) => p.id !== activePreset.id)
                    .map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setCompareTargetId(p.id)}
                        className={
                          "px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all duration-200 border " +
                          (compareTargetId === p.id
                            ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-400"
                            : "bg-slate-800/50 border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300")
                        }
                      >
                        {p.brand} {p.title.split(" ").slice(-1)[0]}
                      </button>
                    ))}
                </div>

                {/* Comparison Matrix */}
                {(() => {
                  const allPresets = isLaptopPreset(activePreset) ? laptopPresets : phonePresets;
                  const target = allPresets.find((p) => p.id === compareTargetId);
                  if (!target) return null;
                  const priceDelta = target.totalEstimatedPrice - activePreset.totalEstimatedPrice;

                  if (isLaptopPreset(activePreset) && "laptopSpec" in target) {
                    const currentSpec = activePreset.laptopSpec;
                    const targetSpec = target.laptopSpec;
                    const rows = [
                      { label: "Display", icon: Monitor, current: currentSpec.display.spec, target: targetSpec.display.spec },
                      { label: "SoC / Processor", icon: Cpu, current: currentSpec.soc.spec, target: targetSpec.soc.spec },
                      { label: "Battery", icon: Battery, current: currentSpec.battery.spec, target: targetSpec.battery.spec },
                      { label: "Cameras", icon: Camera, current: currentSpec.cameras.spec, target: targetSpec.cameras.spec },
                      { label: "Weight", icon: Weight, current: currentSpec.weight, target: targetSpec.weight },
                      { label: "Ports", icon: LayoutGrid, current: currentSpec.ports, target: targetSpec.ports },
                      { label: "OS", icon: Zap, current: currentSpec.os, target: targetSpec.os },
                    ];
                    return (
                      <>
                        {/* Price delta */}
                        <div className="flex items-center justify-center gap-2 mb-4 py-2 rounded-lg bg-slate-800/50">
                          <span className="text-xs text-slate-500">Price difference:</span>
                          <span className={`text-sm font-bold ${priceDelta < 0 ? "text-emerald-400" : priceDelta > 0 ? "text-red-400" : "text-slate-400"}`}>
                            {priceDelta < 0 ? "\u2212" : priceDelta > 0 ? "+" : ""}${Math.abs(priceDelta).toLocaleString()}
                          </span>
                          <span className="text-xs text-slate-500">
                            ({priceDelta < 0 ? "cheaper" : priceDelta > 0 ? "more" : "same price"})
                          </span>
                        </div>
                        <div className="space-y-2">
                          {rows.map((row, i) => {
                            const Icon = row.icon;
                            const isDifferent = row.current !== row.target;
                            return (
                              <div key={i} className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <Icon className="w-3.5 h-3.5 text-slate-500" />
                                  <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">{row.label}</span>
                                  {isDifferent && (
                                    <span className="ml-auto px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/20">DIFF</span>
                                  )}
                                </div>
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                  <div className="flex-1 min-w-0 rounded-md bg-slate-800/50 border border-slate-700/30 px-2.5 py-1.5">
                                    <p className="text-[10px] text-cyan-400/60 uppercase font-medium mb-0.5">{activePreset.title.split(" ").slice(-1)[0]}</p>
                                    <p className="text-xs text-slate-200 font-medium leading-snug">{row.current}</p>
                                  </div>
                                  <ArrowRight className="w-3 h-3 text-slate-600 flex-shrink-0 hidden sm:block" />
                                  <div className="flex-1 min-w-0 rounded-md bg-slate-800/50 border border-slate-700/30 px-2.5 py-1.5">
                                    <p className="text-[10px] text-violet-400/60 uppercase font-medium mb-0.5">{target.title.split(" ").slice(-1)[0]}</p>
                                    <p className="text-xs text-slate-200 font-medium leading-snug">{row.target}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    );
                  }

                  if (isPhonePreset(activePreset) && "phoneSpec" in target) {
                    const currentSpec = activePreset.phoneSpec;
                    const targetSpec = target.phoneSpec;
                    const rows = [
                      { label: "Display", icon: Monitor, current: currentSpec.display.spec, target: targetSpec.display.spec },
                      { label: "Chipset", icon: Cpu, current: currentSpec.chipset.spec, target: targetSpec.chipset.spec },
                      { label: "Battery", icon: Battery, current: currentSpec.battery.spec, target: targetSpec.battery.spec },
                      { label: "Cameras", icon: Camera, current: currentSpec.cameras.spec, target: targetSpec.cameras.spec },
                      { label: "Weight", icon: Weight, current: currentSpec.weight, target: targetSpec.weight },
                      { label: "Connectivity", icon: Wifi, current: currentSpec.connectivity, target: targetSpec.connectivity },
                      { label: "OS", icon: Zap, current: currentSpec.os, target: targetSpec.os },
                    ];
                    return (
                      <>
                        <div className="flex items-center justify-center gap-2 mb-4 py-2 rounded-lg bg-slate-800/50">
                          <span className="text-xs text-slate-500">Price difference:</span>
                          <span className={`text-sm font-bold ${priceDelta < 0 ? "text-emerald-400" : priceDelta > 0 ? "text-red-400" : "text-slate-400"}`}>
                            {priceDelta < 0 ? "\u2212" : priceDelta > 0 ? "+" : ""}${Math.abs(priceDelta).toLocaleString()}
                          </span>
                          <span className="text-xs text-slate-500">
                            ({priceDelta < 0 ? "cheaper" : priceDelta > 0 ? "more" : "same price"})
                          </span>
                        </div>
                        <div className="space-y-2">
                          {rows.map((row, i) => {
                            const Icon = row.icon;
                            const isDifferent = row.current !== row.target;
                            return (
                              <div key={i} className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <Icon className="w-3.5 h-3.5 text-slate-500" />
                                  <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">{row.label}</span>
                                  {isDifferent && (
                                    <span className="ml-auto px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/20">DIFF</span>
                                  )}
                                </div>
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                  <div className="flex-1 min-w-0 rounded-md bg-slate-800/50 border border-slate-700/30 px-2.5 py-1.5">
                                    <p className="text-[10px] text-cyan-400/60 uppercase font-medium mb-0.5">{activePreset.title.split(" ").slice(-1)[0]}</p>
                                    <p className="text-xs text-slate-200 font-medium leading-snug">{row.current}</p>
                                  </div>
                                  <ArrowRight className="w-3 h-3 text-slate-600 flex-shrink-0 hidden sm:block" />
                                  <div className="flex-1 min-w-0 rounded-md bg-slate-800/50 border border-slate-700/30 px-2.5 py-1.5">
                                    <p className="text-[10px] text-violet-400/60 uppercase font-medium mb-0.5">{target.title.split(" ").slice(-1)[0]}</p>
                                    <p className="text-xs text-slate-200 font-medium leading-snug">{row.target}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    );
                  }

                  return null;
                })()}
              </div>
            )}
          </div>
        )}

        {/* ── Compare with Previous Meta (PC only) ── */}
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
              {showComparison
                ? "Hide Previous Build"
                : `Compare with Previous Best ($${(activePreset as BuildPreset).previousBuild!.totalPrice.toLocaleString()})`}
            </button>

            {showComparison && (
              <div className="mt-3 rounded-xl border border-slate-700 bg-slate-900/60 p-5 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Previous Build</p>
                    <p className="text-sm text-slate-300 font-medium">
                      {(activePreset as BuildPreset).previousBuild!.title}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-400">
                      ${(activePreset as BuildPreset).previousBuild!.totalPrice.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Retired {(activePreset as BuildPreset).previousBuild!.retiredDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 mb-4 py-2 rounded-lg bg-slate-800/50">
                  <span className="text-xs text-slate-500">Price change:</span>
                  <span
                    className={`text-sm font-bold ${priceDiff < 0 ? "text-emerald-400" : priceDiff > 0 ? "text-red-400" : "text-slate-400"}`}
                  >
                    {priceDiff < 0 ? "\u2212" : priceDiff > 0 ? "+" : ""}${Math.abs(priceDiff).toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500">
                    ({priceDiff < 0 ? "saved" : priceDiff > 0 ? "more" : "same"})
                  </span>
                </div>

                {changedParts.size > 0 ? (
                  <div className="space-y-2">
                    <p className="text-xs text-cyan-400 uppercase tracking-wider font-semibold mb-2">
                      Changed Components
                    </p>
                    {Array.from(changedParts.entries()).map(([key, { old: oldPart, new: newPart }]) => {
                      const meta = COMPONENT_META[key];
                      const Icon = meta?.icon || Cpu;
                      return (
                        <div key={key} className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className="w-3.5 h-3.5 text-slate-500" />
                            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">
                              {meta?.label || key}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <div className="flex-1 min-w-0 rounded-md bg-red-500/5 border border-red-500/15 px-2.5 py-1.5">
                              <p className="text-[10px] text-red-400/60 uppercase font-medium mb-0.5">Previous</p>
                              <p className="text-xs text-slate-400 line-through decoration-red-400/40">
                                {oldPart.spec}
                              </p>
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

        {/* ── Device-specific spec grid ── */}
        {isBuildPreset(activePreset) && renderPCGrid()}
        {isLaptopPreset(activePreset) && renderLaptopSpecs()}
        {isPhonePreset(activePreset) && renderPhoneSpecs()}

        {/* ── Action buttons ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 flex-wrap">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-slate-100 transition-all duration-300"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Copied! {"\u2713"}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Spec Sheet
              </>
            )}
          </button>

          <button
            onClick={handleCopyPlain}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-slate-100 transition-all duration-300"
          >
            {plainCopied ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Copied! {"\u2713"}</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Copy Plain Text
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

        {/* ── External Links ── */}
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          {isBuildPreset(activePreset) && (
            <a
              href={pcpartpickerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm border border-slate-700 bg-slate-900/60 hover:bg-slate-800 hover:border-emerald-500/50 text-slate-400 hover:text-emerald-400 transition-all duration-300"
            >
              <ExternalLink className="w-4 h-4" />
              Search on PCPartPicker
            </a>
          )}

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

        {/* ── Total Setup Cost (if peripherals selected) ── */}
        {selectedPeripherals.size > 0 && (
          <div className="mt-6 rounded-xl border border-cyan-500/30 bg-slate-900/60 p-5 shadow-[0_0_20px_rgba(34,211,238,0.05)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Setup Cost</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Build + {selectedPeripherals.size} selected peripheral{selectedPeripherals.size > 1 ? "s" : ""}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-cyan-400">
                  ${(activePreset.totalEstimatedPrice + peripheralTotal).toLocaleString()}
                </p>
                <p className="text-[10px] text-slate-500">
                  +${peripheralTotal.toLocaleString()} peripherals
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Recommended Peripherals & Gear ── */}
        <div className="mt-6 rounded-xl border border-slate-700 bg-slate-900/60 overflow-hidden">
          <button
            onClick={() => setShowPeripherals(!showPeripherals)}
            className="w-full flex items-center justify-between px-5 py-4 text-left transition-all hover:bg-slate-800/50"
          >
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold text-slate-200">Recommended Peripherals & Gear</span>
              {selectedPeripherals.size > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/20">
                  {selectedPeripherals.size} selected
                </span>
              )}
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${showPeripherals ? "rotate-180" : ""}`}
            />
          </button>

          {showPeripherals && (
            <div className="px-5 pb-5 space-y-4 border-t border-slate-700/50">
              {Object.entries(peripheralGroups).map(([category, items]) => (
                <div key={category} className="pt-3">
                  <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-2">
                    {PERIPHERAL_CATEGORY_LABELS[category] || category}
                  </p>
                  <div className="space-y-1.5">
                    {items.map((p) => {
                      const Icon = PERIPHERAL_ICONS[p.iconName] || Gamepad2;
                      const isSelected = selectedPeripherals.has(p.id);
                      return (
                        <button
                          key={p.id}
                          onClick={() => togglePeripheral(p.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all duration-200 text-left ${isSelected ? "border-cyan-500/40 bg-cyan-500/5" : "border-slate-700/50 bg-slate-800/20 hover:border-slate-600 hover:bg-slate-800/40"}`} >
                          <div className="w-6 h-6 flex items-center justify-center">
                            {isSelected ? (
                              <CheckSquare className="w-5 h-5 text-cyan-400" />
                            ) : (
                              <Square className="w-5 h-5 text-slate-600" />
                            )}
                          </div>
                          <Icon className="w-4 h-4 text-slate-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${isSelected ? "text-cyan-300" : "text-slate-300"}`}>{p.name}</p>
                          </div>
                          <span className="text-sm font-bold text-cyan-400 ml-2">${p.price}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Component Detail Modal ── */}
      {modalPart && (
        <ComponentDetailModal
          isOpen={!!modalPart}
          onClose={() => setModalPart(null)}
          part={modalPart.part}
          partKey={modalPart.key}
          primaryUse={preferences.primaryUse}
          deviceCategory={preferences.deviceCategory}
        />
      )}
    </div>
  );
}
