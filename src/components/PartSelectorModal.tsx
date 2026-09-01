import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, SlidersHorizontal, Check, AlertCircle, SearchX } from "lucide-react";
import type { PartCatalogItem, PartCategory } from "../types";
import ProductImage from "./ProductImage";
import { triggerLightHaptic } from "../utils/haptics";

interface PartSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: PartCategory;
  parts: PartCatalogItem[];
  onSelect: (part: PartCatalogItem) => void;
  currentPartId?: string;
  /** Optional: function to check if a part is compatible (returns null = ok, string = issue) */
  compatibilityCheck?: (part: PartCatalogItem) => { severity: "error" | "warning"; message: string } | null;
}

export default function PartSelectorModal({
  isOpen,
  onClose,
  category,
  parts,
  onSelect,
  currentPartId,
  compatibilityCheck,
}: PartSelectorModalProps) {
  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "name">("price-asc");
  const backdropRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setBrandFilter("all");
      setSortBy("price-asc");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Get unique brands, preserving order of appearance
  const brands = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const p of parts) {
      if (!seen.has(p.brand)) {
        seen.add(p.brand);
        result.push(p.brand);
      }
    }
    return result;
  }, [parts]);

  // Filter and sort
  const filtered = useMemo(() => {
    let result = parts;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.specs.some((s) => s.toLowerCase().includes(q))
      );
    }
    if (brandFilter !== "all") {
      result = result.filter((p) => p.brand === brandFilter);
    }
    result = [...result].sort((a, b) => {
      if (sortBy === "price-asc") return a.priceUSD - b.priceUSD;
      if (sortBy === "price-desc") return b.priceUSD - a.priceUSD;
      return a.name.localeCompare(b.name);
    });
    return result;
  }, [parts, search, brandFilter, sortBy]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={backdropRef}
          onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ backgroundColor: "rgba(0,0,0,0)" }}
          animate={{ backgroundColor: "rgba(0,0,0,0.7)" }}
          exit={{ backgroundColor: "rgba(0,0,0,0)" }}
          transition={{ duration: 0.2 }}
          style={{ backdropFilter: "blur(8px)" }}
        >
          <motion.div
            className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-shadow-grey-light bg-shadow-grey shadow-2xl"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-shadow-grey-light/50">
              <div>
                <h3 className="text-lg font-bold text-slate-100">Select Part</h3>
                <span className="text-xs text-cinnabar-400 font-medium uppercase tracking-wider">{category.toUpperCase()}</span>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-lg bg-shadow-grey flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search + Filters */}
            <div className="px-5 py-3 border-b border-shadow-grey-light/50 space-y-2.5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, brand, or specs..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-shadow-grey border border-shadow-grey-light text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cinnabar-500/50 focus:ring-1 focus:ring-cinnabar-500/20 transition-all"
                />
              </div>

              {/* Brand Filter Chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => setBrandFilter("all")}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all border ${
                    brandFilter === "all"
                      ? "bg-cinnabar-500/15 border-cinnabar-500/30 text-cinnabar-400"
                      : "bg-shadow-grey/50 border-shadow-grey-light text-slate-500 hover:border-shadow-grey-light hover:text-slate-300"
                  }`}
                >
                  All
                </button>
                {brands.map((b) => (
                  <button
                    key={b}
                    onClick={() => setBrandFilter(b === brandFilter ? "all" : b)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all border ${
                      brandFilter === b
                        ? "bg-cinnabar-500/15 border-cinnabar-500/30 text-cinnabar-400"
                        : "bg-shadow-grey/50 border-shadow-grey-light text-slate-500 hover:border-shadow-grey-light hover:text-slate-300"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>

              {/* Sort + Count */}
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="px-2.5 py-1.5 rounded-lg bg-shadow-grey border border-shadow-grey-light text-xs text-slate-300 focus:outline-none focus:border-cinnabar-500/50"
                >
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                  <option value="name">Name: A → Z</option>
                </select>
                <span className="text-[11px] text-slate-500 ml-auto">{filtered.length} part{filtered.length !== 1 ? "s" : ""}</span>
              </div>
            </div>

            {/* Parts List */}
            <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="w-20 h-20 rounded-2xl bg-shadow-grey/50 border border-shadow-grey-light/50 flex items-center justify-center mb-4"
                  >
                    <SearchX className="w-10 h-10 text-slate-600" />
                  </motion.div>
                  <p className="text-sm font-medium text-slate-400 mb-1">No compatible components found</p>
                  <p className="text-xs text-slate-600">Try loosening brand or search filters</p>
                </div>
              ) : (
                filtered.map((part) => {
                  const isSelected = part.id === currentPartId;
                  const compatIssue = compatibilityCheck?.(part);
                  return (
                    <button
                      key={part.id}
                      onClick={() => { triggerLightHaptic(); onSelect(part); onClose(); }}
                      className={`w-full text-left rounded-xl border p-3 transition-all duration-200 group flex items-start gap-3 ${
                        isSelected
                          ? "border-cinnabar-500/40 bg-cinnabar-500/5"
                          : compatIssue?.severity === "error"
                            ? "border-red-500/20 bg-red-500/5 hover:border-red-500/30"
                            : "border-shadow-grey-light/50 bg-shadow-grey/30 hover:border-cinnabar-500/30 hover:bg-shadow-grey/60"
                      }`}
                    >
                      {/* Thumbnail */}
                      <ProductImage
                        src={part.imageUrl}
                        alt={part.name}
                        category={part.category}
                        className="flex-shrink-0 w-14 h-14 border border-shadow-grey-light/50"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="text-sm font-semibold text-slate-200 truncate">{part.name}</h4>
                          {isSelected && (
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cinnabar-500 flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </span>
                          )}
                          {compatIssue && (
                            <span className={`flex-shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              compatIssue.severity === "error"
                                ? "bg-red-500/15 text-red-400 border border-red-500/20"
                                : "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                            }`}>
                              <AlertCircle className="w-2.5 h-2.5 inline mr-0.5 -mt-0.5" />
                              {compatIssue.severity === "error" ? "INCOMPATIBLE" : "CHECK"}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-shadow-grey text-slate-400 border border-shadow-grey-light/50">{part.brand}</span>
                          {part.socket && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-shadow-grey text-slate-500 border border-shadow-grey-light/50">{part.socket}</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1 mb-1.5">
                          {part.specs.slice(0, 3).map((spec, i) => (
                            <span key={i} className="px-1.5 py-0.5 rounded text-[10px] bg-shadow-grey/60 text-slate-400 border border-shadow-grey-light/30">{spec}</span>
                          ))}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-cinnabar-400">${part.priceUSD.toLocaleString()}</span>
                          <span className="text-[11px] text-slate-500">₹{part.priceINR.toLocaleString()}</span>
                          {part.tdpWatts > 0 && <span className="text-[10px] text-slate-500">{part.tdpWatts}W TDP</span>}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
