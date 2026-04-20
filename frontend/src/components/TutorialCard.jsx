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

export default function TutorialCard({ tutorial, index = 0 }) {
    const Icon = ICONS[tutorial.category] || Gamepad2;
    return (
        <Link
            to={`/tutoriels/${tutorial.slug}`}
            data-testid={`tutorial-card-${tutorial.slug}`}
            className="group relative flex flex-col bg-[#0b0b12] border border-white/5 rounded-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-[0_10px_40px_-10px_rgba(0,229,255,0.25)] fade-up"
            style={{ animationDelay: `${index * 60}ms` }}
        >
            {/* Thumbnail */}
            <div className="relative aspect-[16/10] overflow-hidden bg-[#07070c]">
                {tutorial.thumbnail ? (
                    <img
                        src={tutorial.thumbnail}
                        alt={tutorial.title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-cyan-500/10 to-transparent" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b12] via-transparent to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10">
                    <Icon className="w-3 h-3 text-cyan-400" />
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-white">
                        {CATEGORY_LABELS[tutorial.category] || tutorial.category}
                    </span>
                </div>
                {tutorial.featured && (
                    <div className="absolute top-3 right-3 px-2 py-1 rounded bg-cyan-500 text-black text-[10px] font-black uppercase tracking-wider">
                        Populaire
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-display font-bold text-white text-lg leading-tight mb-2 group-hover:text-cyan-400 transition-colors">
                    {tutorial.title}
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2 mb-4">
                    {tutorial.description}
                </p>
                <div className="mt-auto flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3 text-zinc-500">
                        <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{tutorial.duration}</span>
                        </div>
                        <span className="text-zinc-700">·</span>
                        <span className="uppercase tracking-wider font-semibold">
                            {tutorial.difficulty}
                        </span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-cyan-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                </div>
            </div>
        </Link>
    );
}
