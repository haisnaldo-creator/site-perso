import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import {
    Gamepad2,
    Wand2,
    Image as ImageIcon,
    Cpu,
    Wrench,
    Crosshair,
    Gamepad,
    ArrowRight,
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

const DESCRIPTIONS = {
    fivem: "Installation, premiers pas, erreurs VPN/Proxy et fondamentaux FiveM.",
    reshade:
        "Installation propre, correctifs anti-crash, réglage de la luminosité et presets.",
    "pack-graphique":
        "Packs graphiques GTA V / FiveM : installation, résolution des bugs et crash.",
    optimisation:
        "Nettoyage, réglages Windows/NVIDIA, libération de RAM et boost FPS.",
    mods: "Mods solo, packs son, trainers et scripts externes.",
    crosshair: "Crosshairs custom pour FiveM et ajustement en jeu.",
    manette: "Configuration Xbox / PlayStation, deadzones et fixes de détection.",
};

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [counts, setCounts] = useState({});

    useEffect(() => {
        Promise.all([api.get("/categories"), api.get("/tutorials")]).then(
            ([c, t]) => {
                setCategories(c.data);
                const map = {};
                t.data.forEach((tt) => {
                    map[tt.category] = (map[tt.category] || 0) + 1;
                });
                setCounts(map);
            }
        );
    }, []);

    return (
        <div data-testid="categories-page" className="min-h-screen">
            <section className="pt-14 pb-10 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-5 md:px-8">
                    <div className="text-[11px] uppercase tracking-[0.2em] text-[#60a5fa] font-semibold mb-3">
                        · Naviguer par thème
                    </div>
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
                        Catégories
                    </h1>
                    <p className="text-zinc-400 max-w-2xl">
                        7 univers, des dizaines de tutos. Trouve ce qu'il te faut
                        rapidement.
                    </p>
                </div>
            </section>

            <section className="py-16">
                <div className="max-w-7xl mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-5">
                    {categories.map((cat, i) => {
                        const Icon = ICONS[cat.id] || Gamepad2;
                        return (
                            <Link
                                key={cat.id}
                                to={`/tutoriels?category=${cat.id}`}
                                data-testid={`category-card-${cat.id}`}
                                className="group relative p-8 rounded-md bg-[#0b0b12] border border-white/5 hover:border-[#3b82f6]/40 hover:-translate-y-1 transition-all fade-up overflow-hidden"
                                style={{ animationDelay: `${i * 60}ms` }}
                            >
                                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-[#3b82f6]/5 blur-3xl group-hover:bg-[#3b82f6]/10 transition-colors" />
                                <div className="relative">
                                    <Icon className="w-8 h-8 text-[#60a5fa] mb-5" />
                                    <div className="flex items-baseline gap-3 mb-2">
                                        <h3 className="font-display text-2xl text-white tracking-tight">
                                            {cat.name}
                                        </h3>
                                        <span className="text-xs text-zinc-500">
                                            {counts[cat.id] || 0} tutos
                                        </span>
                                    </div>
                                    <p className="text-sm text-zinc-500 leading-relaxed mb-6">
                                        {DESCRIPTIONS[cat.id] || ""}
                                    </p>
                                    <span className="inline-flex items-center gap-1.5 text-xs text-[#60a5fa] font-semibold uppercase tracking-wider group-hover:gap-2.5 transition-all">
                                        Explorer <ArrowRight className="w-3.5 h-3.5" />
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
