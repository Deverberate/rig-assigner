# Rig Assigner ⚡

> A frictionless, zero-auth hardware recommendation engine and PCPartPicker-style custom PC workbench. Built with React, TypeScript, Vite, Tailwind CSS, and Framer Motion.

[![Live Demo](https://img.shields.io/badge/Live_Demo-rig--assigner.vercel.app-06b6d4?style=flat-square&logo=vercel)](https://rig-assigner.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.0+-61dafb?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.0+-646cff?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

---

## ⚡ Overview

**Rig Assigner** simplifies the hardware selection process across three device ecosystems: **Desktop PCs, Laptops, and Smartphones**. 

Users can either take a dynamic workload-based wizard to receive an optimized recommendation or build a custom desktop rig from scratch using an 8-slot interactive workbench with real-time hardware compatibility validation.

---

## 🛠️ Core Features

* **AI-Guided Recommendation Engine:** Multi-category wizard tailored for Gaming, Creative Work, Heavy Computation, and Everyday Productivity.
* **Custom PC Workbench (PCPartPicker-Style):** 8-slot component picker (CPU, GPU, Motherboard, RAM, Storage, PSU, Cooler, Case) with live search, brand filtering, and real-time total price calculations.
* **Hardware Compatibility Engine:** Validates CPU socket/motherboard compatibility and calculates estimated TDP against recommended PSU wattage.
* **Universal Cross-Device Comparison Matrix:** Side-by-side spec comparison across laptops, phones, and custom rigs with real-time price and hardware diffs.
* **Tactile Micro-Interactions & Animations:** Direction-aware slide transitions with Framer Motion, spring button feedback, Web Vibration API haptics, and morphing action indicators.
* **Zero-Database Sharing:** Deep link state persistence via URL query parameters (`?mode=builder&parts=...`) for instant build sharing.
* **Spec Sheet Exports:** Direct client-side download of clean Markdown (`.md`) formatted for Reddit (`r/buildapc`) and Discord, alongside plain text (`.txt`) exports.

---

## 🧰 Tech Stack

* **Frontend:** React 18, TypeScript, Vite
* **Styling & UI:** Tailwind CSS, Lucide React Icons
* **Animations:** Framer Motion
* **Deployment:** Vercel (CI/CD via GitHub)
* **Analytics:** Vercel Web Analytics

---

## 🚀 Getting Started Locally

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18 or higher) installed.

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/Deverberate/rig-assigner.git](https://github.com/Deverberate/rig-assigner.git)
   cd rig-assigner
2. Install dependencies:
npm install
3. Start the local development server:
npm run dev
4. Build for production:
npm run build


📂 Project Structure
Plaintext
rig-assigner/
├── public/                 # Static assets & icons
├── src/
│   ├── components/         # React UI components
│   │   ├── QuizWizard.tsx          # Dynamic multi-device quiz
│   │   ├── CustomPCBuilder.tsx     # 8-slot manual workbench
│   │   ├── PartSelectorModal.tsx   # Searchable part picker modal
│   │   ├── ResultsDashboard.tsx    # Spec cards, comparison matrix & exports
│   │   └── ComponentDetailModal.tsx# Deep-dive specs & review sentiments
│   ├── data/               # Curated hardware presets & parts catalogs
│   │   ├── presets.ts              # PC preset builds
│   │   ├── laptopPresets.ts        # Curated laptops
│   │   ├── phonePresets.ts         # Curated smartphones
│   │   ├── partsCatalog.ts         # 8-category workbench catalog
│   │   └── peripherals.ts          # Curated accessories
│   ├── utils/              # Business logic & hardware validators
│   │   ├── matcher.ts              # Recommendation dispatchers
│   │   ├── haptics.ts              # Web vibration utility
│   │   └── priceSync.ts            # Price feed & cache logic
│   ├── types.ts            # TypeScript interfaces & domain types
│   ├── App.tsx             # Root router & URL state manager
│   └── main.tsx            # Application entry point
├── package.json
└── vite.config.ts



📄 License
This project is open source and available under the MIT License.
