import { Component, type ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[RigAssigner Error Boundary]", error, errorInfo);
  }

  handleReset = () => {
    // Clear any corrupted localStorage state
    try {
      localStorage.removeItem("rigassigner_price_sync");
    } catch {
      // ignore
    }
    // Navigate to clean root
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            {/* Glowing error icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.15)]">
              <AlertTriangle className="w-10 h-10 text-red-400" />
            </div>

            <h1 className="text-2xl font-bold text-slate-100 mb-3">
              Something went sideways
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed mb-2">
              Your hardware configuration encountered an unexpected error.
            </p>
            <p className="text-slate-500 text-xs mb-8 font-mono bg-slate-900/60 rounded-lg px-4 py-3 border border-slate-800">
              {this.state.error?.message || "Unknown error"}
            </p>

            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all duration-300"
            >
              <RotateCcw className="w-4 h-4" />
              Reset &amp; Reload
            </button>

            <p className="text-slate-600 text-xs mt-6">
              RigAssigner v1.0.0
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
