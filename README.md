# ⚡ RigAssigner — Intelligent Hardware Matcher

RigAssigner is a dynamic PC hardware recommendation engine built with **React**, **TypeScript**, and **Tailwind CSS**. It eliminates guesswork by matching users with balanced, workload-specific PC build configurations.

---

## 🎯 Key Features

- **Workload-Specific Branching:** Tailored recommendations for:
  - **College & Engineering:** CS/AI-ML (CUDA & high RAM) vs. Mechanical/Civil (CAD single-core IPC).
  - **Content Creation:** 1080p social media timelines vs. heavy 4K/6K DaVinci Resolve & VFX.
  - **Gaming:** 1080p high-refresh esports to 4K Ultra ray tracing.
  - **Productivity:** Silent mini-PCs and heavy multi-monitor setups.
- **Deterministic Preset Matching:** Zero AI hallucinations—all parts are pre-validated for socket compatibility, thermals, and power delivery.
- **Detailed Component Specs:** Part breakdowns (CPU, GPU, RAM, Storage, PSU, Motherboard, Case, Cooler) with estimated pricing and workload justifications.

---

## 🛠️ Tech Stack

- **Framework:** React + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone [https://github.com/YOUR_USERNAME/rig-assigner.git](https://github.com/YOUR_USERNAME/rig-assigner.git)

# Navigate into directory
cd rig-assigner

# Install dependencies
npm install

# Start development server
npm run dev
