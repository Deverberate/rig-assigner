import type {
  UserPreferences,
  BuildPreset,
  LaptopPreset,
  PhonePreset,
  PrimaryUse,
  BranchOrSubtype,
  BudgetTier,
} from "../types";
import { presets } from "../data/presets";

// ─── PC Matching (existing logic) ──────────────────────────────

const EXACT_MATCH_MAP: Record<string, string> = {
  "gaming+1080p-esports": "gaming-1080p-budget",
  "gaming+1440p-sweetspot": "gaming-1440p-mid",
  "gaming+4k-ray-tracing": "gaming-4k-flagship",
  "video-editing+1080p-social-media": "video-1080p-budget",
  "video-editing+4k-timeline-color": "video-4k-flagship",
  "college-student+cs-ai-ml": "cs-ai-ml-mid",
  "college-student+mechanical-civil-cad": "cad-engineering-mid",
  "college-student+general-engineering": "college-general-budget",
  "office+basic-docs": "office-basic-budget",
  "office+heavy-multi-screen": "office-heavy-mid",
};

const BUDGET_ORDER: BudgetTier[] = ["budget", "mid-tier", "flagship"];

function budgetDistance(a: BudgetTier, b: BudgetTier): number {
  return Math.abs(BUDGET_ORDER.indexOf(a) - BUDGET_ORDER.indexOf(b));
}

const BRANCH_TO_USE: Record<BranchOrSubtype, PrimaryUse> = {
  "1080p-esports": "gaming",
  "1440p-sweetspot": "gaming",
  "4k-ray-tracing": "gaming",
  "1080p-social-media": "video-editing",
  "4k-timeline-color": "video-editing",
  "heavy-vfx-3d-blender": "video-editing",
  "cs-ai-ml": "college-student",
  "mechanical-civil-cad": "college-student",
  "general-engineering": "college-student",
  "non-tech-arts": "college-student",
  "basic-docs": "office",
  "heavy-multi-screen": "office",
};

function getUseFromPresetId(id: string): PrimaryUse {
  if (id.startsWith("gaming")) return "gaming";
  if (id.startsWith("video")) return "video-editing";
  if (id.startsWith("college")) return "college-student";
  if (id.startsWith("office")) return "office";
  if (id.startsWith("cs-") || id.startsWith("cad")) return "college-student";
  return "office";
}

function scorePreset(preset: BuildPreset, prefs: UserPreferences): number {
  let score = 0;
  const expectedUse = BRANCH_TO_USE[prefs.branchOrSubtype];
  const presetUse = getUseFromPresetId(preset.id);
  if (presetUse !== expectedUse) score += 100;
  const branchKey = `${prefs.primaryUse}+${prefs.branchOrSubtype}`;
  if (EXACT_MATCH_MAP[branchKey] !== preset.id) score += 50;
  score += budgetDistance(preset.budgetCategory, prefs.budgetTier) * 10;
  const exactKey = `${prefs.primaryUse}+${prefs.branchOrSubtype}`;
  if (EXACT_MATCH_MAP[exactKey] === preset.id) score -= 50;
  return score;
}

// ─── Laptop Matching ───────────────────────────────────────────

function scoreLaptop(preset: LaptopPreset, prefs: UserPreferences): number {
  let score = 0;
  // Budget distance is the primary ranking factor for laptops/phones
  score += budgetDistance(preset.budgetCategory, prefs.budgetTier) * 100;
  return score;
}

// ─── Phone Matching ────────────────────────────────────────────

function scorePhone(preset: PhonePreset, prefs: UserPreferences): number {
  let score = 0;
  score += budgetDistance(preset.budgetCategory, prefs.budgetTier) * 100;
  return score;
}

// ─── Public API ────────────────────────────────────────────────

export function findBestPreset(
  preferences: UserPreferences,
  availablePresets: BuildPreset[]
): BuildPreset {
  if (availablePresets.length === 0) {
    throw new Error("No PC presets available to match against");
  }
  // Step 1: Try exact match
  const exactKey = `${preferences.primaryUse}+${preferences.branchOrSubtype}`;
  const exactPresetId = EXACT_MATCH_MAP[exactKey];
  if (exactPresetId) {
    const exactMatch = availablePresets.find((p) => p.id === exactPresetId);
    if (exactMatch) return exactMatch;
  }
  // Step 2: Score all presets and pick the best
  const scored = availablePresets.map((preset) => ({
    preset,
    score: scorePreset(preset, preferences),
  }));
  scored.sort((a, b) => a.score - b.score);
  return scored[0].preset;
}

