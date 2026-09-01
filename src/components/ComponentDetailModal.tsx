import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  ShoppingCart,
} from "lucide-react";
import type { ComponentPart, PrimaryUse, DeviceCategory } from "../types";
import ProductImage from "./ProductImage";

// ─── Mock data per part name for community verdict & specs ──────
interface PartDetailData {
  categoryBadge: string;
  specs: { label: string; value: string }[];
  pros: string[];
  cons: string[];
  workloadReason: string;
}

const PART_DETAIL_DB: Record<string, PartDetailData> = {
  // CPUs
  "AMD Ryzen 7 7800X3D": {
    categoryBadge: "CPU — Gaming",
    specs: [
      { label: "Cores / Threads", value: "8C / 16T" },
      { label: "Base / Boost Clock", value: "4.2 / 5.0 GHz" },
      { label: "L3 Cache", value: "96MB (3D V-Cache)" },
      { label: "TDP", value: "120W" },
      { label: "Socket", value: "AM5" },
    ],
    pros: ["Best gaming CPU per dollar", "Efficient 120W TDP", "96MB cache eliminates stuttering"],
    cons: ["Lower productivity perf vs 7900X", "No integrated graphics", "Requires DDR5 + AM5 board"],
    workloadReason: "The 3D V-Cache makes this the king of gaming frame rates, especially at 1440p where CPU bottleneck matters most.",
  },
  "AMD Ryzen 9 9800X3D": {
    categoryBadge: "CPU — Flagship Gaming",
    specs: [
      { label: "Cores / Threads", value: "8C / 16T" },
      { label: "Base / Boost Clock", value: "4.7 / 5.2 GHz" },
      { label: "L3 Cache", value: "96MB (3D V-Cache)" },
      { label: "TDP", value: "120W" },
      { label: "Socket", value: "AM5" },
    ],
    pros: ["Fastest gaming CPU available", "Zen 5 IPC improvements", "Same efficient 120W TDP"],
    cons: ["Expensive launch pricing", "Gaming-only gains over 7800X3D", "Limited availability"],
    workloadReason: "Top-tier frame rates at every resolution — the 9800X3D trades blows with no one in pure gaming workloads.",
  },
  "AMD Ryzen 7 9700X": {
    categoryBadge: "CPU — Mid-Range",
    specs: [
      { label: "Cores / Threads", value: "8C / 16T" },
      { label: "Base / Boost Clock", value: "3.8 / 5.5 GHz" },
      { label: "TDP", value: "65W" },
      { label: "Socket", value: "AM5" },
    ],
    pros: ["Very efficient 65W", "Strong single-core", "Great value"],
    cons: ["No 3D V-Cache for gaming", "iGPU basic only"],
    workloadReason: "Balanced workloads that need both productivity and gaming — efficient enough for SFF builds.",
  },
  "AMD Ryzen 9 7900X": {
    categoryBadge: "CPU — Productivity",
    specs: [
      { label: "Cores / Threads", value: "12C / 24T" },
      { label: "Base / Boost Clock", value: "4.7 / 5.6 GHz" },
      { label: "TDP", value: "170W" },
      { label: "Socket", value: "AM5" },
    ],
    pros: ["12 cores for rendering", "High clock speeds", "CUDA + Blender beast"],
    cons: ["Runs hot under load", "Needs beefy cooler", "Overkill for gaming-only"],
    workloadReason: "12 cores crush video rendering timelines and AI model training while still delivering solid gaming performance.",
  },
  "AMD Ryzen 5 7600X": {
    categoryBadge: "CPU — Budget",
    specs: [
      { label: "Cores / Threads", value: "6C / 12T" },
      { label: "Base / Boost Clock", value: "4.7 / 5.3 GHz" },
      { label: "TDP", value: "105W" },
      { label: "Socket", value: "AM5" },
    ],
    pros: ["Excellent value", "AM5 upgrade path", "Cooler included"],
    cons: ["6 cores limits heavy workloads", "No 3D V-Cache"],
    workloadReason: "Best price-to-performance for 1080p gaming and light productivity on the AM5 platform.",
  },
  "Intel Core i5-13600K": {
    categoryBadge: "CPU — Mid-Range",
    specs: [
      { label: "Cores / Threads", value: "14C (6P+8E) / 20T" },
      { label: "Base / Boost Clock", value: "3.5 / 5.1 GHz" },
      { label: "TDP", value: "125W (PBP)" },
      { label: "Socket", value: "LGA 1700" },
    ],
    pros: ["Hybrid architecture great for multitasking", "Overclockable", "DDR4 or DDR5 support"],
    cons: ["Higher power draw than AMD", "LGA 1700 end-of-life"],
    workloadReason: "14 cores handle video encoding and multitasking; strong single-core for CAD and gaming.",
  },
  // GPUs
  "NVIDIA GeForce RTX 4070 Super": {
    categoryBadge: "GPU — Mid-High",
    specs: [
      { label: "CUDA Cores", value: "7,168" },
      { label: "VRAM", value: "12GB GDDR6X" },
      { label: "Boost Clock", value: "2,475 MHz" },
      { label: "TDP", value: "220W" },
      { label: "Architecture", value: "Ada Lovelace" },
    ],
    pros: ["1440p king", "DLSS 3 Frame Gen", "Very efficient"],
    cons: ["12GB VRAM limiting for AI", "No DisplayPort 2.1"],
    workloadReason: "12GB VRAM + CUDA cores handle 1440p gaming with ray tracing and light AI inference comfortably.",
  },
  "NVIDIA GeForce RTX 4070 Ti Super": {
    categoryBadge: "GPU — High-End",
    specs: [
      { label: "CUDA Cores", value: "8,448" },
      { label: "VRAM", value: "16GB GDDR6X" },
      { label: "Boost Clock", value: "2,610 MHz" },
      { label: "TDP", value: "285W" },
      { label: "Architecture", value: "Ada Lovelace" },
    ],
    pros: ["4K capable with DLSS", "16GB VRAM for AI workloads", "Excellent ray tracing"],
    cons: ["Pricey at MSRP", "Requires 750W+ PSU"],
    workloadReason: "16GB VRAM opens up local LLM inference and professional 3D rendering while dominating 4K gaming.",
  },
  "NVIDIA GeForce RTX 4060 Ti": {
    categoryBadge: "GPU — Budget-Mid",
    specs: [
      { label: "CUDA Cores", value: "4,352" },
      { label: "VRAM", value: "8GB GDDR6" },
      { label: "Boost Clock", value: "2,535 MHz" },
      { label: "TDP", value: "160W" },
      { label: "Architecture", value: "Ada Lovelace" },
    ],
    pros: ["Very power efficient", "Great for 1080p maxed", "DLSS 3 support"],
    cons: ["8GB VRAM is tight", "Only 128-bit memory bus"],
    workloadReason: "Solid 1080p performance at excellent efficiency — enough VRAM for gaming and light content creation.",
  },
  "NVIDIA GeForce RTX 4080 Super": {
    categoryBadge: "GPU — Flagship",
    specs: [
      { label: "CUDA Cores", value: "10,240" },
      { label: "VRAM", value: "16GB GDDR6X" },
      { label: "Boost Clock", value: "2,550 MHz" },
      { label: "TDP", value: "320W" },
      { label: "Architecture", value: "Ada Lovelace" },
    ],
    pros: ["4K 60+ FPS ultra settings", "16GB VRAM for pro work", "DLSS 3 + ray tracing"],
    cons: ["Very expensive", "Large physical size", "Overkill for 1080p"],
    workloadReason: "Top-tier 4K gaming and professional GPU-accelerated rendering — the sweet spot below the 4090.",
  },
  "NVIDIA GeForce RTX 4090": {
    categoryBadge: "GPU — Enthusiast",
    specs: [
      { label: "CUDA Cores", value: "16,384" },
      { label: "VRAM", value: "24GB GDDR6X" },
      { label: "Boost Clock", value: "2,520 MHz" },
      { label: "TDP", value: "450W" },
      { label: "Architecture", value: "Ada Lovelace" },
    ],
    pros: ["Fastest consumer GPU ever", "24GB VRAM for anything", "AI/ML beast"],
    cons: ["Extremely expensive", "Enormous size", "Overkill for most"],
    workloadReason: "24GB VRAM and raw CUDA horsepower — runs local LLMs, heavy 3D rendering, and 4K ultra simultaneously.",
  },
  // RAM
  "32GB (2x16GB) DDR5-6000 CL30": {
    categoryBadge: "RAM — Sweet Spot",
    specs: [
      { label: "Capacity", value: "32GB (2 × 16GB)" },
      { label: "Speed", value: "DDR5-6000 CL30" },
      { label: "Bandwidth", value: "~48 GB/s dual-channel" },
    ],
    pros: ["6000MT/s is AM5 sweet spot", "Dual-rank for best perf", "Low latency CL30"],
    cons: ["Not future-proof 64GB", "DDR5 only"],
    workloadReason: "32GB handles 1440p gaming, video editing timelines, and moderate AI workloads without swapping.",
  },
  "64GB (2x32GB) DDR5-5600 CL36": {
    categoryBadge: "RAM — High Capacity",
    specs: [
      { label: "Capacity", value: "64GB (2 × 32GB)" },
      { label: "Speed", value: "DDR5-5600 CL36" },
      { label: "Bandwidth", value: "~44 GB/s dual-channel" },
    ],
    pros: ["64GB for heavy workloads", "Fits large Blender scenes", "Room for VMs + multitasking"],
    cons: ["CL36 slightly slower", "Price premium over 32GB"],
    workloadReason: "64GB enables 4K RAW editing, large AI model fine-tuning, and running multiple heavy apps simultaneously.",
  },
  "16GB (2x8GB) DDR5-5600 CL36": {
    categoryBadge: "RAM — Budget",
    specs: [
      { label: "Capacity", value: "16GB (2 × 8GB)" },
      { label: "Speed", value: "DDR5-5600 CL36" },
      { label: "Bandwidth", value: "~44 GB/s dual-channel" },
    ],
    pros: ["Affordable entry to DDR5", "Fine for esports gaming", "Upgrade later to 32GB"],
    cons: ["16GB is minimum in 2026", "Will fill up with Chrome + games"],
    workloadReason: "Gets you started — 16GB handles light gaming and browsing. Plan to upgrade to 32GB when budget allows.",
  },
  // Motherboards
  "MSI MAG B650 TOMAHAWK WiFi": {
    categoryBadge: "Motherboard — Mid-Range",
    specs: [
      { label: "Socket", value: "AM5" },
      { label: "Chipset", value: "AMD B650" },
      { label: "Memory", value: "DDR5 up to 6400+ MT/s" },
      { label: "Storage", value: "3x M.2 NVMe (1x Gen5)" },
      { label: "WiFi", value: "WiFi 6E + BT 5.2" },
    ],
    pros: ["Excellent VRM for the price", "Gen5 M.2 slot", "Great I/O"],
    cons: ["No PCIe 5.0 GPU slot", "Limited USB-C"],
    workloadReason: "Solid mid-range board with everything needed — good VRMs for the 7800X3D and future CPU upgrades.",
  },
  "ASUS ROG Strix X670E-F Gaming WiFi": {
    categoryBadge: "Motherboard — High-End",
    specs: [
      { label: "Socket", value: "AM5" },
      { label: "Chipset", value: "AMD X670E" },
      { label: "Memory", value: "DDR5 up to 6400+ MT/s" },
      { label: "Storage", value: "4x M.2 NVMe (2x Gen5)" },
      { label: "WiFi", value: "WiFi 6E + BT 5.3" },
    ],
    pros: ["Premium VRM for overclocking", "2x Gen5 M.2", "USB4 support"],
    cons: ["Expensive", "Overkill for stock clocks"],
    workloadReason: "Premium power delivery and connectivity for flagship CPUs and multiple high-speed NVMe drives.",
  },
  "Gigabyte B650M DS3H": {
    categoryBadge: "Motherboard — Budget",
    specs: [
      { label: "Socket", value: "AM5" },
      { label: "Chipset", value: "AMD B650" },
      { label: "Memory", value: "DDR5 up to 6400+ MT/s" },
      { label: "Storage", value: "2x M.2 NVMe" },
      { label: "WiFi", value: "WiFi 6E" },
    ],
    pros: ["Cheapest AM5 board", "Functional VRMs", "Enough for budget builds"],
    cons: ["Basic VRMs", "Limited expansion", "mATX only"],
    workloadReason: "Gets the job done at the lowest price — pairs perfectly with budget Ryzen 5 chips.",
  },
  "Gigabyte B760M DS3H DDR5": {
    categoryBadge: "Motherboard — Budget Intel",
    specs: [
      { label: "Socket", value: "LGA 1700" },
      { label: "Chipset", value: "Intel B760" },
      { label: "Memory", value: "DDR5 up to 5600 MT/s" },
      { label: "Storage", value: "2x M.2 NVMe" },
      { label: "WiFi", value: "WiFi 6E" },
    ],
    pros: ["Affordable Intel option", "DDR5 support", "Decent I/O"],
    cons: ["No CPU overclocking", "B760 is limited"],
    workloadReason: "Budget Intel platform — handles i5 chips well for balanced gaming and productivity.",
  },
  "MSI PRO B650M-P": {
    categoryBadge: "Motherboard — Value",
    specs: [
      { label: "Socket", value: "AM5" },
      { label: "Chipset", value: "AMD B650" },
      { label: "Memory", value: "DDR5 up to 6400 MT/s" },
      { label: "Storage", value: "2x M.2 NVMe" },
    ],
    pros: ["Very affordable", "Reliable MSI build", "AM5 upgrade path"],
    cons: ["Basic VRMs", "No WiFi on some SKUs"],
    workloadReason: "Lowest-cost AM5 board — good for SFF and budget office builds.",
  },
  // Storage
  "2TB Samsung 990 PRO NVMe Gen4": {
    categoryBadge: "Storage — Premium",
    specs: [
      { label: "Capacity", value: "2TB" },
      { label: "Interface", value: "PCIe Gen4 x4 NVMe" },
      { label: "Sequential Read", value: "7,450 MB/s" },
      { label: "Sequential Write", value: "6,900 MB/s" },
      { label: "Endurance", value: "1,200 TBW" },
    ],
    pros: ["Top Gen4 speeds", "DRAM缓存 for sustained writes", "Excellent endurance"],
    cons: ["Gen5 drives exist now", "Price premium"],
    workloadReason: "Fast enough for 4K video scrubbing and game loading — the DRAM cache keeps large writes smooth.",
  },
  "1TB Samsung 980 PRO NVMe Gen4": {
    categoryBadge: "Storage — Mid-Range",
    specs: [
      { label: "Capacity", value: "1TB" },
      { label: "Interface", value: "PCIe Gen4 x4 NVMe" },
      { label: "Sequential Read", value: "7,000 MB/s" },
      { label: "Sequential Write", value: "5,100 MB/s" },
    ],
    pros: ["Still very fast", "Proven reliability", "Good price-to-capacity"],
    cons: ["1TB fills up fast", "Slightly dated"],
    workloadReason: "Reliable, fast storage for OS + games + one or two video projects.",
  },
  "1TB WD Blue SN580 NVMe Gen4": {
    categoryBadge: "Storage — Budget",
    specs: [
      { label: "Capacity", value: "1TB" },
      { label: "Interface", value: "PCIe Gen4 x4 NVMe" },
      { label: "Sequential Read", value: "4,150 MB/s" },
      { label: "Sequential Write", value: "4,150 MB/s" },
    ],
    pros: ["Great value", "Sufficient for gaming", "Cool running"],
    cons: ["No DRAM cache", "Slower sustained writes"],
    workloadReason: "Budget NVMe that's fast enough for gaming and OS boot — save your budget for GPU/RAM.",
  },
  "2TB Crucial P3 Plus NVMe Gen4": {
    categoryBadge: "Storage — Value",
    specs: [
      { label: "Capacity", value: "2TB" },
      { label: "Interface", value: "PCIe Gen4 x4 NVMe" },
      { label: "Sequential Read", value: "5,000 MB/s" },
    ],
    pros: ["2TB at budget price", "Decent Gen4 speeds", "QLC acceptable for read-heavy use"],
    cons: ["QLC slower sustained writes", "No DRAM"],
    workloadReason: "Huge capacity for video editors who need space for RAW footage without breaking the bank.",
  },
  // PSUs
  "Corsair RM850x 850W 80+ Gold Modular": {
    categoryBadge: "PSU — Recommended",
    specs: [
      { label: "Wattage", value: "850W" },
      { label: "Efficiency", value: "80+ Gold (90%+)" },
      { label: "Modularity", value: "Full Modular" },
      { label: "Warranty", value: "10 Years" },
      { label: "Fan", value: "135mm Zero RPM Mode" },
    ],
    pros: ["Silent at low loads", "10-year warranty", "Fully modular cables"],
    cons: ["Not ATX 3.0", "Price vs competitors"],
    workloadReason: "850W Gold provides clean, efficient power with headroom for GPU upgrades — quiet zero-RPM mode at idle.",
  },
  "EVGA SuperNOVA 650 G7 650W 80+ Gold": {
    categoryBadge: "PSU — Budget-Mid",
    specs: [
      { label: "Wattage", value: "650W" },
      { label: "Efficiency", value: "80+ Gold" },
      { label: "Modularity", value: "Full Modular" },
      { label: "Warranty", value: "10 Years" },
    ],
    pros: ["Compact design", "Fully modular", "Great value"],
    cons: ["650W limiting for high-end GPUs", "FDB fan"],
    workloadReason: "Clean 650W Gold power for mid-range builds — compact enough for SFF cases.",
  },
  "Corsair CV550 550W 80+ Bronze": {
    categoryBadge: "PSU — Budget",
    specs: [
      { label: "Wattage", value: "550W" },
      { label: "Efficiency", value: "80+ Bronze" },
      { label: "Modularity", value: "Non-Modular" },
      { label: "Warranty", value: "3 Years" },
    ],
    pros: ["Very affordable", "Sufficient for budget builds", "Reliable Corsair quality"],
    cons: ["Non-modular cable mess", "Bronze efficiency", "3-year warranty"],
    workloadReason: "Gets the job done for low-power budget builds — 550W covers a Ryzen 5 + RTX 4060 Ti easily.",
  },
  "SeaSonic Focus GX-850 850W 80+ Gold": {
    categoryBadge: "PSU — High-End",
    specs: [
      { label: "Wattage", value: "850W" },
      { label: "Efficiency", value: "80+ Gold" },
      { label: "Modularity", value: "Full Modular" },
      { label: "Warranty", value: "10 Years" },
    ],
    pros: ["Excellent voltage regulation", "Fully modular", "Dead quiet"],
    cons: ["Price", "Slightly longer than some"],
    workloadReason: "Rock-solid power delivery for flagship GPUs and overclocked CPUs — SeaSonic's legendary reliability.",
  },
  // Coolers
  "Thermalright Peerless Assassin 120 SE": {
    categoryBadge: "Cooler — Best Value",
    specs: [
      { label: "Type", value: "Dual-Tower Air" },
      { label: "Fan Size", value: "2x 120mm" },
      { label: "TDP Rating", value: "260W+" },
      { label: "Noise", value: "< 25 dBA" },
    ],
    pros: ["Insane price-to-performance", "Handles any AM5 CPU", "Very quiet"],
    cons: ["Large physical size", "RAM clearance tight"],
    workloadReason: "Cools the 7800X3D with massive headroom — at this price, it's criminal not to buy one.",
  },
  "Noctua NH-D15 chromax.black": {
    categoryBadge: "Cooler — Premium Air",
    specs: [
      { label: "Type", value: "Dual-Tower Air" },
      { label: "Fan Size", value: "2x 140mm" },
      { label: "TDP Rating", value: "250W+" },
      { label: "Noise", value: "< 24 dBA" },
    ],
    pros: ["Gold standard for air cooling", "Near-silent", "6-year warranty"],
    cons: ["Expensive for air", "Very large"],
    workloadReason: "Legendary cooling performance and acoustics — will outlast any AIO and cool any consumer CPU.",
  },
  "AMD Wraith Stealth (Included)": {
    categoryBadge: "Cooler — Stock",
    specs: [
      { label: "Type", value: "Top-Down Air" },
      { label: "TDP Rating", value: "65W" },
    ],
    pros: ["Free with CPU", "Good enough for 65W chips", "No extra cost"],
    cons: ["Loud at full load", "Not for overclocking", "Adequate at best"],
    workloadReason: "The included cooler handles 65W chips — use the savings toward a better GPU or storage.",
  },
  "Thermalright Aqua Elite 240 V3": {
    categoryBadge: "Cooler — AIO Liquid",
    specs: [
      { label: "Type", value: "240mm AIO" },
      { label: "Radiator", value: "240mm Aluminum" },
      { label: "Fan Size", value: "2x 120mm ARGB" },
      { label: "Noise", value: "< 28 dBA" },
    ],
    pros: ["Great price for AIO", "Looks premium", "Sufficient for high-end CPUs"],
    cons: ["Pump failure risk over time", "240mm limits cooling vs 360mm"],
    workloadReason: "AIO aesthetics and solid thermals at an air cooler price — looks great in showcase builds.",
  },
  // Cases
  "Fractal Design Pop XL Air": {
    categoryBadge: "Case — Mid-Tower",
    specs: [
      { label: "Form Factor", value: "ATX Mid-Tower" },
      { label: "Airflow", value: "Mesh front panel, 4x fans" },
      { label: "GPU Clearance", value: "405mm" },
      { label: "CPU Cooler Height", value: "185mm" },
    ],
    pros: ["Excellent airflow", "Clean aesthetic", "Good build quality"],
    cons: ["Not the most compact", "No Type-C on cheaper SKUs"],
    workloadReason: "Great airflow for high-end components without looking like a spaceship — professional and cool.",
  },
  "NZXT H5 Flow": {
    categoryBadge: "Case — Clean Mid-Tower",
    specs: [
      { label: "Form Factor", value: "ATX Mid-Tower" },
      { label: "Airflow", value: "Perforated panels, 2x fans" },
      { label: "GPU Clearance", value: "365mm" },
    ],
    pros: ["Minimalist design", "Great airflow-to-size ratio", "Easy cable management"],
    cons: ["Only 2 included fans", "No RGB"],
    workloadReason: "Clean, no-nonsense airflow case — perfect for builds that prioritize function over flash.",
  },
  "NZXT H7 Flow": {
    categoryBadge: "Case — Premium Airflow",
    specs: [
      { label: "Form Factor", value: "ATX Mid-Tower" },
      { label: "Airflow", value: "Mesh everything, 3x fans" },
      { label: "GPU Clearance", value: "400mm" },
      { label: "CPU Cooler Height", value: "185mm" },
    ],
    pros: ["Top-tier airflow", "Looks premium", "Spacious interior"],
    cons: ["Pricey for a case", "Large footprint"],
    workloadReason: "Maximum airflow for flagship builds — keeps the RTX 4080/4090 cool under sustained loads.",
  },
  "Cooler Master NR600": {
    categoryBadge: "Case — Budget Airflow",
    specs: [
      { label: "Form Factor", value: "ATX Mid-Tower" },
      { label: "Airflow", value: "Mesh front, 2x fans" },
      { label: "GPU Clearance", value: "410mm" },
    ],
    pros: ["Budget-friendly airflow", "Spacious", "Clean design"],
    cons: ["Build quality average", "Cable management tricky"],
    workloadReason: "Budget airflow king — mesh front keeps temps in check without breaking the bank.",
  },
};

