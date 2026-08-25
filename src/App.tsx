import { useState, useCallback, useEffect } from "react";
import type {
  UserPreferences,
  BuildPreset,
  LaptopPreset,
  PhonePreset,
  DeviceCategory,
} from "./types";
import QuizWizard from "./components/QuizWizard";
import AnalyzingLoader from "./components/AnalyzingLoader";
import ResultsDashboard from "./components/ResultsDashboard";
import { findBestMatch } from "./utils/matcher";
import { presets } from "./data/presets";
import { laptopPresets } from "./data/laptopPresets";
import { phonePresets } from "./data/phonePresets";

type AppPhase = "quiz" | "analyzing" | "results";

/**
 * Parse URL query params for direct linking:
 *   ?type=laptop&id=zephyrus-g14
 *   ?type=phone&id=iphone-16-pro
 *   ?type=pc&id=gaming-1440p-mid
 */
function parseUrlParams(): { type: DeviceCategory; id: string } | null {
  const params = new URLSearchParams(window.location.search);
  const type = params.get("type") as DeviceCategory | null;
  const id = params.get("id");
  if (type && id && ["pc", "laptop", "phone"].includes(type)) {
    return { type, id };
  }
  return null;
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

  // Check for URL deep link on mount
  useEffect(() => {
    const urlMatch = parseUrlParams();
    if (urlMatch) {
      const preset = findPresetById(urlMatch.type, urlMatch.id);
      if (preset) {
        // Reconstruct minimal preferences from URL
        const dummyPrefs: UserPreferences = {
          deviceCategory: urlMatch.type,
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

      // Update URL for sharing
      const url = new URL(window.location.href);
      url.searchParams.set("type", prefs.deviceCategory);
      url.searchParams.set("id", result.id);
      window.history.replaceState({}, "", url.toString());
    }
  }, [prefs]);

  const handleRestart = useCallback(() => {
    setPhase("quiz");
    setPrefs(null);
    setMatchedPreset(null);
    // Clear URL params
    const url = new URL(window.location.href);
    url.searchParams.delete("type");
    url.searchParams.delete("id");
    window.history.replaceState({}, "", url.pathname);
  }, []);

  if (phase === "quiz") {
    return <QuizWizard onComplete={handleQuizComplete} />;
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
