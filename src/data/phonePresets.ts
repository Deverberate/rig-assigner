import type { PhonePreset } from "../types";

export const phonePresets: PhonePreset[] = [
  // ─── 1. iPhone 16 Pro ────────────────────────────────────────
  {
    id: "iphone-16-pro",
    title: "iPhone 16 Pro Max",
    targetAudience: "Photography / Video / Premium Ecosystem",
    budgetCategory: "flagship",
    brand: "Apple",
    phoneSpec: {
      display: {
        name: "Display",
        spec: '6.9" Super Retina XDR OLED, 2868×1320, 120Hz ProMotion, 2000 nits peak',
        estimatedPrice: 0,
      },
      chipset: {
        name: "Chipset",
        spec: "Apple A18 Pro (6-core CPU, 6-core GPU, 16-core Neural Engine)",
        estimatedPrice: 0,
      },
      battery: {
        name: "Battery",
        spec: "4685 mAh — up to 33 hours video playback, 25W wired, 25W MagSafe",
        estimatedPrice: 0,
      },
      cameras: {
        name: "Cameras",
        spec: "48MP Fusion (24mm, f/1.78) + 48MP Ultra Wide (13mm) + 12MP 5× Telephoto (120mm) + LiDAR",
        estimatedPrice: 0,
      },
      weight: "227 g (8.0 oz)",
      os: "iOS 18",
      connectivity: "5G (sub-6 + mmWave), Wi-Fi 7, Bluetooth 5.3, UWB 2, Satellite SOS",
    },
    totalEstimatedPrice: 1199,
    highlights: [
      "4K 120fps Dolby Vision recording — best video on any phone",
      "5× optical zoom telephoto reaches far without quality loss",
      "Camera Control button for instant pro-level capture",
      "Titanium frame — premium, lightweight, durable",
    ],
    performanceMetrics: [
      { label: "AnTuTu", value: "~1,850,000", iconName: "Zap" },
      { label: "Video Recording", value: "4K 120fps Dolby Vision", iconName: "Film" },
      { label: "Battery Life", value: "~33 hrs video playback", iconName: "Battery" },
    ],
    lastUpdated: "August 2026",
  },

  // ─── 2. Samsung Galaxy S24 Ultra ──────────────────────────────
  {
    id: "samsung-s24-ultra",
    title: "Samsung Galaxy S24 Ultra",
    targetAudience: "Photography / Productivity / S Pen",
    budgetCategory: "flagship",
    brand: "Samsung",
    phoneSpec: {
      display: {
        name: "Display",
        spec: '6.8" Dynamic AMOLED 2X, 3120×1440, 120Hz, 2600 nits peak, Gorilla Armor',
        estimatedPrice: 0,
      },
      chipset: {
        name: "Chipset",
        spec: "Qualcomm Snapdragon 8 Gen 3 for Galaxy (8-core, 3.4 GHz)",
        estimatedPrice: 0,
      },
      battery: {
        name: "Battery",
        spec: "5000 mAh — up to 30 hours video, 45W wired, 15W wireless",
        estimatedPrice: 0,
      },
      cameras: {
        name: "Cameras",
        spec: "200MP Main (23mm, f/1.7, OIS) + 12MP Ultra Wide (13mm) + 50MP 5× Tele (115mm) + 10MP 3× Tele (70mm)",
        estimatedPrice: 0,
      },
      weight: "232 g (8.2 oz)",
      os: "Android 14 (One UI 6.1) — 7 years of updates",
      connectivity: "5G (sub-6 + mmWave), Wi-Fi 7, Bluetooth 5.3, UWB, S Pen built-in",
    },
    totalEstimatedPrice: 1299,
    highlights: [
      "200MP sensor captures insane detail — crop-friendly high-res shots",
      "S Pen built-in for note-taking, sketching, and precise edits",
      "Galaxy AI: Circle to Search, Live Translate, Generative Edit",
      "7 years of OS updates — longest support in Android world",
    ],
    performanceMetrics: [
      { label: "AnTuTu", value: "~2,050,000", iconName: "Zap" },
      { label: "Photography", value: "200MP, 100× Space Zoom", iconName: "Camera" },
      { label: "AI Features", value: "On-device Galaxy AI suite", iconName: "Brain" },
    ],
    lastUpdated: "August 2026",
    changeSummary:
      "Galaxy AI now processes on-device with One UI 6.1.1 — faster Generative Edit and new Sketch-to-Image feature added.",
    previousBuild: {
      title: "Samsung Galaxy S23 Ultra",
      totalPrice: 1199,
      retiredDate: "February 2026",
      parts: [
        { name: "Display", spec: '6.8" Dynamic AMOLED 2X, 3088×1440, 120Hz', estimatedPrice: 0 },
        { name: "Chipset", spec: "Snapdragon 8 Gen 2 for Galaxy", estimatedPrice: 0 },
        { name: "Battery", spec: "5000 mAh, 45W wired", estimatedPrice: 0 },
        { name: "Camera", spec: "200MP Main + 12MP UW + 10MP 3× + 10MP 10×", estimatedPrice: 0 },
      ],
    },
  },

  // ─── 3. Google Pixel 9 Pro ────────────────────────────────────
  {
    id: "google-pixel-9-pro",
    title: "Google Pixel 9 Pro",
    targetAudience: "Photography / AI Features / Clean Android",
    budgetCategory: "mid-tier",
    brand: "Google",
    phoneSpec: {
      display: {
        name: "Display",
        spec: '6.3" Super Actua LTPO OLED, 2856×1280, 120Hz, 3000 nits peak HDR',
        estimatedPrice: 0,
      },
      chipset: {
        name: "Chipset",
        spec: "Google Tensor G4 (8-core, 3.1 GHz) + Titan M2 security",
        estimatedPrice: 0,
      },
      battery: {
        name: "Battery",
        spec: "4700 mAh — up to 24 hours, 30W wired, 23W wireless (Qi2)",
        estimatedPrice: 0,
      },
      cameras: {
        name: "Cameras",
        spec: "50MP Main (25mm, f/1.68, OIS) + 48MP Ultra Wide (13mm) + 48MP 5× Telephoto (113mm)",
        estimatedPrice: 0,
      },
      weight: "199 g (7.0 oz)",
      os: "Android 14 (stock) — 7 years of updates",
      connectivity: "5G sub-6, Wi-Fi 7, Bluetooth 5.3, UWB, Satellite SOS",
    },
    totalEstimatedPrice: 999,
    highlights: [
      "Best point-and-shoot camera in any phone — Magic Eraser, Best Take, Photo Unblur",
      "7 years of updates guarantee — longest in pure Android",
      "Tensor G4 optimized for on-device AI: Gemini Nano, Live Translate, Call Screen",
      "Compact 6.3\" body with flagship-grade cameras — rare combo",
    ],
    performanceMetrics: [
      { label: "DxOMark", value: "#1 overall camera score", iconName: "Camera" },
      { label: "AI Features", value: "Gemini Nano on-device AI", iconName: "Brain" },
      { label: "Software", value: "7 years guaranteed updates", iconName: "ShieldCheck" },
    ],
    lastUpdated: "August 2026",
  },

  // ─── 4. OnePlus 13 ───────────────────────────────────────────
  {
    id: "oneplus-13",
    title: "OnePlus 13",
    targetAudience: "Value Flagship / Fast Charging / Performance",
    budgetCategory: "mid-tier",
    brand: "OnePlus",
    phoneSpec: {
      display: {
        name: "Display",
        spec: '6.82" LTPO AMOLED, 3168×1440, 120Hz, 4500 nits peak, BOE X2',
        estimatedPrice: 0,
      },
      chipset: {
        name: "Chipset",
        spec: "Qualcomm Snapdragon 8 Elite (8-core, 4.32 GHz)",
        estimatedPrice: 0,
      },
      battery: {
        name: "Battery",
        spec: "6000 mAh — up to 36 hours mixed, 100W SUPERVOOC wired, 50W wireless",
        estimatedPrice: 0,
      },
      cameras: {
        name: "Cameras",
        spec: "50MP Main (23mm, f/1.6, OIS) + 50MP Ultra Wide (14mm) + 50MP 3× Telephoto (73mm) — Hasselblad",
        estimatedPrice: 0,
      },
      weight: "213 g (7.5 oz)",
      os: "Android 15 (OxygenOS 15)",
      connectivity: "5G (sub-6 + mmWave), Wi-Fi 7, Bluetooth 5.4, UWB",
    },
    totalEstimatedPrice: 899,
    highlights: [
      "6000 mAh + 100W charging — full charge in ~26 minutes",
      "Snapdragon 8 Elite is the fastest Android chip available",
      "Hasselblad color science across all three 50MP cameras",
      "Under $900 — flagship specs at a mid-tier price",
    ],
    performanceMetrics: [
      { label: "AnTuTu", value: "~2,750,000 — fastest Android", iconName: "Zap" },
      { label: "Charging", value: "100W: 0-100% in ~26 min", iconName: "Battery" },
      { label: "Display", value: "4500 nits peak — brightest phone", iconName: "Monitor" },
    ],
    lastUpdated: "August 2026",
  },

  // ─── 5. Xiaomi 14 Ultra ──────────────────────────────────────
  {
    id: "xiaomi-14-ultra",
    title: "Xiaomi 14 Ultra",
    targetAudience: "Photography Enthusiast / Leica Cameras",
    budgetCategory: "flagship",
    brand: "Xiaomi",
    phoneSpec: {
      display: {
        name: "Display",
        spec: '6.73" LTPO AMOLED, 3200×1440, 120Hz, 3000 nits peak, Dolby Vision',
        estimatedPrice: 0,
      },
      chipset: {
        name: "Chipset",
        spec: "Qualcomm Snapdragon 8 Gen 3 (8-core, 3.3 GHz)",
        estimatedPrice: 0,
      },
      battery: {
        name: "Battery",
        spec: "5300 mAh — up to 30 hours, 90W wired, 80W wireless",
        estimatedPrice: 0,
      },
      cameras: {
        name: "Cameras",
        spec: "50MP 1\" Leica Summilux Main (23mm, f/1.63, OIS) + 50MP Ultra Wide (12mm) + 50MP 3.2× (75mm) + 50MP 5× Periscope (120mm)",
        estimatedPrice: 0,
      },
      weight: "224 g (7.9 oz)",
      os: "Android 14 (HyperOS)",
      connectivity: "5G, Wi-Fi 7, Bluetooth 5.4, UWB, IP68",
    },
    totalEstimatedPrice: 1099,
    highlights: [
      "1-inch Leica Summilux sensor — closest to compact camera quality",
      "4-camera Leica system with Summilux glass across all lenses",
      "80W wireless charging — fastest wireless on any phone",
      "Leica Authentic and Leica Vibrant color modes built-in",
    ],
    performanceMetrics: [
      { label: "DxOMark", value: "#2 overall camera score", iconName: "Camera" },
      { label: "Charging", value: "90W wired / 80W wireless", iconName: "Battery" },
      { label: "Sensor Size", value: '1" Leica Summilux — largest', iconName: "Aperture" },
    ],
    lastUpdated: "July 2026",
  },

  // ─── 6. Poco F6 ──────────────────────────────────────────────
  {
    id: "poco-f6",
    title: "POCO F6",
    targetAudience: "Budget Performance / Value Gaming",
    budgetCategory: "budget",
    brand: "POCO",
    phoneSpec: {
      display: {
        name: "Display",
        spec: '6.67" AMOLED, 2712×1220, 120Hz, 2400 nits peak, Dolby Vision',
        estimatedPrice: 0,
      },
      chipset: {
        name: "Chipset",
        spec: "Qualcomm Snapdragon 8s Gen 3 (8-core, 3.0 GHz)",
        estimatedPrice: 0,
      },
      battery: {
        name: "Battery",
        spec: "5000 mAh — up to 28 hours, 90W HyperCharge wired",
        estimatedPrice: 0,
      },
      cameras: {
        name: "Cameras",
        spec: "50MP Main (26mm, f/1.6, OIS) + 8MP Ultra Wide (16mm)",
        estimatedPrice: 0,
      },
      weight: "179 g (6.3 oz)",
      os: "Android 14 (HyperOS)",
      connectivity: "5G sub-6, Wi-Fi 6, Bluetooth 5.4, IP64",
    },
    totalEstimatedPrice: 349,
    highlights: [
      "Under $350 — flagship-tier Snapdragon 8s Gen 3 performance",
      "90W charging fills 5000 mAh in ~30 minutes",
      "120Hz AMOLED with Dolby Vision at a budget price point",
      "Lightest phone on this list at just 179g — comfortable one-hand use",
    ],
    performanceMetrics: [
      { label: "AnTuTu", value: "~1,450,000 — best under $400", iconName: "Zap" },
      { label: "Charging", value: "90W: 0-100% in ~30 min", iconName: "Battery" },
      { label: "Value Score", value: "Best performance per dollar", iconName: "TrendingUp" },
    ],
    lastUpdated: "August 2026",
  },
];
