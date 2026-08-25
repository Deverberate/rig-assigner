import type { PartCatalogItem } from "../types";

/** Generate a styled hardware silhouette SVG placeholder */
function hwImg(label: string, bg: string, icon: string): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'>
    <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='${bg}'/><stop offset='100%' stop-color='%230f172a'/></linearGradient></defs>
    <rect width='120' height='120' rx='10' fill='url(%23g)'/>
    <g transform='translate(60,42)' fill='none' stroke='rgba(255,255,255,0.25)' stroke-width='1.5'>${icon}</g>
    <text x='60' y='82' text-anchor='middle' fill='rgba(255,255,255,0.7)' font-family='system-ui,sans-serif' font-size='9' font-weight='600'>${label}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// Hardware silhouette paths
const CPU_ICO = '<rect x="-18" y="-18" width="36" height="36" rx="3"/><line x1="-12" y1="-24" x2="-12" y2="-18"/><line x1="-4" y1="-24" x2="-4" y2="-18"/><line x1="4" y1="-24" x2="4" y2="-18"/><line x1="12" y1="-24" x2="12" y2="-18"/><line x1="-12" y1="18" x2="-12" y2="24"/><line x1="-4" y1="18" x2="-4" y2="24"/><line x1="4" y1="18" x2="4" y2="24"/><line x1="12" y1="18" x2="12" y2="24"/>';
const GPU_ICO = '<rect x="-24" y="-12" width="48" height="24" rx="3"/><circle cx="-14" cy="0" r="6"/><circle cx="0" cy="0" r="6"/><circle cx="14" cy="0" r="6"/><line x1="-24" y1="-12" x2="-28" y2="-12"/><line x1="-24" y1="-6" x2="-28" y2="-6"/>';
const RAM_ICO = '<rect x="-20" y="-24" width="40" height="48" rx="2"/><line x1="-14" y1="-18" x2="-14" y2="18"/><line x1="-7" y1="-18" x2="-7" y2="18"/><line x1="0" y1="-18" x2="0" y2="18"/><line x1="7" y1="-18" x2="7" y2="18"/><line x1="14" y1="-18" x2="14" y2="18"/>';
const MB_ICO = '<rect x="-24" y="-18" width="48" height="36" rx="3"/><rect x="-16" y="-10" width="10" height="10" rx="1"/><rect x="2" y="-10" width="10" height="10" rx="1"/><line x1="-24" y1="8" x2="24" y2="8"/><line x1="-20" y1="12" x2="-12" y2="12"/><line x1="-8" y1="12" x2="0" y2="12"/>';
const SSD_ICO = '<rect x="-20" y="-8" width="40" height="16" rx="2"/><circle cx="14" cy="0" r="2"/><line x1="-14" y1="-3" x2="-4" y2="-3"/><line x1="-14" y1="3" x2="0" y2="3"/>';
const PSU_ICO = '<rect x="-20" y="-14" width="40" height="28" rx="3"/><circle cx="0" cy="-2" r="8" stroke-dasharray="3 2"/><line x1="-14" y1="10" x2="-8" y2="10"/><line x1="-4" y1="10" x2="4" y2="10"/><line x1="8" y1="10" x2="14" y2="10"/>';
const COOLER_ICO = '<circle cx="0" cy="-2" r="14" stroke-dasharray="4 2"/><circle cx="0" cy="-2" r="4"/><line x1="0" y1="-16" x2="0" y2="12"/>';
const AIO_ICO = '<rect x="-20" y="-14" width="40" height="28" rx="2"/><circle cx="0" cy="0" r="8" stroke-dasharray="3 2"/><circle cx="0" cy="0" r="3"/><line x1="0" y1="14" x2="0" y2="20"/><line x1="-8" y1="20" x2="8" y2="20"/>';
const CASE_ICO = '<rect x="-18" y="-22" width="36" height="44" rx="3"/><rect x="-14" y="-18" width="28" height="24" rx="1"/><line x1="-14" y1="10" x2="14" y2="10"/>';

