/** Device categories */
export type DeviceCategory = "pc" | "laptop" | "phone";

/** Primary use-case categories */
export type PrimaryUse =
  | "gaming"
  | "video-editing"
  | "college-student"
  | "office";

/** Sub-type selections depending on primary use */
export type BranchOrSubtype =
  // College Student branches
  | "cs-ai-ml"
  | "mechanical-civil-cad"
  | "general-engineering"
  | "non-tech-arts"
  // Video Editing workloads
  | "1080p-social-media"
  | "4k-timeline-color"
  | "heavy-vfx-3d-blender"
  // Gaming targets
  | "1080p-esports"
  | "1440p-sweetspot"
  | "4k-ray-tracing"
  // Office setups
  | "basic-docs"
  | "heavy-multi-screen";

export type BudgetTier = "budget" | "mid-tier" | "flagship";

export type FormFactor = "standard-tower" | "sff-mini" | "rgb-showcase";

/** Laptop-specific spec */
export interface LaptopSpec {
  display: ComponentPart;
  soc: ComponentPart;
  battery: ComponentPart;
  cameras: ComponentPart;
  weight: string;
  ports: string;
  os: string;
}

/** Phone-specific spec */
export interface PhoneSpec {
  display: ComponentPart;
  chipset: ComponentPart;
  battery: ComponentPart;
  cameras: ComponentPart;
  weight: string;
  os: string;
  connectivity: string;
}

/** A complete laptop preset */
export interface LaptopPreset {
  id: string;
  title: string;
  targetAudience: string;
  budgetCategory: BudgetTier;
  brand: string;
  laptopSpec: LaptopSpec;
  totalEstimatedPrice: number;
  highlights: string[];
  performanceMetrics: PerformanceMetric[];
  lastUpdated?: string;
  changeSummary?: string;
  previousBuild?: PreviousBuild;
}

/** A complete phone preset */
export interface PhonePreset {
  id: string;
  title: string;
  targetAudience: string;
  budgetCategory: BudgetTier;
  brand: string;
  phoneSpec: PhoneSpec;
  totalEstimatedPrice: number;
  highlights: string[];
  performanceMetrics: PerformanceMetric[];
  lastUpdated?: string;
  changeSummary?: string;
  previousBuild?: PreviousBuild;
}

/** User's selections collected from the multi-step form */
export interface UserPreferences {
  deviceCategory: DeviceCategory;
  primaryUse: PrimaryUse;
  branchOrSubtype: BranchOrSubtype;
  budgetTier: BudgetTier;
  formFactor: FormFactor;
}

/** A single component in a build */
export interface ComponentPart {
  name: string;
  spec: string;
  estimatedPrice: number;
}

/** A complete hardware build preset */
export interface PerformanceMetric {
  label: string;
  value: string;
  iconName: string;
}

export interface PreviousBuild {
  title: string;
  totalPrice: number;
  parts: ComponentPart[];
  retiredDate: string;
}

export interface BuildPreset {
  id: string;
  title: string;
  targetAudience: string;
  budgetCategory: BudgetTier;
  cpu: ComponentPart;
  gpu: ComponentPart;
  ram: ComponentPart;
  storage: ComponentPart;
  motherboard: ComponentPart;
  psu: ComponentPart;
  cooler: ComponentPart;
  case: ComponentPart;
  totalEstimatedPrice: number;
  highlights: string[];
  performanceMetrics: PerformanceMetric[];
  lastUpdated?: string;
  changeSummary?: string;
  previousBuild?: PreviousBuild;
}
