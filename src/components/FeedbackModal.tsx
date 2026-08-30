import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bug, DollarSign, Package, Lightbulb } from "lucide-react";

const ISSUE_TYPES = [
  { id: "price", label: "Inaccurate Price", icon: DollarSign },
  { id: "missing", label: "Missing Part", icon: Package },
  { id: "bug", label: "UI Bug", icon: Bug },
  { id: "feature", label: "Feature Request", icon: Lightbulb },
] as const;

type IssueType = (typeof ISSUE_TYPES)[number]["id"];

export default function FeedbackModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [issueType, setIssueType] = useState<IssueType | null>(null);
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen]);

  // Focus textarea on open
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!issueType || !description.trim()) return;

    const subject = encodeURIComponent(`[RigAssigner] ${ISSUE_TYPES.find((t) => t.id === issueType)?.label}`);
    const body = encodeURIComponent(
      `Issue Type: ${ISSUE_TYPES.find((t) => t.id === issueType)?.label}\n` +
      `URL: ${window.location.href}\n` +
      `Device: ${navigator.userAgent}\n\n` +
      `Description:\n${description}`
    );

    window.open(`mailto:feedback@rigassigner.app?subject=${subject}&body=${body}`, "_blank");

    setSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
      setSubmitted(false);
      setIssueType(null);
      setDescription("");
    }, 1500);
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-50 w-12 h-12 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-slate-700 shadow-lg transition-all duration-200 flex items-center justify-center"
        aria-label="Send feedback"
      >
        <MessageCircle className="w-5 h-5" />
      </button>

      {/* Modal backdrop */}
      {isOpen && (
        <div
          ref={backdropRef}
          onClick={(e) => {
            if (e.target === backdropRef.current) setIsOpen(false);
          }}
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
        >
          {/* Modal content */}
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-semibold text-slate-200">Send Feedback</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submitted ? (
              /* Success state */
              <div className="px-5 py-12 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Send className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-sm font-semibold text-emerald-400">Feedback Sent!</p>
                <p className="text-xs text-slate-500 mt-1">Thanks for helping improve RigAssigner.</p>
              </div>
            ) : (
              /* Form */
              <div className="px-5 py-5 space-y-4">
                {/* Issue type selector */}
                <div>
                  <label className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-2 block">
                    Issue Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {ISSUE_TYPES.map((type) => {
                      const Icon = type.icon;
                      const isActive = issueType === type.id;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setIssueType(type.id)}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                            isActive
                              ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                              : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {type.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-2 block">
                    Description
                  </label>
                  <textarea
                    ref={textareaRef}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell us what's wrong or what you'd like to see..."
                    rows={4}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 resize-none transition-colors"
                  />
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={!issueType || !description.trim()}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    issueType && description.trim()
                      ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                      : "bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700"
                  }`}
                >
                  <Send className="w-4 h-4" />
                  Send Feedback
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
