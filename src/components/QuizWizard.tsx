import { useState } from "react";
import {
  Gamepad2,
  Film,
  GraduationCap,
  Briefcase,
  Cpu,
  Monitor,
  Paintbrush,
  Zap,
  DollarSign,
  TrendingUp,
  Crown,
  Box,
  Minus,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import type {
  PrimaryUse,
  BranchOrSubtype,
  BudgetTier,
  FormFactor,
  UserPreferences,
} from "../types";

interface OptionCard {
  value: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

const STEP_LABELS = ["Primary Goal", "Workload Focus", "Budget", "Form Factor"];

const PRIMARY_USE_OPTIONS: OptionCard[] = [
  {
    value: "gaming",
    label: "Gaming",
    description: "Competitive esports, AAA titles, or ray-traced eye candy",
    icon: Gamepad2,
  },
  {
    value: "video-editing",
    label: "Video Editing / VFX",
    description: "DaVinci Resolve, Premiere Pro, After Effects, Blender",
    icon: Film,
  },
  {
    value: "college-student",
    label: "College / Engineering",
    description: "CS, AI/ML, CAD, or general engineering coursework",
    icon: GraduationCap,
  },
  {
    value: "office",
    label: "Office / Productivity",
    description: "Documents, spreadsheets, multi-monitor workflows",
    icon: Briefcase,
  },
];

const BRANCH_OPTIONS: Record<PrimaryUse, OptionCard[]> = {
  gaming: [
    {
      value: "1080p-esports",
      label: "1080p Competitive / High FPS",
      description: "Push 240Hz+ in Valorant, CS2, Fortnite",
      icon: Zap,
    },
    {
      value: "1440p-sweetspot",
      label: "1440p Sweet-Spot",
      description: "Best balance of fidelity and high refresh",
      icon: Monitor,
    },
    {
      value: "4k-ray-tracing",
      label: "4K Ultra / Ray Tracing",
      description: "Max settings, RT overdrive, cinematic immersion",
      icon: Sparkles,
    },
  ],
  "video-editing": [
    {
      value: "1080p-social-media",
      label: "1080p Social / YouTube",
      description: "Fast edits, shorts, reels \u2014 quick turnaround",
      icon: Film,
    },
    {
      value: "4k-timeline-color",
      label: "4K DaVinci / RAW Color / VFX",
      description: "Professional grading, heavy timelines, VFX comps",
      icon: Paintbrush,
    },
  ],
  "college-student": [
    {
      value: "cs-ai-ml",
      label: "CS & AI / ML",
      description: "CUDA training, LLM inference, software dev",
      icon: Cpu,
    },
    {
      value: "mechanical-civil-cad",
      label: "Mechanical / Civil (CAD / 3D)",
      description: "SolidWorks, AutoCAD, ANSYS, CATIA",
      icon: Box,
    },
    {
      value: "general-engineering",
      label: "General Engineering / Other",
      description: "MATLAB, light simulations, all-purpose student",
      icon: GraduationCap,
    },
  ],
  office: [
    {
      value: "basic-docs",
      label: "Standard Everyday / Multi-tab",
      description: "Docs, email, Slack, 20 Chrome tabs",
      icon: Briefcase,
    },
    {
      value: "heavy-multi-screen",
      label: "Multi-Monitor Data Crunching",
      description: "Bloomberg, Excel models, 4+ monitors",
      icon: Monitor,
    },
  ],
};

const BUDGET_OPTIONS: OptionCard[] = [
  {
    value: "budget",
    label: "Budget / Value",
    description: "Maximum performance per dollar \u2014 no frills",
    icon: DollarSign,
  },
  {
    value: "mid-tier",
    label: "Mid-Tier Workhorse",
    description: "Sweet spot of performance and reliability",
    icon: TrendingUp,
  },
  {
    value: "flagship",
    label: "Flagship / Enthusiast",
    description: "No compromises \u2014 the best of the best",
    icon: Crown,
  },
];

const FORM_FACTOR_OPTIONS: OptionCard[] = [
  {
    value: "standard-tower",
    label: "Standard Tower",
    description: "Classic ATX mid-tower \u2014 room to grow",
    icon: Box,
  },
  {
    value: "sff-mini",
    label: "Stealth Minimalist",
    description: "Compact SFF or mini-PC \u2014 desk-friendly",
    icon: Minus,
  },
  {
    value: "rgb-showcase",
    label: "White RGB Showcase",
    description: "Glass panel, RGB fans, show it off",
    icon: Sparkles,
  },
];

interface QuizWizardProps {
  onComplete: (prefs: UserPreferences) => void;
}

export default function QuizWizard({ onComplete }: QuizWizardProps) {
  const [step, setStep] = useState(1);
  const [primaryUse, setPrimaryUse] = useState<PrimaryUse | null>(null);
  const [branch, setBranch] = useState<BranchOrSubtype | null>(null);
  const [budget, setBudget] = useState<BudgetTier | null>(null);
  const [formFactor, setFormFactor] = useState<FormFactor | null>(null);

  const canNext = (() => {
    switch (step) {
      case 1: return primaryUse !== null;
      case 2: return branch !== null;
      case 3: return budget !== null;
      case 4: return formFactor !== null;
      default: return false;
    }
  })();

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else if (primaryUse && branch && budget && formFactor) {
      onComplete({
        primaryUse,
        branchOrSubtype: branch,
        budgetTier: budget,
        formFactor,
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      if (step === 2) setBranch(null);
      if (step === 3) setBudget(null);
      if (step === 4) setFormFactor(null);
      setStep(step - 1);
    }
  };

  const handleCardSelect = (value: string) => {
    switch (step) {
      case 1:
        setPrimaryUse(value as PrimaryUse);
        setBranch(null);
        break;
      case 2:
        setBranch(value as BranchOrSubtype);
        break;
      case 3:
        setBudget(value as BudgetTier);
        break;
      case 4:
        setFormFactor(value as FormFactor);
        break;
    }
  };

  const getOptions = (): OptionCard[] => {
    switch (step) {
      case 1: return PRIMARY_USE_OPTIONS;
      case 2: return primaryUse ? BRANCH_OPTIONS[primaryUse] : [];
      case 3: return BUDGET_OPTIONS;
      case 4: return FORM_FACTOR_OPTIONS;
      default: return [];
    }
  };

  const getSelectedValue = (): string | null => {
    switch (step) {
      case 1: return primaryUse;
      case 2: return branch;
      case 3: return budget;
      case 4: return formFactor;
      default: return null;
    }
  };

  const progress = (step / 4) * 100;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            <span className="text-cyan-400">Rig</span> Assigner
          </h1>
          <p className="text-slate-400 mt-2">
            Answer 4 quick questions {"\u2014"} we{"'"}ll match your perfect build.
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
            <span>
              Step <span className="text-cyan-400 font-semibold">{step}</span> of 4
            </span>
            <span className="font-medium text-slate-300">
              {STEP_LABELS[step - 1]}
            </span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-3">
            {[1, 2, 3, 4].map((s) => (
              <button
                key={s}
                onClick={() => { if (s < step) setStep(s); }}
                className={
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 " +
                  (s < step
                    ? "bg-cyan-500 text-white cursor-pointer hover:bg-cyan-400"
                    : s === step
                      ? "bg-cyan-500/20 border-2 border-cyan-400 text-cyan-400"
                      : "bg-slate-800 text-slate-500 border border-slate-700")
                }
              >
                {s < step ? "\u2713" : s}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 mb-8">
          {getOptions().map((opt) => {
            const Icon = opt.icon;
            const isSelected = getSelectedValue() === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleCardSelect(opt.value)}
                className={
                  "group relative text-left rounded-xl p-5 border-2 transition-all duration-300 " +
                  (isSelected
                    ? "border-cyan-400 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.15)]"
                    : "border-slate-700 bg-slate-900/50 hover:border-slate-500 hover:bg-slate-800/50")
                }
              >
                <div className="flex items-start gap-4">
                  <div
                    className={
                      "flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300 " +
                      (isSelected
                        ? "bg-cyan-500/20 text-cyan-400"
                        : "bg-slate-800 text-slate-400 group-hover:text-slate-300")
                    }
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3
                      className={
                        "font-semibold text-base transition-colors duration-300 " +
                        (isSelected ? "text-cyan-300" : "text-slate-200")
                      }
                    >
                      {opt.label}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                      {opt.description}
                    </p>
                  </div>
                </div>
                {isSelected && (
                  <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className={
              "flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 " +
              (step === 1
                ? "invisible"
                : "text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500")
            }
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!canNext}
            className={
              "flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 " +
              (canNext
                ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)]"
                : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700")
            }
          >
            {step === 4 ? (
              <>
                View Match
                <Trophy className="w-4 h-4" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
