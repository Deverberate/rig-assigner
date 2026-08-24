import type { BuildPreset } from "../types";

/**
 * 10 balanced, realistic hardware build presets.
 *
 * Categories covered:
 *   1. CS / AI-ML Student          – CUDA VRAM focus, 32 GB+ RAM
 *   2. Mechanical / Civil CAD     – high single-core, balanced GPU
 *   3. Video Editing – 1080p      – VRAM + multi-thread CPU (entry)
 *   4. Video Editing – 4K / VFX   – VRAM + multi-thread CPU (pro)
 *   5. 1080p Competitive Gaming   – high refresh, esports-oriented
 *   6. 1440p Sweet-Spot Gaming    – balanced price/performance
 *   7. 4K Enthusiast Gaming       – flagship GPU, premium everything
 *   8. Office / Basic Productivity – iGPU, silent, affordable
 *   9. Office / Heavy Multi-Screen – extra RAM, multiple monitors
 *  10. General College Student     – affordable all-rounder
 */

export const presets: BuildPreset[] = [
  // ─── 1. CS / AI-ML Student ───────────────────────────────────────────
  {
    id: "cs-ai-ml-mid",
    title: "AI / ML Workstation – Student Edition",
    targetAudience: "CS / AI-ML Student",
    budgetCategory: "mid-tier",
    cpu: {
      name: "CPU",
      spec: "AMD Ryzen 7 7700X (8C / 16T, 5.4 GHz boost)",
      estimatedPrice: 299,
    },
    gpu: {
      name: "GPU",
      spec: "NVIDIA GeForce RTX 4060 Ti 16 GB GDDR6",
      estimatedPrice: 449,
    },
    ram: {
      name: "RAM",
      spec: "32 GB (2×16) DDR5-5600 CL36",
      estimatedPrice: 85,
    },
    storage: {
      name: "Storage",
      spec: "1 TB WD Black SN770 NVMe PCIe 4.0",
      estimatedPrice: 65,
    },
    motherboard: {
      name: "Motherboard",
      spec: "MSI B650 Gaming Plus WiFi (ATX, AM5)",
      estimatedPrice: 179,
    },
    psu: {
      name: "PSU",
      spec: "Corsair RM750e 750W 80+ Gold (Fully Modular)",
      estimatedPrice: 89,
    },
    cooler: {
      name: "Cooler",
      spec: "Thermalright Peerless Assassin 120 SE (Dual Tower)",
      estimatedPrice: 35,
    },
    case: {
      name: "Case",
      spec: "Fractal Design Pop Air (ATX Mid Tower)",
      estimatedPrice: 79,
    },
    totalEstimatedPrice: 1280,
    highlights: [
      "16 GB VRAM enables local LLM inference (Llama-3 8B at ~25 tok/s)",
      "CUDA / Tensor cores accelerate PyTorch training",
      "32 GB system RAM handles large datasets in-memory",
      "AM5 platform leaves headroom for future Ryzen upgrades",
    ],
  },

  // ─── 2. Mechanical / Civil CAD ────────────────────────────────────────
  {
    id: "cad-engineering-mid",
    title: "CAD Engineering Build",
    targetAudience: "Mechanical / Civil CAD",
    budgetCategory: "mid-tier",
    cpu: {
      name: "CPU",
      spec: "Intel Core i7-14700K (20C / 28T, 5.6 GHz boost)",
      estimatedPrice: 369,
    },
    gpu: {
      name: "GPU",
      spec: "NVIDIA RTX 4060 8 GB GDDR6 (ISV-certified drivers)",
      estimatedPrice: 299,
    },
    ram: {
      name: "RAM",
      spec: "32 GB (2×16) DDR5-5600 CL36",
      estimatedPrice: 85,
    },
    storage: {
      name: "Storage",
      spec: "1 TB Samsung 990 EVO NVMe",
      estimatedPrice: 89,
    },
    motherboard: {
      name: "Motherboard",
      spec: "Gigabyte Z790 Aorus Elite AX (ATX, LGA1700)",
      estimatedPrice: 219,
    },
    psu: {
      name: "PSU",
      spec: "Corsair RM750e 750W 80+ Gold",
      estimatedPrice: 89,
    },
    cooler: {
      name: "Cooler",
      spec: "Noctua NH-D15 chromax.black (Dual Tower)",
      estimatedPrice: 109,
    },
    case: {
      name: "Case",
      spec: "Fractal Design Meshify 2 Compact (ATX Mid Tower)",
      estimatedPrice: 119,
    },
    totalEstimatedPrice: 1378,
    highlights: [
      "Intel 14th-gen excels at single-threaded CAD operations (SolidWorks, AutoCAD)",
      "High turbo boost ensures fast parametric rebuilds",
      "NVIDIA ISV-certified drivers for certified SOLIDWORKS / CATIA stability",
      "Noctua cooler keeps thermals whisper-quiet during long renders",
    ],
  },

  // ─── 3. Video Editing – 1080p Social Media ───────────────────────────
  {
    id: "video-1080p-budget",
    title: "1080p Content Creator Build",
    targetAudience: "Video Editing – 1080p Social Media",
    budgetCategory: "budget",
    cpu: {
      name: "CPU",
      spec: "AMD Ryzen 5 7600 (6C / 12T, 5.1 GHz boost)",
      estimatedPrice: 199,
    },
    gpu: {
      name: "GPU",
      spec: "NVIDIA RTX 4060 8 GB GDDR6",
      estimatedPrice: 299,
    },
    ram: {
      name: "RAM",
      spec: "32 GB (2×16) DDR5-5200 CL36",
      estimatedPrice: 75,
    },
    storage: {
      name: "Storage",
      spec: "1 TB Crucial P3 Plus NVMe PCIe 4.0",
      estimatedPrice: 55,
    },
    motherboard: {
      name: "Motherboard",
      spec: "MSI B650M Gaming Plus WiFi (mATX, AM5)",
      estimatedPrice: 139,
    },
    psu: {
      name: "PSU",
      spec: "Thermaltake Toughpower GF1 650W 80+ Gold",
      estimatedPrice: 69,
    },
    cooler: {
      name: "Cooler",
      spec: "DeepCool AK400 (Single Tower)",
      estimatedPrice: 25,
    },
    case: {
      name: "Case",
      spec: "NZXT H5 Flow (ATX Mid Tower)",
      estimatedPrice: 89,
    },
    totalEstimatedPrice: 950,
    highlights: [
      "DaVinci Resolve CUDA-accelerated 1080p timeline: smooth real-time playback",
      "32 GB RAM handles multi-track audio + effects without swapping",
      "NVMe SSD gives fast media import and proxy generation",
      "Budget-friendly without sacrificing editing responsiveness",
    ],
  },

  // ─── 4. Video Editing – 4K / Heavy VFX ───────────────────────────────
  {
    id: "video-4k-flagship",
    title: "4K / VFX Professional Build",
    targetAudience: "Video Editing – 4K Color Grading & Heavy VFX",
    budgetCategory: "flagship",
    cpu: {
      name: "CPU",
      spec: "AMD Ryzen 9 7950X (16C / 32T, 5.7 GHz boost)",
      estimatedPrice: 549,
    },
    gpu: {
      name: "GPU",
      spec: "NVIDIA RTX 4070 Ti Super 16 GB GDDR6X",
      estimatedPrice: 799,
    },
    ram: {
      name: "RAM",
      spec: "64 GB (2×32) DDR5-6000 CL30",
      estimatedPrice: 179,
    },
    storage: {
      name: "Storage",
      spec: "2 TB Samsung 990 Pro NVMe PCIe 4.0",
      estimatedPrice: 159,
    },
    motherboard: {
      name: "Motherboard",
      spec: "ASUS ROG Strix X670E-F Gaming WiFi (ATX, AM5)",
      estimatedPrice: 329,
    },
    psu: {
      name: "PSU",
      spec: "Corsair RM1000e 1000W 80+ Gold (Fully Modular)",
      estimatedPrice: 149,
    },
    cooler: {
      name: "Cooler",
      spec: "Arctic Liquid Freezer III 360 (AIO 360mm)",
      estimatedPrice: 89,
    },
    case: {
      name: "Case",
      spec: "Fractal Design North (ATX Mid Tower)",
      estimatedPrice: 139,
    },
    totalEstimatedPrice: 2392,
    highlights: [
      "16 GB VRAM handles 4K Resolve node trees and GPU-accelerated noise reduction",
      "16-core CPU blazes through Adobe Media Encoder batch exports",
      "64 GB RAM allows After Effects RAM previews of complex compositions",
      "2 TB NVMe keeps raw 4K footage accessible without external drives",
    ],
  },

  // ─── 5. 1080p Competitive Gaming ──────────────────────────────────────
  {
    id: "gaming-1080p-budget",
    title: "1080p Esports Destroyer",
    targetAudience: "1080p Competitive Gaming (240Hz+)",
    budgetCategory: "budget",
    cpu: {
      name: "CPU",
      spec: "AMD Ryzen 5 7600 (6C / 12T, 5.1 GHz boost)",
      estimatedPrice: 199,
    },
    gpu: {
      name: "GPU",
      spec: "NVIDIA RTX 4060 8 GB GDDR6",
      estimatedPrice: 299,
    },
    ram: {
      name: "RAM",
      spec: "32 GB (2×16) DDR5-6000 CL30",
      estimatedPrice: 95,
    },
    storage: {
      name: "Storage",
      spec: "1 TB WD Black SN770 NVMe PCIe 4.0",
      estimatedPrice: 65,
    },
    motherboard: {
      name: "Motherboard",
      spec: "MSI B650 Gaming Plus WiFi (ATX, AM5)",
      estimatedPrice: 179,
    },
    psu: {
      name: "PSU",
      spec: "Corsair RM650e 650W 80+ Gold",
      estimatedPrice: 79,
    },
    cooler: {
      name: "Cooler",
      spec: "Thermalright Peerless Assassin 120 SE",
      estimatedPrice: 35,
    },
    case: {
      name: "Case",
      spec: "Phanteks P400A Digital (ATX Mid Tower, mesh)",
      estimatedPrice: 89,
    },
    totalEstimatedPrice: 1040,
    highlights: [
      "Valorant 1080p: 400+ FPS for max refresh rate monitors",
      "CS2 1080p: 300+ FPS consistently",
      "DDR5-6000 tuned for AMD Infinity Fabric 1:1 ratio",
      "Mesh front panel keeps GPU cool during marathon sessions",
    ],
  },

  // ─── 6. 1440p Sweet-Spot Gaming ───────────────────────────────────────
  {
    id: "gaming-1440p-mid",
    title: "1440p Sweet-Spot Build",
    targetAudience: "1440p Gaming (High Refresh, Ray Tracing)",
    budgetCategory: "mid-tier",
    cpu: {
      name: "CPU",
      spec: "AMD Ryzen 7 7800X3D (8C / 16T, 5.0 GHz, 3D V-Cache)",
      estimatedPrice: 369,
    },
    gpu: {
      name: "GPU",
      spec: "NVIDIA RTX 4070 Super 12 GB GDDR6X",
      estimatedPrice: 599,
    },
    ram: {
      name: "RAM",
      spec: "32 GB (2×16) DDR5-6000 CL30",
      estimatedPrice: 95,
    },
    storage: {
      name: "Storage",
      spec: "1 TB Samsung 990 EVO NVMe",
      estimatedPrice: 89,
    },
    motherboard: {
      name: "Motherboard",
      spec: "Gigabyte B650 Aorus Elite AX (ATX, AM5)",
      estimatedPrice: 189,
    },
    psu: {
      name: "PSU",
      spec: "Corsair RM750e 750W 80+ Gold",
      estimatedPrice: 89,
    },
    cooler: {
      name: "Cooler",
      spec: "Thermalright Peerless Assassin 120 SE",
      estimatedPrice: 35,
    },
    case: {
      name: "Case",
      spec: "Lian Li Lancool III (ATX Mid Tower)",
      estimatedPrice: 139,
    },
    totalEstimatedPrice: 1604,
    highlights: [
      "7800X3D's 3D V-Cache delivers best-in-class gaming FPS",
      "Cyberpunk 2077 1440p RT Ultra: ~80 FPS with DLSS",
      "Hogwarts Legacy 1440p Ultra: ~100 FPS",
      "Starfield 1440p High: ~90 FPS",
    ],
  },

  // ─── 7. 4K Enthusiast Gaming ──────────────────────────────────────────
  {
    id: "gaming-4k-flagship",
    title: "4K Enthusiast Dream Build",
    targetAudience: "4K Gaming (Ray Tracing Ultra)",
    budgetCategory: "flagship",
    cpu: {
      name: "CPU",
      spec: "AMD Ryzen 7 9800X3D (8C / 16T, 5.2 GHz, 3D V-Cache)",
      estimatedPrice: 479,
    },
    gpu: {
      name: "GPU",
      spec: "NVIDIA RTX 4080 Super 16 GB GDDR6X",
      estimatedPrice: 979,
    },
    ram: {
      name: "RAM",
      spec: "32 GB (2×16) DDR5-6400 CL32",
      estimatedPrice: 119,
    },
    storage: {
      name: "Storage",
      spec: "2 TB Samsung 990 Pro NVMe PCIe 4.0",
      estimatedPrice: 159,
    },
    motherboard: {
      name: "Motherboard",
      spec: "ASUS ROG Strix X670E-F Gaming WiFi (ATX, AM5)",
      estimatedPrice: 329,
    },
    psu: {
      name: "PSU",
      spec: "Corsair RM1000e 1000W 80+ Gold",
      estimatedPrice: 149,
    },
    cooler: {
      name: "Cooler",
      spec: "Arctic Liquid Freezer III 360 (AIO 360mm)",
      estimatedPrice: 89,
    },
    case: {
      name: "Case",
      spec: "Lian Li O11 Dynamic EVO XL (Full Tower)",
      estimatedPrice: 189,
    },
    totalEstimatedPrice: 2491,
    highlights: [
      "Cyberpunk 2077 4K RT Overdrive: ~60 FPS with DLSS 3",
      "Alan Wake 2 4K RT Max: ~70 FPS with frame generation",
      "2 TB NVMe keeps massive game library fast-loading",
      "Top-tier build for years of 4K gaming ahead",
    ],
  },

  // ─── 8. Office / Basic Productivity ───────────────────────────────────
  {
    id: "office-basic-budget",
    title: "Silent Office Desktop",
    targetAudience: "Office / Basic Productivity",
    budgetCategory: "budget",
    cpu: {
      name: "CPU",
      spec: "AMD Ryzen 5 8600G (6C / 12T, 5.0 GHz, Radeon 760M iGPU)",
      estimatedPrice: 229,
    },
    gpu: {
      name: "GPU",
      spec: "Integrated – AMD Radeon 760M",
      estimatedPrice: 0,
    },
    ram: {
      name: "RAM",
      spec: "16 GB (2×8) DDR5-5600 CL36",
      estimatedPrice: 49,
    },
    storage: {
      name: "Storage",
      spec: "512 GB Kingston NV2 NVMe",
      estimatedPrice: 32,
    },
    motherboard: {
      name: "Motherboard",
      spec: "Gigabyte B650M DS3H (mATX, AM5)",
      estimatedPrice: 119,
    },
    psu: {
      name: "PSU",
      spec: "Corsair RM550e 550W 80+ Gold (Fanless at idle)",
      estimatedPrice: 69,
    },
    cooler: {
      name: "Cooler",
      spec: "AMD Wraith Stealth (Stock, included)",
      estimatedPrice: 0,
    },
    case: {
      name: "Case",
      spec: "Fractal Design Pop Mini Silent (mATX, sound-dampened)",
      estimatedPrice: 89,
    },
    totalEstimatedPrice: 587,
    highlights: [
      "Near-silent operation — ideal for open offices",
      "Radeon 760M iGPU handles dual 4K displays",
      "AM5 socket allows future CPU upgrades",
      "Perfect for Google Workspace, Excel, Slack, and video calls",
    ],
  },

  // ─── 9. Office / Heavy Multi-Screen Financial ────────────────────────
  {
    id: "office-heavy-mid",
    title: "Multi-Monitor Power Desktop",
    targetAudience: "Office – Heavy Multi-Screen Financial / Data Modeling",
    budgetCategory: "mid-tier",
    cpu: {
      name: "CPU",
      spec: "Intel Core i7-14700 (20C / 28T, 5.4 GHz boost)",
      estimatedPrice: 339,
    },
    gpu: {
      name: "GPU",
      spec: "NVIDIA RTX A2000 12 GB (Workstation, 4× DisplayPort)",
      estimatedPrice: 499,
    },
    ram: {
      name: "RAM",
      spec: "64 GB (2×32) DDR5-5600 CL36",
      estimatedPrice: 159,
    },
    storage: {
      name: "Storage",
      spec: "1 TB Samsung 990 EVO NVMe",
      estimatedPrice: 89,
    },
    motherboard: {
      name: "Motherboard",
      spec: "ASUS ProArt B660-Creator D4 (ATX, LGA1700)",
      estimatedPrice: 179,
    },
    psu: {
      name: "PSU",
      spec: "Corsair RM650e 650W 80+ Gold",
      estimatedPrice: 79,
    },
    cooler: {
      name: "Cooler",
      spec: "Noctua NH-U12S redux (Single Tower, quiet)",
      estimatedPrice: 59,
    },
    case: {
      name: "Case",
      spec: "Fractal Design Define 7 Compact (ATX, sound-dampened)",
      estimatedPrice: 139,
    },
    totalEstimatedPrice: 1542,
    highlights: [
      "RTX A2000 drives up to 4× 4K monitors natively",
      "64 GB RAM handles massive Excel models and Bloomberg terminals",
      "Workstation GPU avoids driver crashes in financial apps",
      "Professional, quiet aesthetic for client-facing environments",
    ],
  },

  // ─── 10. General College Student ──────────────────────────────────────
  {
    id: "college-general-budget",
    title: "Budget All-Rounder for College",
    targetAudience: "General College Student (Non-Tech / Arts / General Eng)",
    budgetCategory: "budget",
    cpu: {
      name: "CPU",
      spec: "AMD Ryzen 5 7600 (6C / 12T, 5.1 GHz boost)",
      estimatedPrice: 199,
    },
    gpu: {
      name: "GPU",
      spec: "NVIDIA RTX 4060 8 GB GDDR6",
      estimatedPrice: 299,
    },
    ram: {
      name: "RAM",
      spec: "16 GB (2×8) DDR5-5600 CL36",
      estimatedPrice: 49,
    },
    storage: {
      name: "Storage",
      spec: "512 GB Kingston NV2 NVMe",
      estimatedPrice: 32,
    },
    motherboard: {
      name: "Motherboard",
      spec: "MSI B650M Gaming Plus WiFi (mATX, AM5)",
      estimatedPrice: 139,
    },
    psu: {
      name: "PSU",
      spec: "Thermaltake Toughpower GF1 650W 80+ Gold",
      estimatedPrice: 69,
    },
    cooler: {
      name: "Cooler",
      spec: "DeepCool AK400 (Single Tower)",
      estimatedPrice: 25,
    },
    case: {
      name: "Case",
      spec: "NZXT H5 Flow (ATX Mid Tower)",
      estimatedPrice: 89,
    },
    totalEstimatedPrice: 901,
    highlights: [
      "Handles everything from Netflix to Blender learning projects",
      "Dedicated GPU adds flexibility for future interests",
      "Compact mATX build fits in dorm rooms",
      "AM5 upgrade path extends the system's useful life",
    ],
  },
];
