import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CodeBlock({ code, label = "Code" }) {  // ← changé ici
    const [copied, setCopied] = useState(false);

    function copy() {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
    }

    return (
        <div data-testid="code-block" className="code-block rounded-md overflow-hidden my-4">
            <div className="flex items-center justify-between px-4 py-2 bg-black/60 border-b border-[#3b82f6]/20">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
                    </div>
                    <span className="text-[11px] uppercase tracking-wider text-[#60a5fa] ml-2 font-mono">
                        {label}
                    </span>
                </div>
                <button
                    data-testid="copy-code-btn"
                    onClick={copy}
                    className="flex items-center gap-1.5 text-[11px] text-zinc-400 hover:text-[#60a5fa] transition-colors"
                >
                    {copied ? (
                        <>
                            <Check className="w-3 h-3" /> Copié
                        </>
                    ) : (
                        <>
                            <Copy className="w-3 h-3" /> Copier
                        </>
                    )}
                </button>
            </div>
            <pre className="px-5 py-4 text-sm font-mono leading-relaxed overflow-x-auto">
                <code>{code}</code>
            </pre>
        </div>
    );
}
