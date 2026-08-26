import { useState, useCallback, useMemo, useEffect } from "react";
import {
  Cpu,
  CircuitBoard,
  MemoryStick,
  HardDrive,
  LayoutGrid,
  Plug,
  Fan,
  Box,
  Plus,
  ArrowLeftRight,
  Trash2,
  RotateCcw,
  Check,
  FileText,
  Link2,
  Zap,
  Download,
  AlertTriangle,
  AlertCircle,
  Info,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import type { PartCatalogItem, PartCategory } from "../types";
import { partsCatalog, PART_CATEGORY_LABELS, PART_CATEGORY_ORDER } from "../data/partsCatalog";
import PartSelectorModal from "./PartSelectorModal";
import ProductImage from "./ProductImage";
import { checkCompatibility, getCategorySeverity, getCategoryIssues } from "../utils/compatibility";
import { autoSync, getLastUpdatedLabel, isSyncActive } from "../utils/priceSync";
import { triggerLightHaptic, triggerMediumHaptic } from "../utils/haptics";

// ─── Icon map for categories ─────────────────────────────────
const CATEGORY_ICONS: Record<PartCategory, LucideIcon> = {
  cpu: Cpu,
  gpu: CircuitBoard,
  ram: MemoryStick,
  storage: HardDrive,
  motherboard: LayoutGrid,
  psu: Plug,
  cooler: Fan,
  case: Box,
};

interface CustomPCBuilderProps {
  onBack: () => void;
  initialParts?: Record<PartCategory, string | null>;
}

export default function CustomPCBuilder({ onBack, initialParts }: CustomPCBuilderProps) {
  const [selectedParts, setSelectedParts] = useState<Record<PartCategory, PartCatalogItem | null>>({
    cpu: null,
    gpu: null,
    ram: null,
    storage: null,
    motherboard: null,
    psu: null,
    cooler: null,
    case: null,
  });

  const [modalCategory, setModalCategory] = useState<PartCategory | null>(null);
  const [copied, setCopied] = useState(false);
  const [plainCopied, setPlainCopied] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);
  const [syncLabel, setSyncLabel] = useState(getLastUpdatedLabel());

  // Auto-sync prices on mount
  useEffect(() => {
    autoSync();
    setSyncLabel(getLastUpdatedLabel());
  }, []);

  // Load from URL on mount
  useEffect(() => {
    if (initialParts) {
      const loaded = { ...selectedParts };
      for (const cat of PART_CATEGORY_ORDER) {
        const partId = initialParts[cat];
        if (partId) {
          const found = partsCatalog.find((p) => p.id === partId);
          if (found) loaded[cat] = found;
        }
      }
      setSelectedParts(loaded);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Compute totals
  const totalPrice = useMemo(
    () => Object.values(selectedParts).reduce((sum, p) => sum + (p?.priceUSD ?? 0), 0),
    [selectedParts]
  );

  const totalWattage = useMemo(
    () => Object.values(selectedParts).reduce((sum, p) => sum + (p?.tdpWatts ?? 0), 0),
    [selectedParts]
  );

  const filledCount = Object.values(selectedParts).filter(Boolean).length;

  // Recommended PSU wattage (1.5x headroom over TDP)
  const recommendedPSU = useMemo(() => {
    const base = totalWattage + 100; // 100W for mobo, fans, etc.
    if (base <= 450) return 550;
    if (base <= 600) return 650;
    if (base <= 750) return 850;
    return 1000;
  }, [totalWattage]);

  // ─── Compatibility checks ───────────────────────────────────
  const compatibilityIssues = useMemo(
    () => checkCompatibility(selectedParts),
    [selectedParts]
  );

  const errorCount = compatibilityIssues.filter((i) => i.severity === "error").length;
  const warningCount = compatibilityIssues.filter((i) => i.severity === "warning").length;

  const severityColors: Record<string, string> = {
    error: "border-red-500/40 bg-red-500/5 shadow-[0_0_12px_rgba(239,68,68,0.1)]",
    warning: "border-amber-500/40 bg-amber-500/5 shadow-[0_0_12px_rgba(245,158,11,0.08)]",
    info: "border-cyan-500/30 bg-slate-900/80 shadow-[0_0_12px_rgba(34,211,238,0.05)]",
  };

  const handleSelect = useCallback((part: PartCatalogItem) => {
    triggerLightHaptic();
    setSelectedParts((prev) => ({ ...prev, [part.category]: part }));
  }, []);

  const handleRemove = useCallback((cat: PartCategory) => {
    triggerLightHaptic();
    setSelectedParts((prev) => ({ ...prev, [cat]: null }));
  }, []);

  const handleSwap = useCallback((cat: PartCategory) => {
    setModalCategory(cat);
  }, []);

  const handleReset = useCallback(() => {
    setSelectedParts({
      cpu: null, gpu: null, ram: null, storage: null,
      motherboard: null, psu: null, cooler: null, case: null,
    });
  }, []);

  // ─── Copy functions ──────────────────────────────────────────
  const buildMarkdown = useCallback(() => {
    const lines: string[] = [];
    lines.push(`\u{1F3AE} RigAssigner Custom Build (~$${totalPrice.toLocaleString()})`);
    lines.push("");
    for (const cat of PART_CATEGORY_ORDER) {
      const part = selectedParts[cat];
      if (part) {
        lines.push(`\u2022 ${PART_CATEGORY_LABELS[cat]}: ${part.name} ($${part.priceUSD})`);
      }
    }
    if (totalWattage > 0) {
      lines.push("");
      lines.push(`Estimated Power: ${totalWattage}W / Recommended PSU: ${recommendedPSU}W+`);
    }
    lines.push("");
    lines.push("Generated via RigAssigner");
    return lines.join("\n");
  }, [selectedParts, totalPrice, totalWattage, recommendedPSU]);

  const buildPlainText = useCallback(() => {
    const lines: string[] = [];
    lines.push(`RigAssigner Custom Build (~$${totalPrice.toLocaleString()})`);
    lines.push("");
    for (const cat of PART_CATEGORY_ORDER) {
      const part = selectedParts[cat];
      if (part) {
        lines.push(`${PART_CATEGORY_LABELS[cat]}: ${part.name} ($${part.priceUSD})`);
      }
    }
    if (totalWattage > 0) {
      lines.push("");
      lines.push(`Power: ${totalWattage}W / Recommended PSU: ${recommendedPSU}W+`);
    }
    lines.push("");
    lines.push("Generated via RigAssigner");
    return lines.join("\n");
  }, [selectedParts, totalPrice, totalWattage, recommendedPSU]);

  const handleDownload = useCallback(() => {
    triggerMediumHaptic();
    const text = buildMarkdown();
    const blob = new Blob([text], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rig-assigner-build.md";
    a.click();
    URL.revokeObjectURL(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [buildMarkdown]);

  const handleDownloadPlain = useCallback(() => {
    triggerMediumHaptic();
    const text = buildPlainText();
    const blob = new Blob([text], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rig-spec-sheet.txt";
    a.click();
    URL.revokeObjectURL(url);
    setPlainCopied(true);
    setTimeout(() => setPlainCopied(false), 2000);
  }, [buildPlainText]);

  const handleShareUrl = useCallback(async () => {
    triggerMediumHaptic();
    const url = new URL(window.location.href);
    url.searchParams.set("mode", "builder");
    const partIds = PART_CATEGORY_ORDER
      .filter((cat) => selectedParts[cat])
      .map((cat) => `${cat}_${selectedParts[cat]!.id.replace(/^[a-z]+_/, "")}`)
      .join(",");
    url.searchParams.set("parts", partIds);
    await navigator.clipboard.writeText(url.toString());
    setUrlCopied(true);
    setTimeout(() => setUrlCopied(false), 2000);
    window.history.replaceState({}, "", url.toString());
  }, [selectedParts]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* ── Sticky Header ── */}
      <div className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                Switch Mode
              </button>
              <div>
                <h1 className="text-lg font-bold">
                  <span className="text-cyan-400">Rig</span> Workbench
                </h1>
                <p className="text-[11px] text-slate-500">
                  {filledCount}/8 parts selected
                </p>
              </div>
            </div>

            {/* Price Sync Indicator */}
            {isSyncActive() && (
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                </span>
                Pricing Feed: Active ({syncLabel})
              </div>
            )}

            {/* Summary Stats */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Total</p>
                <p className="text-xl font-bold text-cyan-400">${totalPrice.toLocaleString()}</p>
              </div>
              {totalWattage > 0 && (
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Power</p>
                  <div className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <p className="text-sm font-semibold text-slate-200">
                      {totalWattage}W
                    </p>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    PSU: {recommendedPSU}W+
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* ── Compatibility Status Banner ── */}
        {compatibilityIssues.length > 0 && (
          <div className={`rounded-xl border p-4 mb-6 transition-all duration-300 ${
            errorCount > 0
              ? "border-red-500/30 bg-red-500/5"
              : warningCount > 0
                ? "border-amber-500/30 bg-amber-500/5"
                : "border-cyan-500/20 bg-cyan-500/5"
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {errorCount > 0 ? (
                <AlertCircle className="w-4 h-4 text-red-400" />
              ) : warningCount > 0 ? (
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              ) : (
                <Info className="w-4 h-4 text-cyan-400" />
              )}
              <span className={`text-sm font-semibold ${
                errorCount > 0 ? "text-red-400" :
                warningCount > 0 ? "text-amber-400" : "text-cyan-400"
              }`}>
                {errorCount > 0
                  ? `${errorCount} compatibility issue${errorCount > 1 ? "s" : ""} found`
                  : warningCount > 0
                    ? `${warningCount} warning${warningCount > 1 ? "s" : ""}`
                    : "Build info"
                }
              </span>
              {errorCount === 0 && warningCount === 0 && (
                <ShieldCheck className="w-4 h-4 text-emerald-400 ml-auto" />
              )}
            </div>
            <div className="space-y-1">
              {compatibilityIssues.slice(0, 3).map((issue, i) => (
                <p key={i} className={`text-xs ${
                  issue.severity === "error" ? "text-red-300" :
                  issue.severity === "warning" ? "text-amber-300" : "text-slate-400"
                }`}>
                  {issue.severity === "error" ? "✗" : issue.severity === "warning" ? "⚠" : "ℹ"} {issue.message}
                </p>
              ))}
              {compatibilityIssues.length > 3 && (
                <p className="text-[11px] text-slate-500">
                  +{compatibilityIssues.length - 3} more issue{compatibilityIssues.length - 3 > 1 ? "s" : ""} — check individual component slots
                </p>
              )}
            </div>
          </div>
        )}
        {compatibilityIssues.length === 0 && filledCount >= 2 && (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 mb-6 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">All compatibility checks passed</span>
          </div>
        )}

        {/* ── Component Slots Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {PART_CATEGORY_ORDER.map((cat) => {
            const Icon = CATEGORY_ICONS[cat];
            const part = selectedParts[cat];
            const label = PART_CATEGORY_LABELS[cat];
            const catSeverity = part ? getCategorySeverity(cat, compatibilityIssues) : null;
            const catIssues = part ? getCategoryIssues(cat, compatibilityIssues) : [];

            // Determine card border style
            let cardClass = "rounded-xl border p-4 transition-all duration-200 ";
            if (part && catSeverity) {
              cardClass += severityColors[catSeverity];
            } else if (part) {
              cardClass += "border-cyan-500/30 bg-slate-900/80 shadow-[0_0_12px_rgba(34,211,238,0.05)]";
            } else {
              cardClass += "border-slate-700 bg-slate-900/40 border-dashed";
            }

            return (
              <div key={cat} className={cardClass}>
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      part ? "bg-cyan-500/15 text-cyan-400" : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">
                    {label}
                  </span>
                </div>

                {part ? (
                  <>
                    <ProductImage
                      src={part.imageUrl}
                      alt={part.name}
                      category={cat}
                      className="w-12 h-12 mb-2 border border-slate-700/50"
                    />
                    <p className="text-sm font-medium text-slate-200 leading-snug mb-1 line-clamp-2">
                      {part.name}
                    </p>
                    <p className="text-xs text-cyan-400 font-bold mb-2">
                      ${part.priceUSD.toLocaleString()}
                    </p>
                    {/* Compatibility issue badges */}
                    {catIssues.length > 0 && (
                      <div className="space-y-1 mb-2">
                        {catIssues.map((issue, i) => (
                          <div key={i} className="flex items-start gap-1.5">
                            {issue.severity === "error" && <AlertCircle className="w-3 h-3 text-red-400 mt-0.5 flex-shrink-0" />}
                            {issue.severity === "warning" && <AlertTriangle className="w-3 h-3 text-amber-400 mt-0.5 flex-shrink-0" />}
                            {issue.severity === "info" && <Info className="w-3 h-3 text-cyan-400 mt-0.5 flex-shrink-0" />}
                            <p className={`text-[10px] leading-snug ${
                              issue.severity === "error" ? "text-red-400" :
                              issue.severity === "warning" ? "text-amber-400" : "text-cyan-400"
                            }`}>{issue.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleSwap(cat)}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-medium bg-slate-800 border border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                      >
                        <ArrowLeftRight className="w-3 h-3" />
                        Swap
                      </button>
                      <button
                        onClick={() => handleRemove(cat)}
                        className="flex items-center justify-center px-2 py-1.5 rounded-lg text-[11px] bg-slate-800 border border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => { triggerLightHaptic(); setModalCategory(cat); }}
                    className="w-full mt-1 flex items-center justify-center gap-1.5 px-3 py-3 rounded-lg text-sm font-medium text-cyan-400/70 border border-dashed border-cyan-500/20 hover:border-cyan-500/50 hover:bg-cyan-500/5 hover:text-cyan-400 transition-all animate-pulse-slow"
                  >
                    <Plus className="w-4 h-4" />
                    Choose {label}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Power Budget Bar ── */}
        {totalWattage > 0 && (
          <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Power Budget
              </span>
              <span className="text-sm font-semibold text-slate-200">
                {totalWattage}W / {recommendedPSU}W+
              </span>
            </div>
            <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min((totalWattage / recommendedPSU) * 100, 100)}%`,
                  background: totalWattage > recommendedPSU * 0.85
                    ? "linear-gradient(to right, #f59e0b, #ef4444)"
                    : "linear-gradient(to right, #22d3ee, #3b82f6)",
                }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              {selectedParts.psu
                ? `Your ${selectedParts.psu.name.split(" ")[0]} ${selectedParts.psu.name.split(" ")[1]} provides ${selectedParts.psu.specs[0]} — ${
                    totalWattage <= parseInt(selectedParts.psu.specs[0]) * 0.85
                      ? "plenty of headroom"
                      : "getting close to limit"
                  }`
                : "Select a PSU to check power compatibility"}
            </p>
          </div>
        )}

        {/* ── Action Buttons ── */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4 flex-wrap">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-slate-100 transition-all"
          >
            <span className={copied ? "animate-morph-check inline-flex items-center gap-2" : "inline-flex items-center gap-2"}>
              {copied ? (
                <><Check className="w-4 h-4 text-green-400" /><span className="text-green-400">Downloaded! ✓</span></>
              ) : (
                <><Download className="w-4 h-4" />Download Markdown</>
              )}
            </span>
          </button>
          <button
            onClick={handleDownloadPlain}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-slate-100 transition-all"
          >
            <span className={plainCopied ? "animate-morph-check inline-flex items-center gap-2" : "inline-flex items-center gap-2"}>
              {plainCopied ? (
                <><Check className="w-4 h-4 text-green-400" /><span className="text-green-400">Downloaded! ✓</span></>
              ) : (
                <><FileText className="w-4 h-4" />Download Plain Text</>
              )}
            </span>
          </button>
          <button
            onClick={handleShareUrl}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-slate-100 transition-all"
          >
            <span className={urlCopied ? "animate-morph-check inline-flex items-center gap-2" : "inline-flex items-center gap-2"}>
              {urlCopied ? (
                <><Check className="w-4 h-4 text-green-400" /><span className="text-green-400">Link Copied! ✓</span></>
              ) : (
                <><Link2 className="w-4 h-4" />Save / Share URL</>
              )}
            </span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/30 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        {/* ── Export Summary ── */}
        {filledCount > 0 && (
          <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Download className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-cyan-400 uppercase tracking-wider font-semibold">
                Build Summary
              </span>
            </div>
            <div className="space-y-1.5">
              {PART_CATEGORY_ORDER.map((cat) => {
                const part = selectedParts[cat];
                if (!part) return null;
                return (
                  <div key={cat} className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">{PART_CATEGORY_LABELS[cat]}</span>
                    <span className="text-slate-300 font-medium">{part.name}</span>
                    <span className="text-cyan-400 font-bold ml-3">${part.priceUSD}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-300">Total</span>
              <span className="text-xl font-bold text-cyan-400">${totalPrice.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Part Selector Modal ── */}
      {modalCategory && (
        <PartSelectorModal
          isOpen={!!modalCategory}
          onClose={() => setModalCategory(null)}
          category={modalCategory}
          parts={partsCatalog.filter((p) => p.category === modalCategory)}
          onSelect={handleSelect}
          currentPartId={selectedParts[modalCategory]?.id}
        />
      )}
    </div>
  );
}
