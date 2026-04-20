import React from "react";
import { AlertTriangle, Lightbulb, ExternalLink } from "lucide-react";

export function WarningCallout({ children }) {
    return (
        <div
            data-testid="warning-callout"
            className="my-4 p-4 rounded-md bg-rose-500/5 border-l-2 border-rose-500 flex items-start gap-3"
        >
            <AlertTriangle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
            <div>
                <div className="text-[11px] uppercase tracking-wider font-bold text-rose-400 mb-1">
                    Attention
                </div>
                <div className="text-sm text-rose-100/90 leading-relaxed">
                    {children}
                </div>
            </div>
        </div>
    );
}

export function TipCallout({ children }) {
    return (
        <div
            data-testid="tip-callout"
            className="my-4 p-4 rounded-md bg-[#d4a574]/5 border-l-2 border-[#d4a574] flex items-start gap-3"
        >
            <Lightbulb className="w-4 h-4 text-[#d4a574] mt-0.5 shrink-0" />
            <div>
                <div className="text-[11px] uppercase tracking-wider font-bold text-[#d4a574] mb-1">
                    Astuce
                </div>
                <div className="text-sm text-[#e7d5b8] leading-relaxed">
                    {children}
                </div>
            </div>
        </div>
    );
}

export function LinkCallout({ href }) {
    return (
        <a
            data-testid="link-callout"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 my-4 px-4 py-2.5 rounded-md bg-[#d4a574]/10 border border-[#d4a574]/30 text-[#d4a574] text-sm font-semibold hover:bg-[#d4a574]/15 transition-colors"
        >
            <ExternalLink className="w-4 h-4" />
            <span className="font-mono text-xs break-all">{href}</span>
        </a>
    );
}
