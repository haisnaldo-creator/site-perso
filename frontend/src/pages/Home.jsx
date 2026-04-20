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
    fivem: { icon: Gamepad2, color: "text-cyan-400" },
    reshade: { icon: Wand2, color: "text-violet-400" },
    "pack-graphique": { icon: ImageIcon, color: "text-emerald-400" },
    optimisation: { icon: Cpu, color: "text-amber-400" },
    mods: { icon: Wrench, color: "text-rose-400" },
    crosshair: { icon: Crosshair, color: "text-sky-400" },
    manette: { icon: Gamepad, color: "text-fuchsia-400" },
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
            {/* Hero */}
            <section className="relative overflow-hidden spot">
                <div className="absolute inset-0 bg-grid opacity-40" />
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `linear-gradient(to bottom, rgba(5,5,10,0.85), rgba(5,5,10,1)), url(${HERO_BG})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />

                <div className="relative max-w-7xl mx-auto px-5 md:px-8 pt-20 pb-28 md:pt-28 md:pb-36">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-8 fade-up">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="text-[11px] uppercase tracking-[0.2em] text-cyan-400 font-semibold">
                            Le hub FiveM pro
                        </span>
                    </div>

                    <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl text-white leading-[0.95] tracking-tight mb-6 fade-up max-w-4xl">
                        Optimise ton{" "}
                        <span className="text-cyan-400">FiveM</span>.
                        <br />
                        Installe proprement.
                        <br />
                        <span className="text-zinc-500">Joue sans crash.</span>
                    </h1>

                    <p
                        className="text-lg text-zinc-400 max-w-2xl mb-10 leading-relaxed fade-up"
                        style={{ animationDelay: "120ms" }}
                    >
                        Tutoriels testés pour packs graphiques, ReShade, optimisation PC
                        et correctifs. Par{" "}
                        <span className="text-cyan-400 font-semibold">tête de mouette</span>.
                    </p>

                    <div
                        className="flex flex-col sm:flex-row gap-3 fade-up"
                        style={{ animationDelay: "220ms" }}
                    >
                        <Link
                            to="/tutoriels"
                            data-testid="hero-cta-tutorials"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md bg-cyan-500 text-black font-bold text-sm uppercase tracking-wider hover:bg-cyan-400 transition-colors"
                        >
                            Voir les tutoriels
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            to="/tutoriels/installer-pack-graphique-fivem"
                            data-testid="hero-cta-pack"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md border border-white/15 text-white font-semibold text-sm uppercase tracking-wider hover:border-cyan-500/40 hover:text-cyan-400 transition-colors"
                        >
                            Pack graphique
                        </Link>
                    </div>

                    <div
                        className="grid grid-cols-3 gap-4 sm:gap-8 mt-16 max-w-2xl fade-up"
                        style={{ animationDelay: "320ms" }}
                    >
                        {[
                            { k: total || "12+", l: "Tutoriels" },
                            { k: "7", l: "Catégories" },
                            { k: "0", l: "Crash garanti" },
                        ].map((s) => (
                            <div
                                key={s.l}
                                className="border-l border-white/10 pl-4"
                            >
                                <div className="font-display font-black text-3xl sm:text-4xl text-white">
                                    {s.k}
                                </div>
                                <div className="text-xs uppercase tracking-wider text-zinc-500 mt-1 font-semibold">
                                    {s.l}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Value props */}
            <section className="relative -mt-16 pb-20">
                <div className="max-w-7xl mx-auto px-5 md:px-8">
                    <div className="grid md:grid-cols-3 gap-4">
                        {[
                            {
                                icon: Zap,
                                title: "Étape par étape",
                                body: "Chaque tutoriel est découpé en steps numérotés. Aucun pré-requis caché.",
                            },
                            {
                                icon: Shield,
                                title: "Anti-crash garanti",
                                body: "Correctifs CitizenFX.ini, ReShade ID, nettoyage : la méthode pro.",
                            },
                            {
                                icon: Sparkles,
                                title: "Maintenu à jour",
                                body: "Versions récentes FiveM & ReShade 5.x. Ajout continu de contenus.",
                            },
                        ].map((v, i) => (
                            <div
                                key={v.title}
                                className="p-6 rounded-md bg-[#0b0b12] border border-white/5 hover:border-cyan-500/30 transition-colors fade-up"
                                style={{ animationDelay: `${i * 80}ms` }}
                            >
                                <v.icon className="w-6 h-6 text-cyan-400 mb-4" />
                                <div className="font-display font-bold text-white mb-1.5">
                                    {v.title}
                                </div>
                                <p className="text-sm text-zinc-500 leading-relaxed">
                                    {v.body}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section data-testid="categories-section" className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-5 md:px-8">
                    <div className="flex items-end justify-between mb-10 gap-4">
                        <div>
                            <div className="text-[11px] uppercase tracking-[0.2em] text-cyan-400 font-semibold mb-3">
                                · Explorer par thème
                            </div>
                            <h2 className="font-display font-black text-3xl md:text-5xl text-white tracking-tight">
                                Catégories
                            </h2>
                        </div>
                        <Link
                            to="/categories"
                            className="hidden sm:inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-cyan-400 link-hover"
                        >
                            Tout voir <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                        {categories.map((cat, i) => {
                            const V =
                                CATEGORY_VISUALS[cat.id] || {
                                    icon: Gamepad2,
                                    color: "text-cyan-400",
                                };
                            return (
                                <Link
                                    key={cat.id}
                                    to={`/tutoriels?category=${cat.id}`}
                                    data-testid={`category-${cat.id}`}
                                    className="group p-5 rounded-md bg-[#0b0b12] border border-white/5 hover:border-cyan-500/40 hover:-translate-y-0.5 transition-all fade-up"
                                    style={{ animationDelay: `${i * 50}ms` }}
                                >
                                    <V.icon
                                        className={`w-6 h-6 mb-4 ${V.color}`}
                                    />
                                    <div className="font-display font-bold text-white text-sm leading-tight group-hover:text-cyan-400 transition-colors">
                                        {cat.name}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Featured tutorials */}
            <section data-testid="featured-section" className="py-16 md:py-24 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-5 md:px-8">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <div className="text-[11px] uppercase tracking-[0.2em] text-cyan-400 font-semibold mb-3">
                                · Incontournables
                            </div>
                            <h2 className="font-display font-black text-3xl md:text-5xl text-white tracking-tight">
                                Tutoriels populaires
                            </h2>
                        </div>
                        <Link
                            to="/tutoriels"
                            className="hidden sm:inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-cyan-400 link-hover"
                        >
                            Tous les tutos <ArrowRight className="w-4 h-4" />
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
            <section className="py-16 md:py-24">
                <div className="max-w-5xl mx-auto px-5 md:px-8">
                    <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-cyan-500/10 via-[#0b0b12] to-[#0b0b12] border border-cyan-500/20 p-10 md:p-16 text-center">
                        <div className="absolute inset-0 bg-grid opacity-30" />
                        <div className="relative">
                            <h3 className="font-display font-black text-3xl md:text-5xl text-white mb-5 tracking-tight">
                                Prêt à en finir avec les{" "}
                                <span className="text-cyan-400">crashs FiveM</span> ?
                            </h3>
                            <p className="text-zinc-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                                Suis nos guides pas-à-pas et profite d'un FiveM stable,
                                beau et rapide. Gratuit, testé, en français.
                            </p>
                            <Link
                                to="/tutoriels"
                                data-testid="final-cta"
                                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md bg-cyan-500 text-black font-bold text-sm uppercase tracking-wider hover:bg-cyan-400 transition-colors"
                            >
                                Commencer maintenant
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
