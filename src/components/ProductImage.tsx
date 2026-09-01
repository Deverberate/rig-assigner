import { useState } from "react";
import {
  Cpu,
  CircuitBoard,
  MemoryStick,
  HardDrive,
  LayoutGrid,
  Plug,
  Fan,
  Box,
  Monitor,
  Laptop,
  Smartphone,
  Headphones,
  Gamepad2,
  type LucideIcon,
} from "lucide-react";
import type { PartCategory } from "../types";

/** Map categories to Lucide icons and accent colors */
const CATEGORY_FALLBACK: Record<string, { icon: LucideIcon; color: string; bg: string }> = {
  cpu: { icon: Cpu, color: "text-blue-400", bg: "bg-blue-500/10" },
  gpu: { icon: CircuitBoard, color: "text-green-400", bg: "bg-green-500/10" },
  ram: { icon: MemoryStick, color: "text-purple-400", bg: "bg-purple-500/10" },
  storage: { icon: HardDrive, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  motherboard: { icon: LayoutGrid, color: "text-cinnabar-400", bg: "bg-cinnabar-500/10" },
  psu: { icon: Plug, color: "text-slate-400", bg: "bg-slate-500/10" },
  cooler: { icon: Fan, color: "text-teal-400", bg: "bg-teal-500/10" },
  case: { icon: Box, color: "text-indigo-400", bg: "bg-indigo-500/10" },
  laptop: { icon: Laptop, color: "text-violet-400", bg: "bg-violet-500/10" },
  phone: { icon: Smartphone, color: "text-pink-400", bg: "bg-pink-500/10" },
  monitor: { icon: Monitor, color: "text-cinnabar-400", bg: "bg-cinnabar-500/10" },
  keyboard: { icon: LayoutGrid, color: "text-slate-400", bg: "bg-slate-500/10" },
  mouse: { icon: Cpu, color: "text-slate-400", bg: "bg-slate-500/10" },
  audio: { icon: Headphones, color: "text-amber-400", bg: "bg-amber-500/10" },
  controller: { icon: Gamepad2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
};

interface ProductImageProps {
  src?: string;
  alt: string;
  category?: PartCategory | string;
  className?: string;
}

export default function ProductImage({ src, alt, category = "cpu", className = "" }: ProductImageProps) {
  const [imgError, setImgError] = useState(false);
  const showFallback = !src || imgError;

  if (showFallback) {
    const fb = CATEGORY_FALLBACK[category] || CATEGORY_FALLBACK.cpu;
    const Icon = fb.icon;
    return (
      <div className={`flex items-center justify-center rounded-lg ${fb.bg} ${className}`}>
        <Icon className={`w-1/2 h-1/2 ${fb.color}`} strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`object-cover rounded-lg ${className}`}
      onError={() => setImgError(true)}
      loading="lazy"
    />
  );
}
