import { useState, useCallback } from "react";
import type { UserPreferences, BuildPreset } from "./types";
import QuizWizard from "./components/QuizWizard";
import AnalyzingLoader from "./components/AnalyzingLoader";
import ResultsDashboard from "./components/ResultsDashboard";
import { findBestPreset } from "./utils/matcher";
import { presets } from "./data/presets";

type AppPhase = "quiz" | "analyzing" | "results";

export default function App() {
  const [phase, setPhase] = useState<AppPhase>("quiz");
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [matchedPreset, setMatchedPreset] = useState<BuildPreset | null>(null);

  const handleQuizComplete = useCallback((userPrefs: UserPreferences) => {
    setPrefs(userPrefs);
    setPhase("analyzing");
  }, []);

  const handleAnalyzingComplete = useCallback(() => {
    if (prefs) {
      const result = findBestPreset(prefs, presets);
      setMatchedPreset(result);
      setPhase("results");
    }
  }, [prefs]);

  const handleRestart = useCallback(() => {
    setPhase("quiz");
    setPrefs(null);
    setMatchedPreset(null);
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
