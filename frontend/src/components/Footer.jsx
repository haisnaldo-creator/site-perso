import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer
            data-testid="site-footer"
            className="border-t border-white/5 bg-[#05050a] mt-24"
        >
            <div className="max-w-7xl mx-auto px-5 md:px-8 py-14 grid md:grid-cols-4 gap-10">
                <div className="md:col-span-2">
                    <div className="flex items-center gap-2.5 mb-4">
                        <div className="w-9 h-9 rounded-md bg-[#3b82f6]/10 border border-[#3b82f6]/30 flex items-center justify-center">
                            <span className="text-[#60a5fa] font-display text-lg">
                                TM
                            </span>
                        </div>
                        <div>
                            <div className="font-display text-white">
                                Tête de Mouette
                            </div>
                            <div className="text-[10px] uppercase tracking-[0.18em] text-[#60a5fa] font-medium">
                                FiveM Hub
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-zinc-500 max-w-md leading-relaxed">
                        Le hub de tutos FiveM, ReShade et optimisation PC. Guides testés
                        en conditions réelles par{" "}
                        <span className="text-[#60a5fa]">tête de mouette</span>.
                    </p>
                </div>

                <div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500 mb-3 font-semibold">
                        Navigation
                    </div>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link
                                to="/tutoriels"
                                className="text-zinc-400 hover:text-[#60a5fa]"
                            >
                                Tous les tutoriels
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/categories"
                                className="text-zinc-400 hover:text-[#60a5fa]"
                            >
                                Catégories
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/a-propos"
                                className="text-zinc-400 hover:text-[#60a5fa]"
                            >
                                À propos
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500 mb-3 font-semibold">
                        Populaires
                    </div>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link
                                to="/tutoriels/installer-pack-graphique-fivem"
                                className="text-zinc-400 hover:text-[#60a5fa]"
                            >
                                Pack graphique
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/tutoriels/installer-reshade-fivem"
                                className="text-zinc-400 hover:text-[#60a5fa]"
                            >
                                ReShade
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/tutoriels/optimiser-windows-fivem-fps"
                                className="text-zinc-400 hover:text-[#60a5fa]"
                            >
                                +30 FPS Windows
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-white/5">
                <div className="max-w-7xl mx-auto px-5 md:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
                    <div>
                        © {new Date().getFullYear()} Tête de Mouette. Tous droits
                        réservés.
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Site actif · v1.0</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