const AMD_CPU = hwImg("AMD Ryzen", "#1e40af", CPU_ICO);
const INTEL_CPU = hwImg("Intel Core", "#1e3a5f", CPU_ICO);
const NVIDIA_GPU = hwImg("NVIDIA RTX", "#16a34a", GPU_ICO);
const AMD_GPU = hwImg("AMD Radeon", "#dc2626", GPU_ICO);
const RAM_IMG = hwImg("DDR5 RAM", "#7c3aed", RAM_ICO);
const AM5_MB = hwImg("AM5 Board", "#0891b2", MB_ICO);
const LGA_MB = hwImg("LGA1700 Board", "#0e7490", MB_ICO);
const SSD_IMG = hwImg("NVMe SSD", "#ca8a04", SSD_ICO);
const PSU_IMG = hwImg("PSU", "#64748b", PSU_ICO);
const AIR_COOLER = hwImg("Air Cooler", "#0d9488", COOLER_ICO);
const AIO_IMG = hwImg("AIO Liquid", "#0f766e", AIO_ICO);
const ATX_CASE = hwImg("ATX Tower", "#6366f1", CASE_ICO);

export const partsCatalog: PartCatalogItem[] = [
  // ─── CPUs ─────────────────────────────────────────────────────
  {
    id: "cpu_7800x3d", category: "cpu", name: "AMD Ryzen 7 7800X3D", brand: "AMD",
    priceUSD: 369, priceINR: 30999,
    specs: ["8C / 16T", "4.2–5.0 GHz", "96MB L3 Cache", "120W TDP", "AM5 Socket"],
    tdpWatts: 120, socket: "AM5", imageUrl: AMD_CPU,
    storeLinks: [
      { store: "Amazon", url: "https://www.amazon.com/s?k=7800X3D", livePrice: 369 },
      { store: "MicroCenter", url: "https://www.microcenter.com/search/search_results.aspx?Ntt=7800X3D", livePrice: 359 },
    ],
  },
  {
    id: "cpu_9800x3d", category: "cpu", name: "AMD Ryzen 9 9800X3D", brand: "AMD",
    priceUSD: 479, priceINR: 39999,
    specs: ["8C / 16T", "4.7–5.2 GHz", "96MB L3 Cache", "120W TDP", "AM5 Socket"],
    tdpWatts: 120, socket: "AM5", imageUrl: AMD_CPU,
    storeLinks: [{ store: "Amazon", url: "https://www.amazon.com/s?k=9800X3D", livePrice: 479 }],
  },
  {
    id: "cpu_9700x", category: "cpu", name: "AMD Ryzen 7 9700X", brand: "AMD",
    priceUSD: 299, priceINR: 24999,
    specs: ["8C / 16T", "3.8–5.5 GHz", "65W TDP", "AM5 Socket"],
    tdpWatts: 65, socket: "AM5", imageUrl: AMD_CPU,
    storeLinks: [{ store: "Amazon", url: "https://www.amazon.com/s?k=9700X", livePrice: 299 }],
  },
  {
    id: "cpu_7600x", category: "cpu", name: "AMD Ryzen 5 7600X", brand: "AMD",
    priceUSD: 199, priceINR: 16499,
    specs: ["6C / 12T", "4.7–5.3 GHz", "105W TDP", "AM5 Socket"],
    tdpWatts: 105, socket: "AM5", imageUrl: AMD_CPU,
    storeLinks: [{ store: "Amazon", url: "https://www.amazon.com/s?k=7600X", livePrice: 199 }],
  },
  {
    id: "cpu_7900x", category: "cpu", name: "AMD Ryzen 9 7900X", brand: "AMD",
    priceUSD: 399, priceINR: 33499,
    specs: ["12C / 24T", "4.7–5.6 GHz", "170W TDP", "AM5 Socket"],
    tdpWatts: 170, socket: "AM5", imageUrl: AMD_CPU,
    storeLinks: [{ store: "Amazon", url: "https://www.amazon.com/s?k=7900X", livePrice: 399 }],
  },
  {
    id: "cpu_i5_13600k", category: "cpu", name: "Intel Core i5-13600K", brand: "Intel",
    priceUSD: 259, priceINR: 21499,
    specs: ["14C (6P+8E) / 20T", "3.5–5.1 GHz", "125W TDP", "LGA 1700"],
    tdpWatts: 125, socket: "LGA 1700", imageUrl: INTEL_CPU,
    storeLinks: [{ store: "Amazon", url: "https://www.amazon.com/s?k=i5-13600K", livePrice: 259 }],
  },
  {
    id: "cpu_i7_14700k", category: "cpu", name: "Intel Core i7-14700K", brand: "Intel",
    priceUSD: 369, priceINR: 30999,
    specs: ["20C (8P+12E) / 28T", "3.4–5.6 GHz", "125W TDP", "LGA 1700"],
    tdpWatts: 125, socket: "LGA 1700", imageUrl: INTEL_CPU,
    storeLinks: [{ store: "Amazon", url: "https://www.amazon.com/s?k=i7-14700K", livePrice: 369 }],
  },

  // ─── GPUs ─────────────────────────────────────────────────────
  {
    id: "gpu_4060ti", category: "gpu", name: "NVIDIA GeForce RTX 4060 Ti 8GB", brand: "NVIDIA",
    priceUSD: 399, priceINR: 33499,
    specs: ["4,352 CUDA Cores", "8GB GDDR6", "160W TDP", "DLSS 3"],
    tdpWatts: 160, imageUrl: NVIDIA_GPU,
    storeLinks: [{ store: "Amazon", url: "https://www.amazon.com/s?k=RTX+4060+Ti", livePrice: 399 }],
  },
  {
    id: "gpu_4070super", category: "gpu", name: "NVIDIA GeForce RTX 4070 Super", brand: "NVIDIA",
    priceUSD: 599, priceINR: 49999,
    specs: ["7,168 CUDA Cores", "12GB GDDR6X", "220W TDP", "DLSS 3"],
    tdpWatts: 220, imageUrl: NVIDIA_GPU,
    storeLinks: [{ store: "Amazon", url: "https://www.amazon.com/s?k=RTX+4070+Super", livePrice: 599 }],
  },
  {
    id: "gpu_4070tisuper", category: "gpu", name: "NVIDIA GeForce RTX 4070 Ti Super", brand: "NVIDIA",
    priceUSD: 799, priceINR: 66499,
    specs: ["8,448 CUDA Cores", "16GB GDDR6X", "285W TDP", "DLSS 3"],
    tdpWatts: 285, imageUrl: NVIDIA_GPU,
    storeLinks: [{ store: "Amazon", url: "https://www.amazon.com/s?k=RTX+4070+Ti+Super", livePrice: 799 }],
  },
  {
    id: "gpu_4080super", category: "gpu", name: "NVIDIA GeForce RTX 4080 Super", brand: "NVIDIA",
    priceUSD: 999, priceINR: 82999,
    specs: ["10,240 CUDA Cores", "16GB GDDR6X", "320W TDP", "DLSS 3"],
    tdpWatts: 320, imageUrl: NVIDIA_GPU,
    storeLinks: [{ store: "Amazon", url: "https://www.amazon.com/s?k=RTX+4080+Super", livePrice: 999 }],
  },
  {
    id: "gpu_4090", category: "gpu", name: "NVIDIA GeForce RTX 4090", brand: "NVIDIA",
    priceUSD: 1599, priceINR: 132999,
    specs: ["16,384 CUDA Cores", "24GB GDDR6X", "450W TDP", "DLSS 3"],
    tdpWatts: 450, imageUrl: NVIDIA_GPU,
    storeLinks: [{ store: "Amazon", url: "https://www.amazon.com/s?k=RTX+4090", livePrice: 1599 }],
  },
  {
    id: "gpu_rx7800xt", category: "gpu", name: "AMD Radeon RX 7800 XT", brand: "AMD",
    priceUSD: 499, priceINR: 41499,
    specs: ["3,840 Stream Processors", "16GB GDDR6", "263W TDP", "FSR 3"],
    tdpWatts: 263, imageUrl: AMD_GPU,
    storeLinks: [{ store: "Amazon", url: "https://www.amazon.com/s?k=RX+7800+XT", livePrice: 499 }],
  },

  // ─── RAM ──────────────────────────────────────────────────────
  {
    id: "ram_16gb_ddr5", category: "ram", name: "16GB (2×8GB) DDR5-5600 CL36", brand: "Corsair",
    priceUSD: 45, priceINR: 3799,
    specs: ["16GB (2×8GB)", "DDR5-5600 MT/s", "CL36 Latency"],
    tdpWatts: 5, imageUrl: RAM_IMG,
    storeLinks: [{ store: "Amazon", url: "https://www.amazon.com/s?k=16GB+DDR5+5600", livePrice: 45 }],
  },
  {
    id: "ram_32gb_ddr5", category: "ram", name: "32GB (2×16GB) DDR5-6000 CL30", brand: "G.Skill",
    priceUSD: 95, priceINR: 7999,
    specs: ["32GB (2×16GB)", "DDR5-6000 MT/s", "CL30 Latency", "Dual-Rank"],
    tdpWatts: 5, imageUrl: RAM_IMG,
    storeLinks: [{ store: "Amazon", url: "https://www.amazon.com/s?k=32GB+DDR5+6000+CL30", livePrice: 95 }],
  },
  {
    id: "ram_64gb_ddr5", category: "ram", name: "64GB (2×32GB) DDR5-5600 CL36", brand: "Corsair",
    priceUSD: 179, priceINR: 14999,
    specs: ["64GB (2×32GB)", "DDR5-5600 MT/s", "CL36 Latency"],
    tdpWatts: 5, imageUrl: RAM_IMG,
    storeLinks: [{ store: "Amazon", url: "https://www.amazon.com/s?k=64GB+DDR5", livePrice: 179 }],
  },
  {
    id: "ram_32gb_ddr4", category: "ram", name: "32GB (2×16GB) DDR4-3600 CL16", brand: "Kingston",
    priceUSD: 55, priceINR: 4599,
    specs: ["32GB (2×16GB)", "DDR4-3600 MT/s", "CL16 Latency"],
    tdpWatts: 5, imageUrl: RAM_IMG,
    storeLinks: [{ store: "Amazon", url: "https://www.amazon.com/s?k=32GB+DDR4+3600", livePrice: 55 }],
  },

  // ─── Motherboards ─────────────────────────────────────────────
  {
    id: "mb_b650_tomahawk", category: "motherboard", name: "MSI MAG B650 TOMAHAWK WiFi", brand: "MSI",
    priceUSD: 199, priceINR: 16999,
    specs: ["AM5 Socket", "B650 Chipset", "DDR5 up to 6400+", "3× M.2 (1× Gen5)", "WiFi 6E"],
    tdpWatts: 0, socket: "AM5", formFactor: "ATX", imageUrl: AM5_MB,
    storeLinks: [{ store: "Amazon", url: "https://www.amazon.com/s?k=B650+Tomahawk", livePrice: 199 }],
  },
  {
    id: "mb_b650m_ds3h", category: "motherboard", name: "Gigabyte B650M DS3H", brand: "Gigabyte",
    priceUSD: 109, priceINR: 9299,
    specs: ["AM5 Socket", "B650 Chipset", "DDR5 up to 6400+", "2× M.2", "WiFi 6E"],
    tdpWatts: 0, socket: "AM5", formFactor: "mATX", imageUrl: AM5_MB,
    storeLinks: [{ store: "Amazon", url: "https://www.amazon.com/s?k=B650M+DS3H", livePrice: 109 }],
  },
  {
    id: "mb_x670e_rog", category: "motherboard", name: "ASUS ROG Strix X670E-F Gaming WiFi", brand: "ASUS",
    priceUSD: 379, priceINR: 31499,
    specs: ["AM5 Socket", "X670E Chipset", "DDR5 up to 6400+", "4× M.2 (2× Gen5)", "WiFi 6E", "USB4"],
    tdpWatts: 0, socket: "AM5", formFactor: "ATX", imageUrl: AM5_MB,
    storeLinks: [{ store: "Amazon", url: "https://www.amazon.com/s?k=X670E+ROG+Strix", livePrice: 379 }],
  },
  {
    id: "mb_b760m_ds3h", category: "motherboard", name: "Gigabyte B760M DS3H DDR5", brand: "Gigabyte",
    priceUSD: 109, priceINR: 9299,
    specs: ["LGA 1700", "B760 Chipset", "DDR5 up to 5600", "2× M.2", "WiFi 6E"],
    tdpWatts: 0, socket: "LGA 1700", formFactor: "mATX", imageUrl: LGA_MB,
    storeLinks: [{ store: "Amazon", url: "https://www.amazon.com/s?k=B760M+DS3H", livePrice: 109 }],
  },
  {
    id: "mb_z790_rog", category: "motherboard", name: "ASUS ROG Strix Z790-A Gaming WiFi II", brand: "ASUS",
    priceUSD: 299, priceINR: 24999,
    specs: ["LGA 1700", "Z790 Chipset", "DDR5 up to 7200+", "4× M.2", "WiFi 6E"],
    tdpWatts: 0, socket: "LGA 1700", formFactor: "ATX", imageUrl: LGA_MB,
    storeLinks: [{ store: "Amazon", url: "https://www.amazon.com/s?k=Z790+ROG+Strix", livePrice: 299 }],
  },

  // ─── Storage ──────────────────────────────────────────────────
  {
    id: "ssd_1tb_980pro", category: "storage", name: "Samsung 980 PRO 1TB NVMe Gen4", brand: "Samsung",
    priceUSD: 89, priceINR: 7499,
    specs: ["1TB", "PCIe Gen4 x4", "7,000 MB/s Read", "5,100 MB/s Write"],
    tdpWatts: 8, imageUrl: SSD_IMG,
    storeLinks: [{ store: "Amazon", url: "https://www.amazon.com/s?k=Samsung+980+PRO+1TB", livePrice: 89 }],
  },
  {
    id: "ssd_2tb_990pro", category: "storage", name: "Samsung 990 PRO 2TB NVMe Gen4", brand: "Samsung",
    priceUSD: 169, priceINR: 13999,
    specs: ["2TB", "PCIe Gen4 x4", "7,450 MB/s Read", "6,900 MB/s Write", "1200 TBW"],
    tdpWatts: 8, imageUrl: SSD_IMG,
    storeLinks: [{ store: "Amazon", url: "https://www.amazon.com/s?k=Samsung+990+PRO+2TB", livePrice: 169 }],
  },
  {
    id: "ssd_1tb_sn580", category: "storage", name: "WD Blue SN580 1TB NVMe Gen4", brand: "Western Digital",
    priceUSD: 59, priceINR: 4999,
    specs: ["1TB", "PCIe Gen4 x4", "4,150 MB/s Read", "4,150 MB/s Write"],
    tdpWatts: 5, imageUrl: SSD_IMG,
    storeLinks: [{ store: "Amazon", url: "https://www.amazon.com/s?k=WD+SN580+1TB", livePrice: 59 }],
  },
  {
    id: "ssd_2tb_p3plus", category: "storage", name: "Crucial P3 Plus 2TB NVMe Gen4", brand: "Crucial",
    priceUSD: 109, priceINR: 9099,
    specs: ["2TB", "PCIe Gen4 x4", "5,000 MB/s Read"],
    tdpWatts: 5, imageUrl: SSD_IMG,
    storeLinks: [{ store: "Amazon", url: "https://www.amazon.com/s?k=Crucial+P3+Plus+2TB", livePrice: 109 }],
  },

  // ─── PSUs ─────────────────────────────────────────────────────
  {
    id: "psu_550_cv", category: "psu", name: "Corsair CV550 550W 80+ Bronze", brand: "Corsair",
    priceUSD: 49, priceINR: 4199,
    specs: ["550W", "80+ Bronze", "Non-Modular", "3-Year Warranty"],
    tdpWatts: 0, imageUrl: PSU_IMG,
    storeLinks: [{ store: "Amazon", url: "https://www.amazon.com/s?k=Corsair+CV550", livePrice: 49 }],
  },
  {
    id: "psu_650_g7", category: "psu", name: "EVGA SuperNOVA 650 G7 650W 80+ Gold", brand: "EVGA",
    priceUSD: 89, priceINR: 7499,
    specs: ["650W", "80+ Gold", "Fully Modular", "10-Year Warranty"],
    tdpWatts: 0, imageUrl: PSU_IMG,
    storeLinks: [{ store: "Amazon", url: "https://www.amazon.com/s?k=EVGA+650+G7", livePrice: 89 }],
  },
  {
    id: "psu_750_rm750e", category: "psu", name: "Corsair RM750e 750W 80+ Gold", brand: "Corsair",
    priceUSD: 99, priceINR: 8299,
    specs: ["750W", "80+ Gold", "Fully Modular", "Zero RPM Mode", "10-Year Warranty"],
    tdpWatts: 0, imageUrl: PSU_IMG,
    storeLinks: [{ store: "Amazon", url: "https://www.amazon.com/s?k=Corsair+RM750e", livePrice: 99 }],
  },
  {
    id: "psu_850_rmx", category: "psu", name: "Corsair RM850x 850W 80+ Gold", brand: "Corsair",
    priceUSD: 139, priceINR: 11699,
    specs: ["850W", "80+ Gold", "Fully Modular", "Zero RPM Mode", "10-Year Warranty"],
    tdpWatts: 0, imageUrl: PSU_IMG,
    storeLinks: [{ store: "Amazon", url: "https://www.amazon.com/s?k=Corsair+RM850x", livePrice: 139 }],
  },
  {
    id: "psu_1000_gx", category: "psu", name: "SeaSonic Focus GX-1000 1000W 80+ Gold", brand: "SeaSonic",
    priceUSD: 179, priceINR: 14999,
    specs: ["1000W", "80+ Gold", "Fully Modular", "10-Year Warranty"],
    tdpWatts: 0, imageUrl: PSU_IMG,
    storeLinks: [{ store: "Amazon", url: "https://www.amazon.com/s?k=SeaSonic+Focus+GX-1000", livePrice: 179 }],
  },

  // ─── Coolers ──────────────────────────────────────────────────
  {
    id: "cooler_stock", category: "cooler", name: "AMD Wraith Stealth (Included)", brand: "AMD",
    priceUSD: 0, priceINR: 0,
    specs: ["Top-Down Air", "65W TDP Rating", "Included with CPU"],
    tdpWatts: 0, imageUrl: AIR_COOLER,
  },
  {
    id: "cooler_pa120se", category: "cooler", name: "Thermalright Peerless Assassin 120 SE", brand: "Thermalright",
    priceUSD: 35, priceINR: 2999,
    specs: ["Dual-Tower Air", "2× 120mm Fans", "260W+ TDP Rating", "<25 dBA"],
    tdpWatts: 0, imageUrl: AIR_COOLER,
    storeLinks: [{ store: "Amazon", url: "https://www.amazon.com/s?k=Peerless+Assassin+120", livePrice: 35 }],
  },
  {
    id: "cooler_nh_d15", category: "cooler", name: "Noctua NH-D15 chromax.black", brand: "Noctua",
    priceUSD: 109, priceINR: 9099,
    specs: ["Dual-Tower Air", "2× 140mm Fans", "250W+ TDP Rating", "<24 dBA", "6-Year Warranty"],
    tdpWatts: 0, imageUrl: AIR_COOLER,
    storeLinks: [{ store: "Amazon", url: "https://www.amazon.com/s?k=Noctua+NH-D15", livePrice: 109 }],
  },
  {
    id: "cooler_aquaelite240", category: "cooler", name: "Thermalright Aqua Elite 240 V3", brand: "Thermalright",
    priceUSD: 55, priceINR: 4599,
    specs: ["240mm AIO", "2× 120mm ARGB Fans", "<28 dBA"],
    tdpWatts: 0, imageUrl: AIO_IMG,
    storeLinks: [{ store: "Amazon", url: "https://www.amazon.com/s?k=Aqua+Elite+240", livePrice: 55 }],
  },

  // ─── Cases ────────────────────────────────────────────────────
  {
    id: "case_pop_xl", category: "case", name: "Fractal Design Pop XL Air", brand: "Fractal",
    priceUSD: 119, priceINR: 9999,
    specs: ["ATX Mid-Tower", "Mesh Front", "4× Fans", "405mm GPU Clearance"],
    tdpWatts: 0, formFactor: "ATX", imageUrl: ATX_CASE,
    storeLinks: [{ store: "Amazon", url: "https://www.amazon.com/s?k=Fractal+Pop+XL", livePrice: 119 }],
  },
  {
    id: "case_h5_flow", category: "case", name: "NZXT H5 Flow", brand: "NZXT",
    priceUSD: 94, priceINR: 7999,
    specs: ["ATX Mid-Tower", "Perforated Panels", "2× Fans", "365mm GPU Clearance"],
    tdpWatts: 0, formFactor: "ATX", imageUrl: ATX_CASE,
    storeLinks: [{ store: "Amazon", url: "https://www.amazon.com/s?k=NZXT+H5+Flow", livePrice: 94 }],
  },
  {
    id: "case_nr600", category: "case", name: "Cooler Master NR600", brand: "Cooler Master",
    priceUSD: 79, priceINR: 6699,
    specs: ["ATX Mid-Tower", "Mesh Front", "2× Fans", "410mm GPU Clearance"],
    tdpWatts: 0, formFactor: "ATX", imageUrl: ATX_CASE,
    storeLinks: [{ store: "Amazon", url: "https://www.amazon.com/s?k=Cooler+Master+NR600", livePrice: 79 }],
  },
  {
    id: "case_h7_flow", category: "case", name: "NZXT H7 Flow", brand: "NZXT",
    priceUSD: 129, priceINR: 10999,
    specs: ["ATX Mid-Tower", "Full Mesh", "3× Fans", "400mm GPU Clearance"],
    tdpWatts: 0, formFactor: "ATX", imageUrl: ATX_CASE,
    storeLinks: [{ store: "Amazon", url: "https://www.amazon.com/s?k=NZXT+H7+Flow", livePrice: 129 }],
  },
];

export const PART_CATEGORY_LABELS: Record<string, string> = {
  cpu: "Processor", gpu: "Graphics Card", ram: "Memory / RAM",
  storage: "Storage / SSD", motherboard: "Motherboard", psu: "Power Supply",
  cooler: "CPU Cooler", case: "PC Case",
};

export const PART_CATEGORY_ORDER = [
  "cpu", "gpu", "ram", "storage", "motherboard", "psu", "cooler", "case",
] as const;
