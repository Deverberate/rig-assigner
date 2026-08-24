import { Cpu } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
      <div className="text-center">
        <Cpu className="mx-auto mb-4 h-12 w-12 text-cyan-400" />
        <h1 className="text-3xl font-bold">Hardware Matcher</h1>
        <p className="mt-2 text-slate-400">Phase 1 — scaffold complete</p>
      </div>
    </div>
  );
}
