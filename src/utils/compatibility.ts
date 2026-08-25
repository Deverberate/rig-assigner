import type { PartCatalogItem, PartCategory } from "../types";

export type CompatibilitySeverity = "error" | "warning" | "info";

export interface CompatibilityIssue {
  severity: CompatibilitySeverity;
  message: string;
  /** Which categories are involved in this issue */
  affectedCategories: PartCategory[];
}

/**
 * Extract PSU wattage from a PSU part's specs (e.g. "750W" → 750).
 */
function extractPSUWattage(psu: PartCatalogItem): number {
  // First spec is typically "750W" or similar
  const match = psu.specs[0]?.match(/(\d+)\s*W/);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Run all compatibility checks on the current build.
 */
export function checkCompatibility(
  parts: Record<PartCategory, PartCatalogItem | null>
): CompatibilityIssue[] {
  const issues: CompatibilityIssue[] = [];

  // ── 1. Socket Compatibility: CPU ↔ Motherboard ──────────────
  if (parts.cpu && parts.motherboard) {
    const cpuSocket = parts.cpu.socket;
    const mbSocket = parts.motherboard.socket;

    if (cpuSocket && mbSocket) {
      if (cpuSocket !== mbSocket) {
        issues.push({
          severity: "error",
          message: `Socket mismatch: ${parts.cpu.name} requires ${cpuSocket}, but ${parts.motherboard.name} is ${mbSocket}`,
          affectedCategories: ["cpu", "motherboard"],
        });
      }
    }
  }

  // ── 2. PSU Wattage: PSU vs Total TDP ────────────────────────
  const totalTDP = Object.values(parts).reduce(
    (sum, p) => sum + (p?.tdpWatts ?? 0),
    0
  );

  if (parts.psu) {
    const psuWattage = extractPSUWattage(parts.psu);
    const requiredWattage = totalTDP + 100; // 100W overhead for mobo, fans, etc.

    if (psuWattage > 0) {
      if (psuWattage < totalTDP) {
        issues.push({
          severity: "error",
          message: `PSU underpowered: ${parts.psu.name} provides only ${psuWattage}W, but components need ${totalTDP}W TDP alone`,
          affectedCategories: ["psu"],
        });
      } else if (psuWattage < requiredWattage) {
        issues.push({
          severity: "warning",
          message: `PSU headroom is tight: ${psuWattage}W PSU vs ${requiredWattage}W recommended (${totalTDP}W TDP + 100W overhead)`,
          affectedCategories: ["psu"],
        });
      }
    }
  }

  // ── 3. Case ↔ Motherboard Form Factor ───────────────────────
  if (parts.case && parts.motherboard) {
    const caseSpecs = parts.case.specs.join(" ").toLowerCase();
    const mbFF = parts.motherboard.formFactor?.toLowerCase();

    if (mbFF === "atx" && caseSpecs.includes("atx")) {
      // ATX board in ATX case — fine
    } else if (mbFF === "matx" && caseSpecs.includes("atx")) {
      // mATX board in ATX case — fine (smaller board fits bigger case)
    } else if (mbFF === "atx" && !caseSpecs.includes("atx")) {
      // ATX board in non-ATX case — could be a problem
      if (caseSpecs.includes("matx") || caseSpecs.includes("micro")) {
        issues.push({
          severity: "error",
          message: `Form factor mismatch: ${parts.motherboard.name} is ATX but ${parts.case.name} only supports mATX or smaller`,
          affectedCategories: ["motherboard", "case"],
        });
      }
    }
  }

  // ── 4. CPU ↔ Cooler socket compatibility ────────────────────
  if (parts.cpu && parts.cooler) {
    const coolerName = parts.cooler.name.toLowerCase();
    const cpuSocket = parts.cpu.socket;

    // Stock cooler only works with its own brand
    if (coolerName.includes("wraith")) {
      if (parts.cpu.brand !== "AMD") {
        issues.push({
          severity: "warning",
          message: `${parts.cooler.name} is designed for AMD processors, but you selected an Intel CPU`,
          affectedCategories: ["cpu", "cooler"],
        });
      }
    }

    // Check if cooler supports the socket (basic heuristic)
    if (cpuSocket === "AM5" && (coolerName.includes("intel") || coolerName.includes("lga"))) {
      issues.push({
        severity: "error",
        message: `${parts.cooler.name} may not support ${cpuSocket} socket`,
        affectedCategories: ["cpu", "cooler"],
      });
    }
    if (cpuSocket === "LGA 1700" && coolerName.includes("am5")) {
      issues.push({
        severity: "error",
        message: `${parts.cooler.name} is designed for ${cpuSocket === "LGA 1700" ? "AM5" : "other"} sockets, not LGA 1700`,
        affectedCategories: ["cpu", "cooler"],
      });
    }
  }

  // ── 5. PSU underpowered warning (even if no GPU yet) ────────
  if (!parts.psu && totalTDP > 0) {
    issues.push({
      severity: "info",
      message: `Select a PSU — estimated power need is ${totalTDP}W TDP (+100W overhead = ${totalTDP + 100}W+ recommended)`,
      affectedCategories: ["psu"],
    });
  }

  return issues;
}

/**
 * Get the severity level for a specific category based on all issues.
 */
export function getCategorySeverity(
  category: PartCategory,
  issues: CompatibilityIssue[]
): CompatibilitySeverity | null {
  const relevant = issues.filter((i) => i.affectedCategories.includes(category));
  if (relevant.some((i) => i.severity === "error")) return "error";
  if (relevant.some((i) => i.severity === "warning")) return "warning";
  if (relevant.some((i) => i.severity === "info")) return "info";
  return null;
}

/**
 * Get all issues for a specific category.
 */
export function getCategoryIssues(
  category: PartCategory,
  issues: CompatibilityIssue[]
): CompatibilityIssue[] {
  return issues.filter((i) => i.affectedCategories.includes(category));
}
