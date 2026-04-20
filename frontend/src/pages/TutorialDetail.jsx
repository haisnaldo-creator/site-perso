import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api";
import CodeBlock from "../components/CodeBlock";
import {
    WarningCallout,
    TipCallout,
    LinkCallout,
} from "../components/Callouts";
import Comments from "../components/Comments";
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
                    <div className="font-display text-2xl text-white mb-3">
                        {error}
                    </div>
                    <Link
                        to="/tutoriels"
                        className="inline-flex items-center gap-2 text-[#d4a574] text-sm"
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
                        className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-[#d4a574] text-sm mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Retour aux tutoriels
                    </Link>

                    <div className="flex items-center gap-3 mb-6 flex-wrap">
                        <span className="text-[#d4a574] text-[10px] uppercase tracking-[0.24em] font-medium">
                            {tutorial.category}
                        </span>
                        <span className="text-zinc-700">/</span>
                        <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                            <Clock className="w-3 h-3" strokeWidth={1.5} />
                            {tutorial.duration}
                        </div>
                        <span className="text-zinc-700">/</span>
                        <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] uppercase tracking-[0.16em]">
                            <Zap className="w-3 h-3" strokeWidth={1.5} />
                            {tutorial.difficulty}
                        </div>
                    </div>

                    <h1 className="font-display text-[44px] md:text-7xl text-white tracking-[-0.02em] leading-[1.02] mb-6 text-balance">
                        {tutorial.title}
                    </h1>
                    <p className="text-xl text-zinc-400 leading-[1.6] max-w-3xl font-light">
                        {tutorial.description}
                    </p>

                    {tutorial.thumbnail && (
                        <div className="relative mt-12 aspect-[21/9] overflow-hidden border border-white/5">
                            <img
                                src={
                                    tutorial.thumbnail.startsWith("http") ||
                                    tutorial.thumbnail.startsWith("/")
                                        ? tutorial.thumbnail
                                        : `${process.env.REACT_APP_BACKEND_URL}/api/files/${tutorial.thumbnail}`
                                }
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
                    <div className="mt-20 p-8 rounded-sm bg-gradient-to-br from-[#d4a574]/5 to-transparent border border-[#d4a574]/20 text-center">
                        <div className="text-[10px] uppercase tracking-[0.24em] text-[#d4a574] font-medium mb-3">
                            · Fini
                        </div>
                        <h3 className="font-display text-3xl md:text-4xl text-white mb-3 tracking-tight">
                            Tutoriel terminé
                        </h3>
                        <p className="text-zinc-400 mb-6">
                            Si ça t'a aidé, partage-le avec ta communauté.
                        </p>
                        <div className="flex items-center justify-center gap-3">
                            <button
                                data-testid="share-tutorial-btn"
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                }}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm border border-white/15 text-white text-xs font-semibold uppercase tracking-[0.12em] hover:border-[#d4a574]/40 hover:text-[#d4a574] transition-colors"
                            >
                                <Share2 className="w-3.5 h-3.5" />
                                Copier le lien
                            </button>
                            <Link
                                to="/tutoriels"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm btn-bronze text-xs font-semibold uppercase tracking-[0.12em]"
                            >
                                Autre tuto
                            </Link>
                        </div>
                    </div>

                    <Comments slug={tutorial.slug} />
                </div>
            </section>
        </article>
    );
}

function StepBlock({ step }) {
    return (
        <div data-testid={`step-${step.number}`} className="relative fade-up">
            <div className="flex items-baseline gap-5 mb-5">
                <span className="font-display text-5xl md:text-6xl text-[#d4a574] italic leading-none tabular-nums">
                    {String(step.number).padStart(2, "0")}
                </span>
                <div className="flex-1 pt-1">
                    <div className="text-[10px] uppercase tracking-[0.24em] text-zinc-500 font-medium mb-2">
                        Étape {step.number}
                    </div>
                    <h2 className="font-display text-3xl md:text-4xl text-white leading-[1.05] tracking-tight">
                        {step.title}
                    </h2>
                </div>
            </div>
            <div className="md:pl-[4.5rem]">
                {step.content && (
                    <p className="text-[17px] text-zinc-300 leading-[1.75] whitespace-pre-wrap">
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
