import { useState, useCallback, useEffect } from "react";
import type {
  UserPreferences,
  BuildPreset,
  LaptopPreset,
  PhonePreset,
  DeviceCategory,
  PartCategory,
} from "./types";
import QuizWizard from "./components/QuizWizard";
import AnalyzingLoader from "./components/AnalyzingLoader";
import ResultsDashboard from "./components/ResultsDashboard";
import CustomPCBuilder from "./components/CustomPCBuilder";
import { findBestMatch } from "./utils/matcher";
import { presets } from "./data/presets";
import { laptopPresets } from "./data/laptopPresets";
import { phonePresets } from "./data/phonePresets";
import { partsCatalog } from "./data/partsCatalog";

type AppPhase = "quiz" | "analyzing" | "results" | "builder";

const PART_CATEGORY_ORDER: PartCategory[] = [
  "cpu", "gpu", "ram", "storage", "motherboard", "psu", "cooler", "case",
];

/**
 * Parse URL query params for direct linking:
 *   ?type=laptop&id=zephyrus-g14
 *   ?mode=builder&parts=cpu_7800x3d,gpu_4070s,...
 */
function parseUrlParams(): {
  type: DeviceCategory | null;
  id: string | null;
  mode: string | null;
  builderParts: Record<PartCategory, string | null>;
} {
  const params = new URLSearchParams(window.location.search);
  const type = params.get("type") as DeviceCategory | null;
  const id = params.get("id");
  const mode = params.get("mode");
  const partsParam = params.get("parts");

  const builderParts: Record<PartCategory, string | null> = {
    cpu: null, gpu: null, ram: null, storage: null,
    motherboard: null, psu: null, cooler: null, case: null,
  };

  if (partsParam) {
    for (const entry of partsParam.split(",")) {
      const sep = entry.indexOf("_");
      if (sep > 0) {
        const cat = entry.substring(0, sep) as PartCategory;
        const partId = entry.substring(sep + 1);
        if (PART_CATEGORY_ORDER.includes(cat)) {
          // Find the full part ID in the catalog
          const match = partsCatalog.find((p) => p.id.endsWith(partId));
          if (match) builderParts[cat] = match.id;
        }
      }
    }
  }

  return { type, id, mode, builderParts };
}

/**
 * Find a preset by ID across all device types.
 */
function findPresetById(
  type: DeviceCategory,
  id: string
): BuildPreset | LaptopPreset | PhonePreset | null {
  switch (type) {
    case "pc":
      return presets.find((p) => p.id === id) ?? null;
    case "laptop":
      return laptopPresets.find((p) => p.id === id) ?? null;
    case "phone":
      return phonePresets.find((p) => p.id === id) ?? null;
    default:
      return null;
  }
}

export default function App() {
  const [phase, setPhase] = useState<AppPhase>("quiz");
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [matchedPreset, setMatchedPreset] = useState<BuildPreset | LaptopPreset | PhonePreset | null>(null);
  const [initialBuilderParts, setInitialBuilderParts] = useState<Record<PartCategory, string | null> | null>(null);

  // Check for URL deep link on mount
  useEffect(() => {
    const urlParams = parseUrlParams();

    // Builder mode deep link
    if (urlParams.mode === "builder") {
      setPhase("builder");
      if (Object.values(urlParams.builderParts).some(Boolean)) {
        setInitialBuilderParts(urlParams.builderParts);
      }
      return;
    }

    // Preset deep link
    if (urlParams.type && urlParams.id) {
      const preset = findPresetById(urlParams.type, urlParams.id);
      if (preset) {
        const dummyPrefs: UserPreferences = {
          deviceCategory: urlParams.type,
          primaryUse: "gaming",
          branchOrSubtype: "1080p-esports",
          budgetTier: "mid-tier",
          formFactor: "standard-tower",
        };
        setPrefs(dummyPrefs);
        setMatchedPreset(preset);
        setPhase("results");
      }
    }
  }, []);

  const handleQuizComplete = useCallback((userPrefs: UserPreferences) => {
    setPrefs(userPrefs);
    setPhase("analyzing");
  }, []);

  const handleAnalyzingComplete = useCallback(() => {
    if (prefs) {
      const result = findBestMatch(prefs, {
        pc: presets,
        laptop: laptopPresets,
        phone: phonePresets,
      });
      setMatchedPreset(result);
      setPhase("results");

      const url = new URL(window.location.href);
      url.searchParams.set("type", prefs.deviceCategory);
      url.searchParams.set("id", result.id);
      window.history.replaceState({}, "", url.toString());
    }
  }, [prefs]);

  const handleStartBuilder = useCallback(() => {
    setPhase("builder");
    const url = new URL(window.location.href);
    url.searchParams.set("mode", "builder");
    url.searchParams.delete("type");
    url.searchParams.delete("id");
    window.history.replaceState({}, "", url.toString());
  }, []);

  const handleRestart = useCallback(() => {
    setPhase("quiz");
    setPrefs(null);
    setMatchedPreset(null);
    setInitialBuilderParts(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("type");
    url.searchParams.delete("id");
    url.searchParams.delete("mode");
    url.searchParams.delete("parts");
    window.history.replaceState({}, "", url.pathname);
  }, []);

  if (phase === "quiz") {
    return <QuizWizard onComplete={handleQuizComplete} onStartBuilder={handleStartBuilder} />;
  }

  if (phase === "builder") {
    return (
      <CustomPCBuilder
        onBack={handleRestart}
        initialParts={initialBuilderParts ?? undefined}
      />
    );
  }

  if (phase === "analyzing") {
    return <AnalyzingLoader onComplete={handleAnalyzingComplete} />;
  }

  if (phase === "results" && matchedPreset && prefs) {
    return (
      <ResultsDashboard
        initialPreset={matchedPreset}
        preferences={prefs}
        onRestart={handleRestart}
      />
    );
  }

  return null;
}
