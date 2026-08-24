import { useState, useEffect } from "react";
import { Cpu } from "lucide-react";

const STATUS_MESSAGES = [
  "Analyzing workload compute requirements...",
  "Optimizing VRAM and multi-core IPC...",
  "Verifying PSU headroom & thermal balance...",
  "Finalizing your optimal configuration...",
];

const TOTAL_DURATION_MS = 1500;
const STAGE_INTERVAL_MS = TOTAL_DURATION_MS / STATUS_MESSAGES.length;

interface AnalyzingLoaderProps {
  onComplete: () => void;
}

export default function AnalyzingLoader({ onComplete }: AnalyzingLoaderProps) {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);

  // Cycle through status messages
  useEffect(() => {
    const interval = setInterval(() => {
      setStage((prev) => {
        if (prev >= STATUS_MESSAGES.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, STAGE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  // Animate progress bar
  useEffect(() => {
    const startTime = Date.now();
    const raf = () => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / TOTAL_DURATION_MS) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        requestAnimationFrame(raf);
      }
    };
    requestAnimationFrame(raf);
  }, []);

  // Trigger onComplete after duration
  useEffect(() => {
    const timer = setTimeout(onComplete, TOTAL_DURATION_MS);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {/* Pulsing chip icon */}
        <div className="relative mx-auto mb-8 w-24 h-24 flex items-center justify-center">
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full bg-cyan-500/10 animate-ping" />
          <div className="absolute inset-2 rounded-full bg-cyan-500/5" />
          {/* Icon */}
          <div className="relative z-10 w-16 h-16 rounded-xl bg-slate-800 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.2)]">
            <Cpu className="w-8 h-8 text-cyan-400 animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-slate-100 mb-2">
          Analyzing Your Build
        </h2>

        {/* Progress bar */}
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status text with fade transition */}
        <div className="h-6">
          <p
            key={stage}
            className="text-sm text-slate-400 animate-[fadeIn_0.3s_ease-out]"
          >
            {STATUS_MESSAGES[stage]}
          </p>
        </div>

        {/* Inline keyframes */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(4px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </div>
  );
}
