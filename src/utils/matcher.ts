import type { UserPreferences, BuildPreset, PrimaryUse, BranchOrSubtype, BudgetTier } from "../types";

/**
 * Mapping from quiz selections to preset IDs.
 * Each entry represents an exact match for a (primaryUse + branch) combination.
 */
const EXACT_MATCH_MAP: Record<string, string> = {
  // Gaming
  "gaming+1080p-esports": "gaming-1080p-budget",
  "gaming+1440p-sweetspot": "gaming-1440p-mid",
  "gaming+4k-ray-tracing": "gaming-4k-flagship",
  // Video Editing
  "video-editing+1080p-social-media": "video-1080p-budget",
  "video-editing+4k-timeline-color": "video-4k-flagship",
  // College
  "college-student+cs-ai-ml": "cs-ai-ml-mid",
  "college-student+mechanical-civil-cad": "cad-engineering-mid",
  "college-student+general-engineering": "college-general-budget",
  // Office
  "office+basic-docs": "office-basic-budget",
  "office+heavy-multi-screen": "office-heavy-mid",
};

/**
 * Budget tier ordering for distance calculation.
 */
const BUDGET_ORDER: BudgetTier[] = ["budget", "mid-tier", "flagship"];

/**
 * Budget tier distance: how many steps away from each other.
 */
function budgetDistance(a: BudgetTier, b: BudgetTier): number {
  return Math.abs(BUDGET_ORDER.indexOf(a) - BUDGET_ORDER.indexOf(b));
}

/**
 * Primary use groupings for fallback matching.
 * Maps each branch to its parent primary use.
 */
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

/**
 * Scoring function for a preset against user preferences.
 * Lower score = better match.
 *
 * Score breakdown:
 *   - Primary use mismatch: +100
 *   - Branch mismatch:      +50
 *   - Budget distance:      +10 per tier step
 *   - Exact match bonus:    -50
 */
function scorePreset(
  preset: BuildPreset,
  prefs: UserPreferences
): number {
  let score = 0;

  const expectedUse = BRANCH_TO_USE[prefs.branchOrSubtype];

  // Check if preset belongs to the expected primary use
  const presetUse = getUseFromPresetId(preset.id);
  if (presetUse !== expectedUse) {
    score += 100;
  }

  // Check branch/subtype match
  const branchKey = `${prefs.primaryUse}+${prefs.branchOrSubtype}`;
  if (EXACT_MATCH_MAP[branchKey] !== preset.id) {
    score += 50;
  }

  // Budget distance
  score += budgetDistance(preset.budgetCategory, prefs.budgetTier) * 10;

  // Bonus for exact primary use match
  const exactKey = `${prefs.primaryUse}+${prefs.branchOrSubtype}`;
  if (EXACT_MATCH_MAP[exactKey] === preset.id) {
    score -= 50;
  }

  return score;
}

/**
 * Extract the primary use category from a preset ID.
 */
function getUseFromPresetId(id: string): PrimaryUse {
  if (id.startsWith("gaming")) return "gaming";
  if (id.startsWith("video")) return "video-editing";
  if (id.startsWith("college")) return "college-student";
  if (id.startsWith("office")) return "office";
  // CS/AI and CAD are under college-student
  if (id.startsWith("cs-") || id.startsWith("cad")) return "college-student";
  return "office";
}

/**
 * Find the best matching build preset for the given user preferences.
 *
 * Priority:
 *   1. Exact match (primary use + branch + budget)
 *   2. Closest budget tier within same primary use
 *   3. Any preset from the same primary use group
 *   4. Absolute fallback: cheapest preset overall
 */
export function findBestPreset(
  preferences: UserPreferences,
  availablePresets: BuildPreset[]
): BuildPreset {
  if (availablePresets.length === 0) {
    throw new Error("No presets available to match against");
  }

  // Step 1: Try exact match
  const exactKey = `${preferences.primaryUse}+${preferences.branchOrSubtype}`;
  const exactPresetId = EXACT_MATCH_MAP[exactKey];

  if (exactPresetId) {
    const exactMatch = availablePresets.find((p) => p.id === exactPresetId);
    if (exactMatch) {
      return exactMatch;
    }
  }

  // Step 2: Score all presets and pick the best
  const scored = availablePresets.map((preset) => ({
    preset,
    score: scorePreset(preset, preferences),
  }));

  scored.sort((a, b) => a.score - b.score);

  return scored[0].preset;
}