export function findBestLaptop(
  preferences: UserPreferences,
  availablePresets: LaptopPreset[]
): LaptopPreset {
  if (availablePresets.length === 0) {
    throw new Error("No laptop presets available to match against");
  }
  const scored = availablePresets.map((preset) => ({
    preset,
    score: scoreLaptop(preset, preferences),
  }));
  scored.sort((a, b) => a.score - b.score);
  return scored[0].preset;
}

export function findBestPhone(
  preferences: UserPreferences,
  availablePresets: PhonePreset[]
): PhonePreset {
  if (availablePresets.length === 0) {
    throw new Error("No phone presets available to match against");
  }
  const scored = availablePresets.map((preset) => ({
    preset,
    score: scorePhone(preset, preferences),
  }));
  scored.sort((a, b) => a.score - b.score);
  return scored[0].preset;
}

/**
 * Unified matcher — dispatches to the correct device-specific function.
 */
export function findBestMatch(
  preferences: UserPreferences,
  allPresets: { pc: BuildPreset[]; laptop: LaptopPreset[]; phone: PhonePreset[] }
): BuildPreset | LaptopPreset | PhonePreset {
  switch (preferences.deviceCategory) {
    case "laptop":
      return findBestLaptop(preferences, allPresets.laptop);
    case "phone":
      return findBestPhone(preferences, allPresets.phone);
    case "pc":
    default:
      return findBestPreset(preferences, allPresets.pc);
  }
}

/**
 * Get adjacent presets for PC builds within the same primary use category.
 */
const CATEGORY_PRESETS: Record<PrimaryUse, string[]> = {
  gaming: ["gaming-1080p-budget", "gaming-1440p-mid", "gaming-4k-flagship"],
  "video-editing": ["video-1080p-budget", "video-4k-flagship"],
  "college-student": ["college-general-budget", "cs-ai-ml-mid", "cad-engineering-mid"],
  office: ["office-basic-budget", "office-heavy-mid"],
};

export function findAdjacentPresets(
  currentPreset: BuildPreset,
  category: PrimaryUse
): { lower: BuildPreset | null; upper: BuildPreset | null } {
  const list = CATEGORY_PRESETS[category];
  if (!list) return { lower: null, upper: null };
  const idx = list.indexOf(currentPreset.id);
  const lowerId = idx > 0 ? list[idx - 1] : null;
  const upperId = idx < list.length - 1 ? list[idx + 1] : null;
  const lower = lowerId ? presets.find((p) => p.id === lowerId) ?? null : null;
  const upper = upperId ? presets.find((p) => p.id === upperId) ?? null : null;
  return { lower, upper };
}

/**
 * Get adjacent presets within the same device category for the budget tweaker.
 */
export function findAdjacentLaptops(
  currentPreset: LaptopPreset,
  allPresets: LaptopPreset[]
): { lower: LaptopPreset | null; upper: LaptopPreset | null } {
  const sorted = [...allPresets].sort(
    (a, b) => BUDGET_ORDER.indexOf(a.budgetCategory) - BUDGET_ORDER.indexOf(b.budgetCategory)
  );
  const idx = sorted.findIndex((p) => p.id === currentPreset.id);
  return {
    lower: idx > 0 ? sorted[idx - 1] : null,
    upper: idx < sorted.length - 1 ? sorted[idx + 1] : null,
  };
}

export function findAdjacentPhones(
  currentPreset: PhonePreset,
  allPresets: PhonePreset[]
): { lower: PhonePreset | null; upper: PhonePreset | null } {
  const sorted = [...allPresets].sort(
    (a, b) => BUDGET_ORDER.indexOf(a.budgetCategory) - BUDGET_ORDER.indexOf(b.budgetCategory)
  );
  const idx = sorted.findIndex((p) => p.id === currentPreset.id);
  return {
    lower: idx > 0 ? sorted[idx - 1] : null,
    upper: idx < sorted.length - 1 ? sorted[idx + 1] : null,
  };
}
