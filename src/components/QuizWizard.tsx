import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  Smartphone,
  Laptop,
  Camera,
  Rocket,
  User,
  type LucideIcon,
} from "lucide-react";
import type {
  DeviceCategory,
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

// ─── Device Category Options ───────────────────────────────────
const DEVICE_OPTIONS: OptionCard[] = [
  {
    value: "pc",
    label: "Custom PC",
    description: "Build your own desktop — maximum power and upgradeability",
    icon: Cpu,
  },
  {
    value: "laptop",
    label: "Laptop",
    description: "Portable performance — work and play from anywhere",
    icon: Laptop,
  },
  {
    value: "phone",
    label: "Smartphone",
    description: "The device in your pocket — camera, gaming, productivity",
    icon: Smartphone,
  },
];

// ─── PC Options ────────────────────────────────────────────────
const PC_PRIMARY_USE: OptionCard[] = [
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

const PC_BRANCH_OPTIONS: Record<PrimaryUse, OptionCard[]> = {
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
      description: "Fast edits, shorts, reels — quick turnaround",
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

// ─── Laptop Options ────────────────────────────────────────────
const LAPTOP_USE_OPTIONS: OptionCard[] = [
  {
    value: "college-student",
    label: "Student / General",
    description: "Notes, research, light media, and everyday productivity",
    icon: GraduationCap,
  },
  {
    value: "gaming",
    label: "Gaming",
    description: "AAA titles, esports, and portable gaming sessions",
    icon: Gamepad2,
  },
  {
    value: "video-editing",
    label: "Creative / Video Editing",
    description: "Premiere, DaVinci Resolve, Blender on the go",
    icon: Film,
  },
  {
    value: "office",
    label: "Business / Office",
    description: "Presentations, video calls, corporate workflows",
    icon: Briefcase,
  },
];

// ─── Phone Options ─────────────────────────────────────────────
const PHONE_USE_OPTIONS: OptionCard[] = [
  {
    value: "video-editing",
    label: "Photography / Content Creation",
    description: "Pro cameras, 4K video, and editing on-device",
    icon: Camera,
  },
  {
    value: "gaming",
    label: "Gaming / Performance",
    description: "Top benchmarks, high-refresh displays, fast chips",
    icon: Gamepad2,
  },
  {
    value: "office",
    label: "General / Everyday",
    description: "Social media, messaging, browsing, productivity",
    icon: User,
  },
  {
    value: "college-student",
    label: "Student / Value",
    description: "Best bang for buck — flagship features at a lower price",
    icon: Rocket,
  },
];

// ─── Shared Options ────────────────────────────────────────────
const BUDGET_OPTIONS: OptionCard[] = [
  {
    value: "budget",
    label: "Budget / Value",
    description: "Maximum performance per dollar — no frills",
    icon: DollarSign,
  },
  {
    value: "mid-tier",
    label: "Mid-Tier Sweet Spot",
    description: "Best balance of features and price",
    icon: TrendingUp,
  },
  {
    value: "flagship",
    label: "Flagship / No Compromises",
    description: "The best of the best — price is no object",
    icon: Crown,
  },
];

const PC_FORM_FACTOR: OptionCard[] = [
  {
    value: "standard-tower",
    label: "Standard Tower",
    description: "Classic ATX mid-tower — room to grow",
    icon: Box,
  },
  {
    value: "sff-mini",
    label: "Stealth Minimalist",
    description: "Compact SFF or mini-PC — desk-friendly",
    icon: Minus,
  },
  {
    value: "rgb-showcase",
    label: "White RGB Showcase",
    description: "Glass panel, RGB fans, show it off",
    icon: Sparkles,
  },
];

const LAPTOP_FORM_FACTOR: OptionCard[] = [
  {
    value: "standard-tower",
    label: "Ultrabook / Thin & Light",
    description: "Under 1.5 kg — portable and stylish",
    icon: Minus,
  },
  {
    value: "sff-mini",
    label: "Performance Laptop",
    description: '15-16" — powerful with decent portability',
    icon: Box,
  },
  {
    value: "rgb-showcase",
    label: "Desktop Replacement",
    description: '17"+ — maximum screen and cooling, less portable',
    icon: Sparkles,
  },
];

const PHONE_FORM_FACTOR: OptionCard[] = [
  {
    value: "standard-tower",
    label: 'Compact (6.1"–6.3")',
    description: "One-hand friendly, pocketable, lighter",
    icon: Minus,
  },
  {
    value: "sff-mini",
    label: 'Standard (6.5"–6.7")',
    description: "The sweet spot — big enough for media, small enough for pockets",
    icon: Box,
  },
  {
    value: "rgb-showcase",
    label: 'Max / Ultra (6.8"+)',
    description: "Largest display — best for media, gaming, and productivity",
    icon: Sparkles,
  },
];

// ─── Step Labels by Device ─────────────────────────────────────
function getStepLabels(device: DeviceCategory): string[] {
  switch (device) {
    case "pc":
      return ["Primary Goal", "Workload Focus", "Budget", "Form Factor"];
    case "laptop":
      return ["Use Case", "Budget", "Size Preference"];
    case "phone":
      return ["Use Case", "Budget", "Size Preference"];
  }
}

// ─── Framer Motion Variants ────────────────────────────────────
const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

interface QuizWizardProps {
  onComplete: (prefs: UserPreferences) => void;
}

export default function QuizWizard({ onComplete }: QuizWizardProps) {
  const [deviceCategory, setDeviceCategory] = useState<DeviceCategory | null>(null);
  const [step, setStep] = useState(0);
  const [primaryUse, setPrimaryUse] = useState<PrimaryUse | null>(null);
  const [branch, setBranch] = useState<BranchOrSubtype | null>(null);
  const [budget, setBudget] = useState<BudgetTier | null>(null);
  const [formFactor, setFormFactor] = useState<FormFactor | null>(null);
  const [direction, setDirection] = useState(1);
  const prevStepRef = useRef(0);

  const isPC = deviceCategory === "pc";
  const totalSteps = isPC ? 4 : 3;
  const stepLabels = deviceCategory ? getStepLabels(deviceCategory) : [];

  const canNext = (() => {
    if (step === 0) return deviceCategory !== null;
    if (!deviceCategory) return false;
    if (isPC) {
      switch (step) {
        case 1: return primaryUse !== null;
        case 2: return branch !== null;
        case 3: return budget !== null;
        case 4: return formFactor !== null;
        default: return false;
      }
    } else {
      switch (step) {
        case 1: return primaryUse !== null;
        case 2: return budget !== null;
        case 3: return formFactor !== null;
        default: return false;
      }
    }
  })();

  const goToStep = (newStep: number) => {
    setDirection(newStep > prevStepRef.current ? 1 : -1);
    prevStepRef.current = newStep;
    setStep(newStep);
  };

  const handleNext = () => {
    if (step === 0) {
      setDirection(1);
      prevStepRef.current = 0;
      setStep(1);
      return;
    }
    const maxStep = isPC ? 4 : 3;
    if (step < maxStep) {
      goToStep(step + 1);
    } else if (primaryUse && budget && formFactor) {
      onComplete({
        deviceCategory: deviceCategory!,
        primaryUse,
        branchOrSubtype: branch || (primaryUse as BranchOrSubtype),
        budgetTier: budget,
        formFactor,
      });
    }
  };

  const handleBack = () => {
    if (step === 0) return;
    if (step === 1) {
      setPrimaryUse(null);
      setBranch(null);
      setDeviceCategory(null);
      goToStep(0);
      return;
    }
    if (step === 2) {
      if (isPC) setBranch(null);
      else setBudget(null);
    }
    if (step === 3) {
      if (isPC) setBudget(null);
      else setFormFactor(null);
    }
    if (step === 4) setFormFactor(null);
    goToStep(step - 1);
  };

  const handleCardSelect = (value: string) => {
    if (step === 0) {
      setDeviceCategory(value as DeviceCategory);
      setPrimaryUse(null);
      setBranch(null);
      setBudget(null);
      setFormFactor(null);
      return;
    }
    if (isPC) {
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
    } else {
      switch (step) {
        case 1:
          setPrimaryUse(value as PrimaryUse);
          setBranch(null);
          break;
        case 2:
          setBudget(value as BudgetTier);
          break;
        case 3:
          setFormFactor(value as FormFactor);
          break;
      }
    }
  };

  const getOptions = (): OptionCard[] => {
    if (step === 0) return DEVICE_OPTIONS;
    if (isPC) {
      switch (step) {
        case 1: return PC_PRIMARY_USE;
        case 2: return primaryUse ? PC_BRANCH_OPTIONS[primaryUse] : [];
        case 3: return BUDGET_OPTIONS;
        case 4: return PC_FORM_FACTOR;
        default: return [];
      }
    } else if (deviceCategory === "laptop") {
      switch (step) {
        case 1: return LAPTOP_USE_OPTIONS;
        case 2: return BUDGET_OPTIONS;
        case 3: return LAPTOP_FORM_FACTOR;
        default: return [];
      }
    } else {
      switch (step) {
        case 1: return PHONE_USE_OPTIONS;
        case 2: return BUDGET_OPTIONS;
        case 3: return PHONE_FORM_FACTOR;
        default: return [];
      }
    }
  };

  const getSelectedValue = (): string | null => {
    if (step === 0) return deviceCategory;
    if (isPC) {
      switch (step) {
        case 1: return primaryUse;
        case 2: return branch;
        case 3: return budget;
        case 4: return formFactor;
        default: return null;
      }
    } else {
      switch (step) {
        case 1: return primaryUse;
        case 2: return budget;
        case 3: return formFactor;
        default: return null;
      }
    }
  };

  const progress = step === 0 ? 0 : (step / totalSteps) * 100;
  const stepDisplay = step === 0 ? "Choose Device" : `Step ${step} of ${totalSteps}`;
  const stepLabel = step === 0 ? "Device Category" : stepLabels[step - 1];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            <span className="text-cyan-400">Rig</span> Assigner
          </h1>
          <p className="text-slate-400 mt-2">
            {step === 0
              ? "Pick your device type — we'll find the perfect match."
              : `Answer ${totalSteps} quick questions — we'll match your perfect ${deviceCategory === "pc" ? "build" : deviceCategory}.`}
          </p>
        </div>

        {/* Progress Bar */}
        {step > 0 && deviceCategory && (
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
              <span>
                <span className="text-cyan-400 font-semibold">{stepDisplay}</span>
              </span>
              <span className="font-medium text-slate-300">{stepLabel}</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                initial={false}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between mt-3">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    if (s < step) goToStep(s);
                  }}
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
        )}

        {/* Animated Option Cards */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`step-${step}-${deviceCategory}`}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className={`grid gap-4 ${step === 0 ? "sm:grid-cols-3" : "sm:grid-cols-2"} mb-8`}
          >
            {getOptions().map((opt) => {
              const Icon = opt.icon;
              const isSelected = getSelectedValue() === opt.value;
              return (
                <motion.button
                  key={opt.value}
                  onClick={() => handleCardSelect(opt.value)}
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ scale: 1.01 }}
                  className={
                    "group relative text-left rounded-xl p-5 border-2 transition-colors duration-300 " +
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
                </motion.button>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className={
              "flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 " +
              (step === 0
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
            {step === 0 ? (
              <>
                Start Quiz
                <ChevronRight className="w-4 h-4" />
              </>
            ) : step === (isPC ? 4 : 3) ? (
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
