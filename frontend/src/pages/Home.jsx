import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import TutorialCard from "../components/TutorialCard";
import {
    ArrowRight,
    Gamepad2,
    Wand2,
    Image as ImageIcon,
    Cpu,
    Wrench,
    Crosshair,
    Gamepad,
    Zap,
    Shield,
    Sparkles,
} from "lucide-react";

const HERO_BG =
    "https://static.prod-images.emergentagent.com/jobs/286230f2-1485-4530-9840-c85e55e52fd6/images/2b1458adfd22199d17399314011143a17e2c2c845ab482a11179e0b1afe3254b.png";

const CATEGORY_VISUALS = {
    fivem: { icon: Gamepad2, color: "text-[#60a5fa]" },
    reshade: { icon: Wand2, color: "text-[#60a5fa]" },
    "pack-graphique": { icon: ImageIcon, color: "text-[#60a5fa]" },
    optimisation: { icon: Cpu, color: "text-[#60a5fa]" },
    mods: { icon: Wrench, color: "text-[#60a5fa]" },
    crosshair: { icon: Crosshair, color: "text-[#60a5fa]" },
    manette: { icon: Gamepad, color: "text-[#60a5fa]" },
};

export default function Home() {
    const [featured, setFeatured] = useState([]);
    const [categories, setCategories] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        Promise.all([
            api.get("/tutorials", { params: { featured: true } }),
            api.get("/categories"),
            api.get("/tutorials"),
        ])
            .then(([f, c, all]) => {
                setFeatured(f.data);
                setCategories(c.data);
                setTotal(all.data.length);
            })
            .catch(() => {});
    }, []);

    return (
        <div data-testid="home-page" className="min-h-screen">
            {/* Hero — editorial */}
            <section className="relative overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 bg-grid opacity-50" />
                <div className="absolute inset-0 dust-bg" />
                <div
                    className="absolute inset-0 opacity-[0.08]"
                    style={{
                        backgroundImage: `linear-gradient(to bottom, rgba(10,10,10,0.95), rgba(10,10,10,1)), url(${HERO_BG})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />

                <div className="relative max-w-7xl mx-auto px-5 md:px-8 pt-24 pb-32 md:pt-40 md:pb-48">
                    <div className="flex items-center gap-3 mb-10 fade-up">
                        <span className="w-10 h-px bg-[#60a5fa]" />
                        <span className="text-[11px] uppercase tracking-[0.22em] text-[#60a5fa] font-semibold">
                            Édition 2026 · Communauté Tête de Mouette
                        </span>
                    </div>

                    <h1 className="font-display text-[40px] leading-[1.05] sm:text-5xl lg:text-[68px] text-white tracking-[-0.03em] mb-6 fade-up max-w-5xl text-balance font-bold">
                        Tutoriels FiveM, ReShade
                        <br />
                        & Optimisation PC,
                        <br />
                        <span className="text-[#60a5fa]">clairs et testés.</span>
                    </h1>

                    <p
                        className="text-lg text-zinc-400 max-w-2xl mb-10 leading-relaxed fade-up"
                        style={{ animationDelay: "120ms" }}
                    >
                        Guides pas-à-pas pour installer proprement ton pack graphique,
                        régler ReShade, booster tes FPS et résoudre les crashs les plus
                        courants. Écrits par <span className="text-white font-semibold">tête de mouette</span>,
                        testés sur le terrain.
                    </p>

                    <div
                        className="flex flex-col sm:flex-row gap-3 fade-up"
                        style={{ animationDelay: "220ms" }}
                    >
                        <Link
                            to="/tutoriels"
                            data-testid="hero-cta-tutorials"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-sm btn-bronze text-xs font-semibold uppercase tracking-[0.14em]"
                        >
                            Explorer la bibliothèque
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            to="/tutoriels/installer-pack-graphique-fivem"
                            data-testid="hero-cta-pack"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-sm border border-white/15 text-white text-xs font-semibold uppercase tracking-[0.14em] hover:border-[#3b82f6]/40 hover:text-[#60a5fa] transition-colors"
                        >
                            Guide pack graphique
                        </Link>
                    </div>

                    <div
                        className="grid grid-cols-2 md:grid-cols-3 gap-10 sm:gap-16 mt-24 max-w-3xl fade-up"
                        style={{ animationDelay: "320ms" }}
                    >
                        {[
                            { k: total || "12", l: "Tutoriels publiés" },
                            { k: "7", l: "Catégories" },
                            { k: "2026", l: "Maintenu depuis" },
                        ].map((s) => (
                            <div key={s.l}>
                                <div className="font-bold text-4xl sm:text-5xl text-white tabular-nums leading-none mb-3">
                                    {s.k}
                                </div>
                                <div className="dotted-rule mb-2 max-w-[120px]" />
                                <div className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 font-medium">
                                    {s.l}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Value props — editorial list */}
            <section className="py-20 md:py-28 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-5 md:px-8">
                    <div className="grid md:grid-cols-3 gap-10 md:gap-14">
                        {[
                            {
                                icon: Zap,
                                title: "Méthode pas-à-pas",
                                body: "Des guides découpés, numérotés, sans raccourci. Chaque étape est vérifiée en conditions réelles avant publication.",
                            },
                            {
                                icon: Shield,
                                title: "Correctifs officiels",
                                body: "ReShade ID, CitizenFX.ini, nettoyage FiveM : tu obtiens la procédure exacte, pas une approximation de forum.",
                            },
                            {
                                icon: Sparkles,
                                title: "Mise à jour continue",
                                body: "Versions récentes FiveM & ReShade 5.x, ajout régulier de contenus. Les tutos vivent avec la communauté.",
                            },
                        ].map((v, i) => (
                            <div
                                key={v.title}
                                className="fade-up"
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                <v.icon className="w-5 h-5 text-[#60a5fa] mb-5" strokeWidth={1.5} />
                                <div className="dotted-rule mb-5 max-w-[60px]" />
                                <h3 className="font-display text-2xl text-white mb-3 tracking-tight">
                                    {v.title}
                                </h3>
                                <p className="text-[15px] text-zinc-400 leading-[1.7]">
                                    {v.body}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section data-testid="categories-section" className="py-20 md:py-28 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-5 md:px-8">
                    <div className="flex items-end justify-between mb-12 gap-4">
                        <div>
                            <div className="text-[10px] uppercase tracking-[0.28em] text-[#60a5fa] font-medium mb-3">
                                · Sommaire
                            </div>
                            <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight text-balance">
                                Parcourir <span className="serif-accent">par thème</span>
                            </h2>
                        </div>
                        <Link
                            to="/categories"
                            className="hidden sm:inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-[#60a5fa] link-hover"
                        >
                            Tout voir <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-0 border-t border-l border-white/5">
                        {categories.map((cat, i) => {
                            const V =
                                CATEGORY_VISUALS[cat.id] || {
                                    icon: Gamepad2,
                                    color: "text-[#60a5fa]",
                                };
                            return (
                                <Link
                                    key={cat.id}
                                    to={`/tutoriels?category=${cat.id}`}
                                    data-testid={`category-${cat.id}`}
                                    className="group p-6 border-b border-r border-white/5 hover:bg-[#3b82f6]/5 transition-colors fade-up"
                                    style={{ animationDelay: `${i * 50}ms` }}
                                >
                                    <V.icon
                                        className={`w-5 h-5 mb-5 ${V.color}`}
                                        strokeWidth={1.5}
                                    />
                                    <div className="font-display text-white text-lg leading-tight">
                                        {cat.name}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Featured tutorials */}
            <section data-testid="featured-section" className="py-20 md:py-28">
                <div className="max-w-7xl mx-auto px-5 md:px-8">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <div className="text-[10px] uppercase tracking-[0.28em] text-[#60a5fa] font-medium mb-3">
                                · Sélection
                            </div>
                            <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight">
                                Tutoriels <span className="serif-accent">populaires</span>
                            </h2>
                        </div>
                        <Link
                            to="/tutoriels"
                            className="hidden sm:inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-[#60a5fa] link-hover"
                        >
                            Voir tout <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featured.slice(0, 6).map((t, i) => (
                            <TutorialCard key={t.id} tutorial={t} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 md:py-28 border-t border-white/5">
                <div className="max-w-4xl mx-auto px-5 md:px-8 text-center">
                    <div className="text-[10px] uppercase tracking-[0.28em] text-[#60a5fa] font-medium mb-6">
                        · Commencer maintenant
                    </div>
                    <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight text-balance leading-[1.05]">
                        Un <span className="serif-accent">FiveM stable,</span>
                        <br />
                        c'est une question de méthode.
                    </h3>
                    <p className="text-zinc-400 mb-10 max-w-xl mx-auto leading-[1.7] text-[17px]">
                        Suis les guides dans l'ordre, respecte les étapes. La récompense :
                        un jeu propre, beau, sans crash.
                    </p>
                    <Link
                        to="/tutoriels"
                        data-testid="final-cta"
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-sm btn-bronze text-xs font-semibold uppercase tracking-[0.14em]"
                    >
                        Ouvrir la bibliothèque
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
