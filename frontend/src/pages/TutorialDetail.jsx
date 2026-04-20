import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api";
import CodeBlock from "../components/CodeBlock";
import {
    WarningCallout,
    TipCallout,
    LinkCallout,
} from "../components/Callouts";
import { Clock, Zap, ArrowLeft, Share2 } from "lucide-react";

export default function TutorialDetail() {
    const { slug } = useParams();
    const [tutorial, setTutorial] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        setTutorial(null);
        setError("");
        api
            .get(`/tutorials/slug/${slug}`)
            .then((r) => setTutorial(r.data))
            .catch((e) =>
                setError(
                    e?.response?.status === 404
                        ? "Tutoriel introuvable"
                        : "Erreur de chargement"
                )
            );
    }, [slug]);

    if (error) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-center">
                <div>
                    <div className="font-display font-bold text-2xl text-white mb-3">
                        {error}
                    </div>
                    <Link
                        to="/tutoriels"
                        className="inline-flex items-center gap-2 text-cyan-400 text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" /> Retour aux tutoriels
                    </Link>
                </div>
            </div>
        );
    }
    if (!tutorial) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-zinc-500 text-sm">
                Chargement…
            </div>
        );
    }

    return (
        <article data-testid="tutorial-detail-page" className="min-h-screen">
            {/* Hero */}
            <section className="relative pt-12 pb-14 border-b border-white/5">
                <div className="absolute inset-0 bg-grid opacity-25" />
                <div className="relative max-w-4xl mx-auto px-5 md:px-8">
                    <Link
                        to="/tutoriels"
                        className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-cyan-400 text-sm mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Retour aux tutoriels
                    </Link>

                    <div className="flex items-center gap-2 mb-5 flex-wrap">
                        <span className="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] uppercase tracking-wider font-bold">
                            {tutorial.category}
                        </span>
                        <span className="text-zinc-600">·</span>
                        <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                            <Clock className="w-3.5 h-3.5" />
                            {tutorial.duration}
                        </div>
                        <span className="text-zinc-600">·</span>
                        <div className="flex items-center gap-1.5 text-zinc-500 text-xs uppercase tracking-wider">
                            <Zap className="w-3.5 h-3.5" />
                            {tutorial.difficulty}
                        </div>
                    </div>

                    <h1 className="font-display font-black text-4xl md:text-6xl text-white tracking-tight leading-[1.02] mb-5">
                        {tutorial.title}
                    </h1>
                    <p className="text-lg text-zinc-400 leading-relaxed">
                        {tutorial.description}
                    </p>

                    {tutorial.thumbnail && (
                        <div className="relative mt-10 aspect-[21/9] rounded-md overflow-hidden border border-white/5">
                            <img
                                src={tutorial.thumbnail}
                                alt={tutorial.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#05050a] via-transparent to-transparent" />
                        </div>
                    )}
                </div>
            </section>

            {/* Steps */}
            <section className="py-16 md:py-20">
                <div className="max-w-3xl mx-auto px-5 md:px-8">
                    <div className="space-y-16 md:space-y-20">
                        {tutorial.steps.map((step) => (
                            <StepBlock key={step.number} step={step} />
                        ))}
                    </div>

                    {/* End */}
                    <div className="mt-20 p-8 rounded-md bg-gradient-to-br from-cyan-500/5 to-transparent border border-cyan-500/20 text-center">
                        <div className="text-[11px] uppercase tracking-[0.2em] text-cyan-400 font-semibold mb-3">
                            · Fini !
                        </div>
                        <h3 className="font-display font-black text-2xl md:text-3xl text-white mb-3">
                            Tutoriel terminé
                        </h3>
                        <p className="text-zinc-400 mb-6">
                            Si ça t'a aidé, partage-le avec ta communauté FiveM.
                        </p>
                        <div className="flex items-center justify-center gap-3">
                            <button
                                data-testid="share-tutorial-btn"
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-white/15 text-white text-sm font-semibold hover:border-cyan-500/40 hover:text-cyan-400 transition-colors"
                            >
                                <Share2 className="w-4 h-4" />
                                Copier le lien
                            </button>
                            <Link
                                to="/tutoriels"
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-cyan-500 text-black text-sm font-bold uppercase tracking-wider hover:bg-cyan-400 transition-colors"
                            >
                                Autre tuto
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </article>
    );
}

function StepBlock({ step }) {
    return (
        <div
            data-testid={`step-${step.number}`}
            className="relative fade-up"
        >
            <div className="absolute -left-2 md:-left-8 top-0 pointer-events-none select-none step-number">
                0{step.number}
            </div>
            <div className="relative pl-0 md:pl-16">
                <div className="text-[11px] uppercase tracking-[0.2em] text-cyan-400 font-bold mb-3">
                    Étape {String(step.number).padStart(2, "0")}
                </div>
                <h2 className="font-display font-black text-2xl md:text-3xl text-white mb-4 leading-tight tracking-tight">
                    {step.title}
                </h2>
                {step.content && (
                    <p className="text-base text-zinc-300 leading-relaxed whitespace-pre-wrap">
                        {step.content}
                    </p>
                )}
                {step.link && <LinkCallout href={step.link} />}
                {step.code && <CodeBlock code={step.code} />}
                {step.warning && <WarningCallout>{step.warning}</WarningCallout>}
                {step.tip && <TipCallout>{step.tip}</TipCallout>}
            </div>
        </div>
    );
}
