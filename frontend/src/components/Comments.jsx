import React, { useEffect, useState } from "react";
import { api, formatApiError } from "../lib/api";
import { MessageSquare, Send, ShieldCheck } from "lucide-react";

export default function Comments({ slug }) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [author, setAuthor] = useState("");
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState(null); // "pending" | "error" | null

    async function load() {
        setLoading(true);
        try {
            const r = await api.get(`/comments/tutorial/${slug}`);
            setComments(r.data);
        } catch {
            /* ignore */
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        load();
    }, [slug]);

    async function submit(e) {
        e.preventDefault();
        if (!author.trim() || !content.trim()) return;
        setSubmitting(true);
        setStatus(null);
        try {
            await api.post("/comments", {
                tutorial_slug: slug,
                author: author.trim(),
                content: content.trim(),
            });
            setAuthor("");
            setContent("");
            setStatus("pending");
        } catch (err) {
            setStatus({ error: formatApiError(err) });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section
            data-testid="comments-section"
            className="mt-20 pt-16 border-t border-white/5"
        >
            <div className="flex items-baseline justify-between mb-10">
                <div>
                    <div className="text-[10px] uppercase tracking-[0.24em] text-zinc-500 font-medium mb-2">
                        · Discussion
                    </div>
                    <h3 className="font-display text-3xl md:text-4xl text-white tracking-tight">
                        Commentaires
                        {comments.length > 0 && (
                            <span className="serif-accent text-2xl ml-3">
                                {comments.length}
                            </span>
                        )}
                    </h3>
                </div>
                <div className="hidden md:flex items-center gap-1.5 text-xs text-zinc-500">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Modéré par l'équipe
                </div>
            </div>

            <form
                onSubmit={submit}
                data-testid="comment-form"
                className="mb-12 p-6 rounded-sm bg-[#0f0f0f] border border-white/5"
            >
                <div className="grid md:grid-cols-[1fr_2fr] gap-4">
                    <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-medium mb-2">
                            Ton pseudo
                        </label>
                        <input
                            data-testid="comment-author-input"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            maxLength={60}
                            required
                            placeholder="Ex : Jean_RP"
                            className="w-full px-4 py-2.5 rounded-sm bg-[#0a0a0a] border border-white/10 text-white text-sm focus:outline-none focus:border-[#d4a574]/50"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-medium mb-2">
                            Ton message
                        </label>
                        <textarea
                            data-testid="comment-content-input"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            maxLength={1200}
                            rows={3}
                            required
                            placeholder="Partage ton retour, pose une question…"
                            className="w-full px-4 py-2.5 rounded-sm bg-[#0a0a0a] border border-white/10 text-white text-sm focus:outline-none focus:border-[#d4a574]/50 resize-y"
                        />
                    </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-zinc-500">
                        Ton message sera publié après validation par la modération.
                    </div>
                    <button
                        data-testid="comment-submit-btn"
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm btn-bronze text-xs font-semibold uppercase tracking-[0.12em] disabled:opacity-60"
                    >
                        <Send className="w-3.5 h-3.5" />
                        {submitting ? "Envoi…" : "Publier"}
                    </button>
                </div>
                {status === "pending" && (
                    <div
                        data-testid="comment-success"
                        className="mt-4 p-3 rounded-sm bg-emerald-500/5 border-l-2 border-emerald-500 text-emerald-300 text-sm"
                    >
                        Merci ! Ton commentaire est en attente de validation.
                    </div>
                )}
                {status && typeof status === "object" && (
                    <div className="mt-4 p-3 rounded-sm bg-rose-500/5 border-l-2 border-rose-500 text-rose-300 text-sm">
                        {status.error}
                    </div>
                )}
            </form>

            {loading ? (
                <div className="text-zinc-500 text-sm">Chargement…</div>
            ) : comments.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 italic font-display text-lg">
                    Sois le premier à commenter.
                </div>
            ) : (
                <div className="space-y-6">
                    {comments.map((c) => (
                        <div
                            key={c.id}
                            data-testid={`comment-${c.id}`}
                            className="flex gap-4 p-5 rounded-sm bg-[#0c0c0c] border border-white/5"
                        >
                            <div className="w-10 h-10 shrink-0 rounded-full bg-[#d4a574]/10 border border-[#d4a574]/25 flex items-center justify-center text-[#d4a574] font-display italic text-lg">
                                {c.author.slice(0, 1).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="font-medium text-white text-sm">
                                        {c.author}
                                    </span>
                                    <span className="text-zinc-600">·</span>
                                    <span className="text-xs text-zinc-500">
                                        {formatDate(c.created_at)}
                                    </span>
                                </div>
                                <p className="text-[15px] text-zinc-300 leading-relaxed whitespace-pre-wrap break-words">
                                    {c.content}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

function formatDate(iso) {
    try {
        const d = new Date(iso);
        const diff = (Date.now() - d.getTime()) / 1000;
        if (diff < 60) return "à l'instant";
        if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
        if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
        if (diff < 2592000) return `il y a ${Math.floor(diff / 86400)} j`;
        return d.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    } catch {
        return "";
    }
}
