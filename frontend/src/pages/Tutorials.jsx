import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import TutorialCard from "../components/TutorialCard";
import { Search, SlidersHorizontal } from "lucide-react";

export default function Tutorials() {
    const [params, setParams] = useSearchParams();
    const [tutorials, setTutorials] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [q, setQ] = useState(params.get("q") || "");

    const category = params.get("category") || "all";

    useEffect(() => {
        api.get("/categories").then((r) => setCategories(r.data));
    }, []);

    useEffect(() => {
        setLoading(true);
        const p = {};
        if (category !== "all") p.category = category;
        if (q) p.q = q;
        api
            .get("/tutorials", { params: p })
            .then((r) => setTutorials(r.data))
            .finally(() => setLoading(false));
    }, [category, q]);

    function setCategory(id) {
        const next = new URLSearchParams(params);
        if (id === "all") next.delete("category");
        else next.set("category", id);
        setParams(next);
    }

    return (
        <div data-testid="tutorials-page" className="min-h-screen">
            <section className="pt-14 pb-10 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-5 md:px-8">
                    <div className="text-[11px] uppercase tracking-[0.2em] text-cyan-400 font-semibold mb-3">
                        · Bibliothèque
                    </div>
                    <h1 className="font-display font-black text-4xl md:text-6xl text-white tracking-tight mb-4">
                        Tous les tutoriels
                    </h1>
                    <p className="text-zinc-400 max-w-2xl">
                        Filtre par catégorie ou recherche directement un mot-clé. Tous
                        les guides sont testés et maintenus par tête de mouette.
                    </p>
                </div>
            </section>

            <section className="sticky top-16 z-40 glass border-b border-white/5">
                <div className="max-w-7xl mx-auto px-5 md:px-8 py-4 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            data-testid="search-input"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Rechercher un tuto…"
                            className="w-full pl-10 pr-4 py-2.5 rounded-md bg-[#0b0b12] border border-white/10 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50"
                        />
                    </div>
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                        <SlidersHorizontal className="w-4 h-4 text-zinc-500 mr-1 shrink-0" />
                        <CategoryPill
                            active={category === "all"}
                            onClick={() => setCategory("all")}
                            label="Tous"
                        />
                        {categories.map((c) => (
                            <CategoryPill
                                key={c.id}
                                active={category === c.id}
                                onClick={() => setCategory(c.id)}
                                label={c.name}
                                testId={`filter-${c.id}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-12">
                <div className="max-w-7xl mx-auto px-5 md:px-8">
                    {loading ? (
                        <div className="text-zinc-500 text-sm py-10 text-center">
                            Chargement…
                        </div>
                    ) : tutorials.length === 0 ? (
                        <div className="text-center py-20 text-zinc-500">
                            Aucun tutoriel trouvé.
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tutorials.map((t, i) => (
                                <TutorialCard key={t.id} tutorial={t} index={i} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

function CategoryPill({ active, onClick, label, testId }) {
    return (
        <button
            onClick={onClick}
            data-testid={testId}
            className={`shrink-0 px-3.5 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${
                active
                    ? "bg-cyan-500 text-black"
                    : "bg-[#0b0b12] text-zinc-400 border border-white/10 hover:border-cyan-500/40 hover:text-white"
            }`}
        >
            {label}
        </button>
    );
}
