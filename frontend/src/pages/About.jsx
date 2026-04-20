import React from "react";
import { Link } from "react-router-dom";
import { Target, Lightbulb, Shield, Heart } from "lucide-react";

export default function About() {
    return (
        <div data-testid="about-page" className="min-h-screen">
            <section className="pt-16 pb-20 border-b border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid opacity-20" />
                <div className="relative max-w-4xl mx-auto px-5 md:px-8">
                    <div className="text-[11px] uppercase tracking-[0.2em] text-cyan-400 font-semibold mb-4">
                        · À propos
                    </div>
                    <h1 className="font-display font-black text-4xl md:text-6xl text-white tracking-tight mb-6 leading-[1.02]">
                        Le hub FiveM par{" "}
                        <span className="text-cyan-400">tête de mouette</span>
                    </h1>
                    <p className="text-lg text-zinc-400 leading-relaxed max-w-2xl">
                        Site communautaire dédié à FiveM, ReShade et l'optimisation PC.
                        Chaque tuto est testé, rédigé en français clair et tenu à jour.
                        L'objectif : aucun joueur ne crash sans raison.
                    </p>
                </div>
            </section>

            <section className="py-16">
                <div className="max-w-4xl mx-auto px-5 md:px-8">
                    <div className="grid md:grid-cols-2 gap-5">
                        {[
                            {
                                icon: Target,
                                title: "Mission",
                                body: "Rendre FiveM accessible à tous, du débutant au moddeur avancé. Guides ultra-précis, pas de blabla.",
                            },
                            {
                                icon: Lightbulb,
                                title: "Approche",
                                body: "Chaque tuto est structuré en étapes numérotées avec codes, avertissements et astuces issus de la pratique.",
                            },
                            {
                                icon: Shield,
                                title: "Fiabilité",
                                body: "Tous les correctifs (anti-crash ReShade, CitizenFX) sont validés en conditions réelles.",
                            },
                            {
                                icon: Heart,
                                title: "Communauté",
                                body: "Propose tes idées, signale des erreurs : le site évolue avec les retours de la communauté.",
                            },
                        ].map((v) => (
                            <div
                                key={v.title}
                                className="p-6 rounded-md bg-[#0b0b12] border border-white/5"
                            >
                                <v.icon className="w-5 h-5 text-cyan-400 mb-4" />
                                <div className="font-display font-bold text-white mb-1.5">
                                    {v.title}
                                </div>
                                <p className="text-sm text-zinc-500 leading-relaxed">
                                    {v.body}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-14 p-8 md:p-12 rounded-md bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 text-center">
                        <h3 className="font-display font-black text-2xl md:text-3xl text-white mb-4 tracking-tight">
                            Commence par les essentiels
                        </h3>
                        <p className="text-zinc-400 mb-6">
                            Trois tutos à faire en priorité pour un FiveM optimisé.
                        </p>
                        <div className="flex flex-wrap justify-center gap-2.5">
                            <Link
                                to="/tutoriels/installer-pack-graphique-fivem"
                                className="px-4 py-2.5 rounded-md bg-cyan-500 text-black text-xs font-bold uppercase tracking-wider hover:bg-cyan-400"
                            >
                                Pack graphique
                            </Link>
                            <Link
                                to="/tutoriels/installer-reshade-fivem"
                                className="px-4 py-2.5 rounded-md border border-white/15 text-white text-xs font-bold uppercase tracking-wider hover:border-cyan-500/40 hover:text-cyan-400"
                            >
                                ReShade
                            </Link>
                            <Link
                                to="/tutoriels/optimiser-windows-fivem-fps"
                                className="px-4 py-2.5 rounded-md border border-white/15 text-white text-xs font-bold uppercase tracking-wider hover:border-cyan-500/40 hover:text-cyan-400"
                            >
                                +30 FPS
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