// ─── Fallback for parts not in the DB ─────────────────────────
function getDefaultDetail(_name: string, workload?: string): PartDetailData {
  return {
    categoryBadge: "Component",
    specs: [],
    pros: ["Well-reviewed by the community", "Good balance of price and performance"],
    cons: ["Check compatibility with your other parts"],
    workloadReason: workload
      ? `This component was selected to complement your ${workload} workload requirements.`
      : "Selected based on your specific build requirements and budget tier.",
  };
}

// ─── Workload label helper ─────────────────────────────────────
function getWorkloadLabel(primaryUse: PrimaryUse, deviceCategory: DeviceCategory): string {
  if (deviceCategory === "laptop") return "mobile productivity";
  if (deviceCategory === "phone") return "mobile use";
  switch (primaryUse) {
    case "gaming": return "gaming";
    case "video-editing": return "video editing";
    case "college-student": return "engineering coursework";
    case "office": return "office productivity";
    default: return "your workflow";
  }
}

// ─── Props ──────────────────────────────────────────────────────
interface ComponentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  part: ComponentPart;
  partKey: string;
  primaryUse: PrimaryUse;
  deviceCategory: DeviceCategory;
}

export default function ComponentDetailModal({
  isOpen,
  onClose,
  part,
  partKey: _partKey,
  primaryUse,
  deviceCategory,
}: ComponentDetailModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const lookupKey = part.spec.split("(")[0].trim();
  const detail = PART_DETAIL_DB[lookupKey] || PART_DETAIL_DB[part.name] || getDefaultDetail(lookupKey, getWorkloadLabel(primaryUse, deviceCategory));

  // ESC key dismiss
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Click outside dismiss
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  // Price tag from buyLinks
  const buyLinks = (() => {
    // Generate buy links for the part
    const encoded = encodeURIComponent(part.name.split("(")[0].trim());
    const links: { store: string; url: string; price: number }[] = [
      { store: "Amazon", url: `https://www.amazon.com/s?k=${encoded}`, price: part.estimatedPrice || 0 },
      { store: "Flipkart", url: `https://www.flipkart.com/search?q=${encoded}`, price: Math.round(part.estimatedPrice * 1.05) || 0 },
    ];
    return links;
  })();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={backdropRef}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ backgroundColor: "rgba(0,0,0,0)" }}
          animate={{ backgroundColor: "rgba(0,0,0,0.7)" }}
          exit={{ backgroundColor: "rgba(0,0,0,0)" }}
          transition={{ duration: 0.2 }}
          style={{ backdropFilter: "blur(8px)" }}
        >
          <motion.div
            className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-shadow-grey-light bg-shadow-grey shadow-2xl"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Header ── */}
            <div className="sticky top-0 z-10 flex items-center gap-3 px-5 py-4 bg-shadow-grey border-b border-shadow-grey-light/50 rounded-t-2xl">
              <ProductImage
                src={part.imageUrl}
                alt={lookupKey}
                category="cpu"
                className="flex-shrink-0 w-14 h-14 rounded-xl border border-shadow-grey-light/50"
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold text-slate-100 leading-tight truncate">{lookupKey}</h3>
                <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cinnabar-500/15 text-cinnabar-400 border border-cinnabar-500/20 uppercase tracking-wider">
                  {detail.categoryBadge}
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-shadow-grey flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 py-4 space-y-5">
              {/* ── Store Pricing & Links ── */}
              <div>
                <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-2">
                  <ShoppingCart className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
                  Store Pricing & Links
                </p>
                <div className="space-y-2">
                  {buyLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-shadow-grey-light/50 bg-shadow-grey/50 hover:border-cinnabar-500/30 hover:bg-shadow-grey transition-all group"
                    >
                      <span className="text-sm font-medium text-slate-300 group-hover:text-cinnabar-400 transition-colors">
                        {link.store}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-cinnabar-400">
                          ${link.price > 0 ? link.price.toLocaleString() : part.estimatedPrice.toLocaleString()}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cinnabar-400 transition-colors" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* ── Key Technical Specs ── */}
              {detail.specs.length > 0 && (
                <div>
                  <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-2">
                    Key Technical Specifications
                  </p>
                  <div className="rounded-lg border border-shadow-grey-light/50 overflow-hidden">
                    {detail.specs.map((spec, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between px-3 py-2.5 ${
                          i % 2 === 0 ? "bg-shadow-grey/30" : "bg-shadow-grey/10"
                        }`}
                      >
                        <span className="text-xs text-slate-500 font-medium">{spec.label}</span>
                        <span className="text-xs text-slate-200 font-semibold">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Community Verdict ── */}
              <div>
                <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-2">
                  Community Verdict & Sentiment
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="rounded-lg border border-emerald-500/15 bg-emerald-500/5 p-3">
                    <p className="text-[10px] text-emerald-400 uppercase font-semibold mb-1.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Highlights / Pros
                    </p>
                    <ul className="space-y-1">
                      {detail.pros.map((pro, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                          <span className="text-emerald-400 mt-0.5">+</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg border border-amber-500/15 bg-amber-500/5 p-3">
                    <p className="text-[10px] text-amber-400 uppercase font-semibold mb-1.5 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Watchouts / Cons
                    </p>
                    <ul className="space-y-1">
                      {detail.cons.map((con, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                          <span className="text-amber-400 mt-0.5">!</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* ── Why This Fits Your Workload ── */}
              <div className="rounded-lg bg-cinnabar-500/5 border border-cinnabar-500/15 p-4">
                <p className="text-[11px] text-cinnabar-400 uppercase tracking-wider font-semibold mb-1.5">
                  Why This Fits Your Workload
                </p>
                <p className="text-sm text-slate-300 leading-relaxed">{detail.workloadReason}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
