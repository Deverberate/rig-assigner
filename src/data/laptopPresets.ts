import type { LaptopPreset } from "../types";

export const laptopPresets: LaptopPreset[] = [
  // ─── 1. MacBook Air M3 ───────────────────────────────────────
  {
    id: "macbook-air-m3",
    title: "MacBook Air 15\" M3",
    targetAudience: "Student / General / Business",
    budgetCategory: "mid-tier",
    brand: "Apple",
    laptopSpec: {
      display: {
        name: "Display",
        spec: '15.3" Liquid Retina, 2880×1864, 500 nits, P3 wide color',
        estimatedPrice: 0,
      },
      soc: {
        name: "SoC",
        spec: "Apple M3 (8-core CPU, 10-core GPU, 16-core Neural Engine)",
        estimatedPrice: 0,
      },
      battery: {
        name: "Battery",
        spec: "66.5 Wh — up to 18 hours video playback",
        estimatedPrice: 0,
      },
      cameras: {
        name: "Cameras",
        spec: "1080p FaceTime HD + Center Stage",
        estimatedPrice: 0,
      },
      weight: "1.51 kg (3.3 lbs)",
      ports: "2× Thunderbolt 4 / USB-C, MagSafe 3, 3.5mm jack",
      os: "macOS Sonoma",
    },
    totalEstimatedPrice: 1299,
    highlights: [
      "Fanless design — completely silent in libraries and lectures",
      "M3 chip handles Final Cut Pro, Logic Pro, and Xcode with ease",
      "18-hour battery life easily covers a full day on campus",
      "Lightweight at 1.51 kg — ideal for carrying between classes",
    ],
    performanceMetrics: [
      { label: "Geekbench 6", value: "~3,050 single / ~12,100 multi", iconName: "Zap" },
      { label: "Video Export", value: "10-min 4K H.265: ~4 min", iconName: "Film" },
      { label: "Battery Life", value: "~18 hrs video / ~12 hrs mixed", iconName: "Battery" },
    ],
    lastUpdated: "August 2026",
  },

  // ─── 2. Lenovo Legion Pro 5 16 ───────────────────────────────
  {
    id: "lenovo-legion-pro5",
    title: "Lenovo Legion Pro 5 16\" (2024)",
    targetAudience: "Gaming (High Refresh, AAA Titles)",
    budgetCategory: "mid-tier",
    brand: "Lenovo",
    laptopSpec: {
      display: {
        name: "Display",
        spec: '16" WQXGA (2560×1600), 240Hz, 500 nits, 100% DCI-P3',
        estimatedPrice: 0,
      },
      soc: {
        name: "SoC",
        spec: "AMD Ryzen 9 7945HX (16C / 32T, 5.4 GHz boost)",
        estimatedPrice: 0,
      },
      battery: {
        name: "Battery",
        spec: "99.9 Wh — up to 6 hours productivity / 2 hours gaming",
        estimatedPrice: 0,
      },
      cameras: {
        name: "Cameras",
        spec: "1080p IR webcam with privacy shutter",
        estimatedPrice: 0,
      },
      weight: "2.56 kg (5.6 lbs)",
      ports: "2× USB-C (DP 1.4), 3× USB-A 3.2, HDMI 2.1, RJ45, 3.5mm",
      os: "Windows 11 Home",
    },
    totalEstimatedPrice: 1699,
    highlights: [
      "RTX 4070 140W delivers desktop-class 1440p gaming on a laptop",
      "16\" 240Hz panel smooth enough for competitive esports",
      "16-core Ryzen 9 crushes compilation and rendering workloads",
      "99.9 Wh battery — largest legal size for air travel",
    ],
    performanceMetrics: [
      { label: "Cyberpunk 2077", value: "~75 FPS 1440p RT Ultra", iconName: "Gamepad2" },
      { label: "Cinebench R24", value: "~1,650 multi / ~118 single", iconName: "Cpu" },
      { label: "Valorant 1080p", value: "300+ FPS", iconName: "Crosshair" },
    ],
    lastUpdated: "August 2026",
    changeSummary:
      "Upgraded to RTX 4070 140W variant — 15% faster than the previous RTX 4060 model at the same price point.",
    previousBuild: {
      title: "Lenovo Legion Pro 5 16\" (2023)",
      totalPrice: 1599,
      retiredDate: "May 2026",
      parts: [
        { name: "Display", spec: '16" WQXGA (2560×1600), 165Hz, 350 nits', estimatedPrice: 0 },
        { name: "CPU", spec: "AMD Ryzen 7 7745HX (8C / 16T)", estimatedPrice: 0 },
        { name: "GPU", spec: "NVIDIA RTX 4060 8GB 140W", estimatedPrice: 0 },
        { name: "RAM", spec: "32 GB DDR5-4800 SO-DIMM", estimatedPrice: 0 },
        { name: "Storage", spec: "1 TB PCIe 4.0 NVMe", estimatedPrice: 0 },
      ],
    },
  },

  // ─── 3. ASUS ROG Zephyrus G14 ────────────────────────────────
  {
    id: "asus-rog-zephyrus-g14",
    title: "ASUS ROG Zephyrus G14 (2024)",
    targetAudience: "Gaming (Portable, Performance-per-kg)",
    budgetCategory: "flagship",
    brand: "ASUS",
    laptopSpec: {
      display: {
        name: "Display",
        spec: '14" OLED 2880×1800, 120Hz, 0.2ms, 100% DCI-P3, G-Sync',
        estimatedPrice: 0,
      },
      soc: {
        name: "SoC",
        spec: "AMD Ryzen 9 8945HS (8C / 16T, 5.2 GHz) + NVIDIA RTX 4070 8GB",
        estimatedPrice: 0,
      },
      battery: {
        name: "Battery",
        spec: "73 Wh — up to 10 hours productivity / 1.5 hours gaming",
        estimatedPrice: 0,
      },
      cameras: {
        name: "Cameras",
        spec: "1080p FHD IR webcam with 3DNR",
        estimatedPrice: 0,
      },
      weight: "1.50 kg (3.3 lbs)",
      ports: "1× USB-C (DP 1.4 + PD), 1× USB-C (DP 1.4), 2× USB-A 3.2, HDMI 2.1, 3.5mm",
      os: "Windows 11 Home",
    },
    totalEstimatedPrice: 1999,
    highlights: [
      "OLED display — true blacks and HDR for both gaming and creative work",
      "Under 1.5 kg with RTX 4070 — lightest high-performance gaming laptop",
      "AniMe Matrix LED lid for personalization (optional SKU)",
      "RTX 4070 handles 1080p Ultra and 1440p High in AAA titles",
    ],
    performanceMetrics: [
      { label: "Cyberpunk 2077", value: "~65 FPS 1080p RT Ultra", iconName: "Gamepad2" },
      { label: "Display HDR", value: "OLED 600 nits peak, true HDR", iconName: "Monitor" },
      { label: "Weight", value: "1.50 kg — ultra-portable", iconName: "Feather" },
    ],
    lastUpdated: "July 2026",
  },

  // ─── 4. Dell XPS 14 ──────────────────────────────────────────
  {
    id: "dell-xps-14",
    title: "Dell XPS 14 (2024)",
    targetAudience: "Business / Productivity / Creative Professionals",
    budgetCategory: "mid-tier",
    brand: "Dell",
    laptopSpec: {
      display: {
        name: "Display",
        spec: '14.5" OLED 3200×2000, 100% DCI-P3, Dolby Vision, touch',
        estimatedPrice: 0,
      },
      soc: {
        name: "SoC",
        spec: "Intel Core Ultra 7 155H (16C / 22T, 4.8 GHz)",
        estimatedPrice: 0,
      },
      battery: {
        name: "Battery",
        spec: "69.5 Wh — up to 11 hours productivity",
        estimatedPrice: 0,
      },
      cameras: {
        name: "Cameras",
        spec: "1080p FHD webcam + Windows Hello IR",
        estimatedPrice: 0,
      },
      weight: "1.48 kg (3.3 lbs)",
      ports: "2× Thunderbolt 4, microSD, 3.5mm jack (USB-C dongle for USB-A)",
      os: "Windows 11 Pro",
    },
    totalEstimatedPrice: 1599,
    highlights: [
      "OLED touch display — stunning for photo editing and presentations",
      "CNC machined aluminum — premium build for client-facing environments",
      "Intel Core Ultra with dedicated NPU for on-device AI tasks",
      "Windows Hello IR for instant, secure biometric login",
    ],
    performanceMetrics: [
      { label: "Geekbench 6", value: "~2,400 single / ~12,500 multi", iconName: "Zap" },
      { label: "Display Quality", value: "3.2K OLED, 100% DCI-P3", iconName: "Monitor" },
      { label: "Battery Life", value: "~11 hrs productivity", iconName: "Battery" },
    ],
    lastUpdated: "June 2026",
  },

  // ─── 5. ASUS ProArt Studiobook 16 ────────────────────────────
  {
    id: "asus-proart-studiobook",
    title: "ASUS ProArt Studiobook 16 OLED",
    targetAudience: "Video Editing / 3D / Creative Professional",
    budgetCategory: "flagship",
    brand: "ASUS",
    laptopSpec: {
      display: {
        name: "Display",
        spec: '16" 3.2K OLED, 120Hz, 0.2ms, 100% DCI-P3, Calman Verified',
        estimatedPrice: 0,
      },
      soc: {
        name: "SoC",
        spec: "Intel Core i9-14900HX (24C / 32T, 5.8 GHz) + RTX 4070 8GB",
        estimatedPrice: 0,
      },
      battery: {
        name: "Battery",
        spec: "90 Wh — up to 8 hours productivity",
        estimatedPrice: 0,
      },
      cameras: {
        name: "Cameras",
        spec: "1080p FHD webcam with 3D noise reduction",
        estimatedPrice: 0,
      },
      weight: "2.40 kg (5.3 lbs)",
      ports: "2× Thunderbolt 4, 2× USB-A 3.2, HDMI 2.1, SD Express 7.0, 3.5mm",
      os: "Windows 11 Pro",
    },
    totalEstimatedPrice: 2499,
    highlights: [
      "24-core i9 + RTX 4070 in a laptop — desktop replacement for mobile editors",
      "Calman-verified OLED for accurate color grading on the go",
      "SD Express 7.0 slot for fast offloading from cinema cameras",
      "90 Wh battery handles full editing sessions away from the charger",
    ],
    performanceMetrics: [
      { label: "DaVinci Resolve 4K", value: "Smooth timeline scrubbing", iconName: "Film" },
      { label: "Cinebench R24", value: "~2,100 multi / ~125 single", iconName: "Cpu" },
      { label: "Export 10-min 4K", value: "~6 min H.265", iconName: "Clock" },
    ],
    lastUpdated: "August 2026",
    changeSummary:
      "Upgraded to Core i9-14900HX from 13980HX — 12% single-core improvement for timeline responsiveness.",
    previousBuild: {
      title: "ASUS ProArt Studiobook 16 (2023)",
      totalPrice: 2399,
      retiredDate: "April 2026",
      parts: [
        { name: "Display", spec: '16" 3.2K OLED, 60Hz, Calman Verified', estimatedPrice: 0 },
        { name: "CPU", spec: "Intel Core i9-13980HX (24C / 32T)", estimatedPrice: 0 },
        { name: "GPU", spec: "NVIDIA RTX 4060 8GB", estimatedPrice: 0 },
        { name: "RAM", spec: "32 GB DDR5-5600 SO-DIMM", estimatedPrice: 0 },
        { name: "Storage", spec: "1 TB PCIe 4.0 NVMe", estimatedPrice: 0 },
      ],
    },
  },

  // ─── 6. HP Victus 15 ──────────────────────────────────────────
  {
    id: "hp-victus-15",
    title: "HP Victus 15 (2024)",
    targetAudience: "Budget Gaming / Student Gaming",
    budgetCategory: "budget",
    brand: "HP",
    laptopSpec: {
      display: {
        name: "Display",
        spec: '15.6" FHD (1920×1080), 144Hz, 300 nits, IPS',
        estimatedPrice: 0,
      },
      soc: {
        name: "SoC",
        spec: "AMD Ryzen 5 7640HS (6C / 12T, 5.0 GHz) + RTX 4050 6GB",
        estimatedPrice: 0,
      },
      battery: {
        name: "Battery",
        spec: "70 Wh — up to 7 hours productivity",
        estimatedPrice: 0,
      },
      cameras: {
        name: "Cameras",
        spec: "720p webcam with temporal noise reduction",
        estimatedPrice: 0,
      },
      weight: "2.29 kg (5.1 lbs)",
      ports: "1× USB-C 3.2, 2× USB-A 3.2, HDMI 2.1, RJ45, 3.5mm",
      os: "Windows 11 Home",
    },
    totalEstimatedPrice: 799,
    highlights: [
      "RTX 4050 handles 1080p High in most AAA titles at 60+ FPS",
      "144Hz panel smooth for Valorant, CS2, and Fortnite",
      "Under $800 — one of the cheapest ways into RTX 40-series gaming",
      "Upgradable RAM and SSD slots for future expansion",
    ],
    performanceMetrics: [
      { label: "Valorant 1080p", value: "200+ FPS High", iconName: "Crosshair" },
      { label: "Cyberpunk 2077", value: "~55 FPS 1080p Medium-High", iconName: "Gamepad2" },
      { label: "Value Score", value: "Best FPS per dollar under $800", iconName: "TrendingUp" },
    ],
    lastUpdated: "July 2026",
  },
];
