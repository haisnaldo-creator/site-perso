import React from "react";
import { Link } from "react-router-dom";
import {
    Gamepad2,
    Wand2,
    Image as ImageIcon,
    Cpu,
    Wrench,
    Crosshair,
    Gamepad,
    Clock,
    ArrowUpRight,
} from "lucide-react";

const ICONS = {
    fivem: Gamepad2,
    reshade: Wand2,
    "pack-graphique": ImageIcon,
    optimisation: Cpu,
    mods: Wrench,
    crosshair: Crosshair,
    manette: Gamepad,
};

const CATEGORY_LABELS = {
    fivem: "FiveM",
    reshade: "ReShade",
    "pack-graphique": "Pack Graphique",
    optimisation: "Optimisation PC",
    mods: "Mods",
    crosshair: "Crosshair",
    manette: "Manette",
};

function resolveThumb(raw) {
    if (!raw) return null;
    if (raw.startsWith("http") || raw.startsWith("/")) return raw;
    // storage path returned by /api/admin/uploads
    return `${process.env.REACT_APP_BACKEND_URL}/api/files/${raw}`;
}

export default function TutorialCard({ tutorial, index = 0 }) {
    const Icon = ICONS[tutorial.category] || Gamepad2;
    const thumb = resolveThumb(tutorial.thumbnail);
    return (
        <Link
            to={`/tutoriels/${tutorial.slug}`}
            data-testid={`tutorial-card-${tutorial.slug}`}
            className="group relative flex flex-col bg-[#0c0c0c] border border-white/5 overflow-hidden transition-all duration-500 hover:border-[#3b82f6]/30 fade-up"
            style={{ animationDelay: `${index * 60}ms` }}
        >
            {/* Thumbnail */}
            <div className="relative aspect-[16/10] overflow-hidden bg-[#0a0a0a]">
                {thumb ? (
                    <img
                        src={thumb}
                        alt={tutorial.title}
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-700 grayscale-[30%] group-hover:grayscale-0"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#60a5fa]/8 to-transparent" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent" />
                <div className="absolute top-4 left-4 flex items-center gap-1.5">
                    <Icon className="w-3 h-3 text-[#60a5fa]" strokeWidth={1.8} />
                    <span className="text-[10px] uppercase tracking-[0.18em] font-medium text-white/90">
                        {CATEGORY_LABELS[tutorial.category] || tutorial.category}
                    </span>
                </div>
                {tutorial.featured && (
                    <div className="absolute top-4 right-4 px-2 py-0.5 border border-[#3b82f6]/40 text-[9px] font-medium uppercase tracking-[0.2em] text-[#60a5fa]">
                        Sélection
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-display text-[22px] leading-[1.15] text-white mb-3 tracking-tight group-hover:text-[#60a5fa] transition-colors text-balance">
                    {tutorial.title}
                </h3>
                <p className="text-sm text-zinc-500 leading-[1.7] line-clamp-2 mb-6">
                    {tutorial.description}
                </p>
                <div className="mt-auto flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3 text-zinc-500">
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3" strokeWidth={1.5} />
                            <span>{tutorial.duration}</span>
                        </div>
                        <span className="text-zinc-700">·</span>
                        <span className="uppercase tracking-[0.12em]">
                            {tutorial.difficulty}
                        </span>
                    </div>
                    <ArrowUpRight
                        className="w-4 h-4 text-zinc-600 group-hover:text-[#60a5fa] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
                        strokeWidth={1.5}
                    />
                </div>
            </div>
        </Link>
    );
}
