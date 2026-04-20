import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api, formatApiError } from "../lib/api";
import {
    Plus,
    Trash2,
    Pencil,
    Users as UsersIcon,
    BookOpen,
    Shield,
    X,
    Save,
    Eye,
    EyeOff,
} from "lucide-react";
import { toast, Toaster } from "sonner";

export default function AdminDashboard() {
    const { user } = useAuth();
    const [tab, setTab] = useState("tutorials");

    const tabs = [
        { id: "tutorials", label: "Tutoriels", icon: BookOpen },
        ...(user?.role === "creator"
            ? [{ id: "users", label: "Utilisateurs", icon: UsersIcon }]
            : []),
    ];

    return (
        <div data-testid="admin-dashboard" className="min-h-screen">
            <Toaster theme="dark" position="top-right" richColors />
            <section className="pt-14 pb-8 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-5 md:px-8">
                    <div className="flex items-center gap-2 mb-3">
                        <Shield className="w-4 h-4 text-cyan-400" />
                        <span className="text-[11px] uppercase tracking-[0.2em] text-cyan-400 font-semibold">
                            {user?.role === "creator" ? "Créateur" : "Admin"}
                        </span>
                    </div>
                    <h1 className="font-display font-black text-3xl md:text-5xl text-white tracking-tight">
                        Tableau de bord
                    </h1>
                    <p className="text-zinc-500 mt-2">
                        Bienvenue {user?.name}. Gère le contenu du site depuis ici.
                    </p>

                    <div className="flex items-center gap-1 mt-8 border-b border-white/5">
                        {tabs.map((t) => (
                            <button
                                key={t.id}
                                data-testid={`admin-tab-${t.id}`}
                                onClick={() => setTab(t.id)}
                                className={`px-4 py-3 text-sm font-semibold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 ${
                                    tab === t.id
                                        ? "text-cyan-400 border-cyan-500"
                                        : "text-zinc-500 border-transparent hover:text-white"
                                }`}
                            >
                                <t.icon className="w-4 h-4" />
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-10">
                <div className="max-w-7xl mx-auto px-5 md:px-8">
                    {tab === "tutorials" && <TutorialsManager />}
                    {tab === "users" && user?.role === "creator" && <UsersManager />}
                </div>
            </section>
        </div>
    );
}

// ============ TUTORIALS MANAGER ============
function TutorialsManager() {
    const [items, setItems] = useState([]);
    const [editing, setEditing] = useState(null); // tutorial or "new"

    async function load() {
        const r = await api.get("/admin/tutorials");
        setItems(r.data);
    }
    useEffect(() => {
        load();
    }, []);

    async function remove(t) {
        if (!window.confirm(`Supprimer "${t.title}" ?`)) return;
        try {
            await api.delete(`/admin/tutorials/${t.id}`);
            toast.success("Tutoriel supprimé");
            load();
        } catch (err) {
            toast.error(formatApiError(err));
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="font-display font-bold text-xl text-white">
                        Tutoriels ({items.length})
                    </h2>
                    <p className="text-sm text-zinc-500">
                        Crée, édite ou supprime les tutoriels publiés.
                    </p>
                </div>
                <button
                    data-testid="new-tutorial-btn"
                    onClick={() => setEditing("new")}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-cyan-500 text-black text-xs font-bold uppercase tracking-wider hover:bg-cyan-400 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Nouveau tuto
                </button>
            </div>

            <div className="rounded-md border border-white/5 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-[#0b0b12]">
                        <tr className="text-left text-[11px] uppercase tracking-wider text-zinc-500">
                            <th className="py-3 px-4 font-semibold">Titre</th>
                            <th className="py-3 px-4 font-semibold hidden md:table-cell">
                                Catégorie
                            </th>
                            <th className="py-3 px-4 font-semibold hidden md:table-cell">
                                Statut
                            </th>
                            <th className="py-3 px-4 font-semibold text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((t) => (
                            <tr
                                key={t.id}
                                className="border-t border-white/5 hover:bg-white/[0.02]"
                            >
                                <td className="py-3 px-4">
                                    <div className="font-semibold text-white">
                                        {t.title}
                                    </div>
                                    <div className="text-xs text-zinc-500 truncate max-w-md">
                                        {t.description}
                                    </div>
                                </td>
                                <td className="py-3 px-4 hidden md:table-cell text-zinc-400">
                                    {t.category}
                                </td>
                                <td className="py-3 px-4 hidden md:table-cell">
                                    <span
                                        className={`inline-flex items-center gap-1 text-xs ${
                                            t.published
                                                ? "text-emerald-400"
                                                : "text-zinc-500"
                                        }`}
                                    >
                                        {t.published ? (
                                            <Eye className="w-3 h-3" />
                                        ) : (
                                            <EyeOff className="w-3 h-3" />
                                        )}
                                        {t.published ? "Publié" : "Brouillon"}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                    <button
                                        data-testid={`edit-tutorial-${t.slug}`}
                                        onClick={() => setEditing(t)}
                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-cyan-400 hover:bg-cyan-500/10 text-xs font-semibold"
                                    >
                                        <Pencil className="w-3 h-3" />
                                        Éditer
                                    </button>
                                    <button
                                        data-testid={`delete-tutorial-${t.slug}`}
                                        onClick={() => remove(t)}
                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-rose-400 hover:bg-rose-500/10 text-xs font-semibold ml-1"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                        Suppr.
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editing && (
                <TutorialEditor
                    tutorial={editing === "new" ? null : editing}
                    onClose={() => setEditing(null)}
                    onSaved={() => {
                        setEditing(null);
                        load();
                    }}
                />
            )}
        </div>
    );
}

function TutorialEditor({ tutorial, onClose, onSaved }) {
    const blank = {
        title: "",
        category: "fivem",
        description: "",
        thumbnail: "",
        difficulty: "Débutant",
        duration: "10 min",
        published: true,
        featured: false,
        steps: [{ number: 1, title: "", content: "" }],
    };
    const [form, setForm] = useState(tutorial || blank);
    const [saving, setSaving] = useState(false);

    function update(k, v) {
        setForm((f) => ({ ...f, [k]: v }));
    }
    function updateStep(idx, k, v) {
        setForm((f) => ({
            ...f,
            steps: f.steps.map((s, i) => (i === idx ? { ...s, [k]: v } : s)),
        }));
    }
    function addStep() {
        setForm((f) => ({
            ...f,
            steps: [
                ...f.steps,
                { number: f.steps.length + 1, title: "", content: "" },
            ],
        }));
    }
    function removeStep(idx) {
        setForm((f) => ({
            ...f,
            steps: f.steps
                .filter((_, i) => i !== idx)
                .map((s, i) => ({ ...s, number: i + 1 })),
        }));
    }

    async function save() {
        setSaving(true);
        try {
            const payload = { ...form };
            if (tutorial) {
                await api.patch(`/admin/tutorials/${tutorial.id}`, payload);
                toast.success("Tutoriel mis à jour");
            } else {
                await api.post("/admin/tutorials", payload);
                toast.success("Tutoriel créé");
            }
            onSaved();
        } catch (err) {
            toast.error(formatApiError(err));
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="min-h-screen flex items-start justify-center p-4 md:p-8">
                <div className="w-full max-w-3xl bg-[#0b0b12] border border-white/10 rounded-md shadow-2xl">
                    <div className="flex items-center justify-between p-5 border-b border-white/5">
                        <h3 className="font-display font-bold text-xl text-white">
                            {tutorial ? "Éditer le tuto" : "Nouveau tuto"}
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded text-zinc-500 hover:text-white hover:bg-white/5"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-5 space-y-5 max-h-[calc(100vh-14rem)] overflow-y-auto">
                        <Field label="Titre">
                            <input
                                value={form.title}
                                onChange={(e) => update("title", e.target.value)}
                                className="inp"
                            />
                        </Field>
                        <div className="grid md:grid-cols-2 gap-4">
                            <Field label="Catégorie">
                                <select
                                    value={form.category}
                                    onChange={(e) => update("category", e.target.value)}
                                    className="inp"
                                >
                                    {[
                                        "fivem",
                                        "reshade",
                                        "pack-graphique",
                                        "optimisation",
                                        "mods",
                                        "crosshair",
                                        "manette",
                                    ].map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                            <Field label="Difficulté">
                                <select
                                    value={form.difficulty}
                                    onChange={(e) =>
                                        update("difficulty", e.target.value)
                                    }
                                    className="inp"
                                >
                                    <option>Débutant</option>
                                    <option>Intermédiaire</option>
                                    <option>Avancé</option>
                                </select>
                            </Field>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <Field label="Durée">
                                <input
                                    value={form.duration}
                                    onChange={(e) => update("duration", e.target.value)}
                                    className="inp"
                                    placeholder="10 min"
                                />
                            </Field>
                            <Field label="Thumbnail (URL)">
                                <input
                                    value={form.thumbnail || ""}
                                    onChange={(e) => update("thumbnail", e.target.value)}
                                    className="inp"
                                    placeholder="https://..."
                                />
                            </Field>
                        </div>
                        <Field label="Description">
                            <textarea
                                value={form.description}
                                onChange={(e) => update("description", e.target.value)}
                                rows={3}
                                className="inp"
                            />
                        </Field>

                        <div className="flex items-center gap-5">
                            <Toggle
                                label="Publié"
                                value={form.published}
                                onChange={(v) => update("published", v)}
                            />
                            <Toggle
                                label="Populaire"
                                value={form.featured}
                                onChange={(v) => update("featured", v)}
                            />
                        </div>

                        <div className="pt-4 border-t border-white/5">
                            <div className="flex items-center justify-between mb-3">
                                <label className="text-[11px] uppercase tracking-[0.18em] text-zinc-500 font-semibold">
                                    Étapes ({form.steps.length})
                                </label>
                                <button
                                    onClick={addStep}
                                    className="text-xs text-cyan-400 font-semibold hover:underline"
                                >
                                    + Ajouter
                                </button>
                            </div>
                            <div className="space-y-4">
                                {form.steps.map((s, i) => (
                                    <div
                                        key={i}
                                        className="p-4 rounded bg-[#05050a] border border-white/5 space-y-2"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-cyan-400 font-bold uppercase">
                                                Étape {s.number}
                                            </span>
                                            <button
                                                onClick={() => removeStep(i)}
                                                className="text-rose-400 text-xs hover:underline"
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                        <input
                                            value={s.title}
                                            placeholder="Titre de l'étape"
                                            onChange={(e) =>
                                                updateStep(i, "title", e.target.value)
                                            }
                                            className="inp"
                                        />
                                        <textarea
                                            value={s.content || ""}
                                            placeholder="Contenu"
                                            rows={3}
                                            onChange={(e) =>
                                                updateStep(i, "content", e.target.value)
                                            }
                                            className="inp"
                                        />
                                        <textarea
                                            value={s.code || ""}
                                            placeholder="Code (optionnel)"
                                            rows={2}
                                            onChange={(e) =>
                                                updateStep(i, "code", e.target.value)
                                            }
                                            className="inp font-mono text-xs"
                                        />
                                        <input
                                            value={s.link || ""}
                                            placeholder="Lien externe (optionnel)"
                                            onChange={(e) =>
                                                updateStep(i, "link", e.target.value)
                                            }
                                            className="inp"
                                        />
                                        <input
                                            value={s.warning || ""}
                                            placeholder="Avertissement (optionnel)"
                                            onChange={(e) =>
                                                updateStep(i, "warning", e.target.value)
                                            }
                                            className="inp"
                                        />
                                        <input
                                            value={s.tip || ""}
                                            placeholder="Astuce (optionnel)"
                                            onChange={(e) =>
                                                updateStep(i, "tip", e.target.value)
                                            }
                                            className="inp"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 p-5 border-t border-white/5 bg-[#07070c]">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded text-zinc-400 hover:text-white text-sm"
                        >
                            Annuler
                        </button>
                        <button
                            data-testid="save-tutorial-btn"
                            onClick={save}
                            disabled={saving}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-cyan-500 text-black text-xs font-bold uppercase tracking-wider hover:bg-cyan-400 disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {saving ? "Enregistrement…" : "Enregistrer"}
                        </button>
                    </div>
                </div>
            </div>
            <style>{`.inp{width:100%;padding:0.6rem 0.75rem;border-radius:0.375rem;background:#05050a;border:1px solid rgba(255,255,255,0.08);color:#fff;font-size:0.875rem;outline:none}.inp:focus{border-color:rgba(0,229,255,0.5)}`}</style>
        </div>
    );
}

function Field({ label, children }) {
    return (
        <div>
            <label className="block text-[11px] uppercase tracking-[0.18em] text-zinc-500 font-semibold mb-2">
                {label}
            </label>
            {children}
        </div>
    );
}

function Toggle({ label, value, onChange }) {
    return (
        <label className="inline-flex items-center gap-2 cursor-pointer">
            <button
                type="button"
                onClick={() => onChange(!value)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? "bg-cyan-500" : "bg-zinc-700"
                }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        value ? "translate-x-6" : "translate-x-1"
                    }`}
                />
            </button>
            <span className="text-sm text-zinc-300">{label}</span>
        </label>
    );
}

// ============ USERS MANAGER ============
function UsersManager() {
    const { user: current } = useAuth();
    const [users, setUsers] = useState([]);
    const [editing, setEditing] = useState(null);

    async function load() {
        const r = await api.get("/users");
        setUsers(r.data);
    }
    useEffect(() => {
        load();
    }, []);

    async function remove(u) {
        if (!window.confirm(`Supprimer ${u.email} ?`)) return;
        try {
            await api.delete(`/users/${u.id}`);
            toast.success("Utilisateur supprimé");
            load();
        } catch (err) {
            toast.error(formatApiError(err));
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="font-display font-bold text-xl text-white">
                        Utilisateurs ({users.length})
                    </h2>
                    <p className="text-sm text-zinc-500">
                        Gère les accès admin. Seul le Créateur voit cet onglet.
                    </p>
                </div>
                <button
                    data-testid="new-user-btn"
                    onClick={() => setEditing("new")}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-cyan-500 text-black text-xs font-bold uppercase tracking-wider hover:bg-cyan-400"
                >
                    <Plus className="w-4 h-4" />
                    Nouvel utilisateur
                </button>
            </div>

            <div className="rounded-md border border-white/5 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-[#0b0b12]">
                        <tr className="text-left text-[11px] uppercase tracking-wider text-zinc-500">
                            <th className="py-3 px-4 font-semibold">Nom</th>
                            <th className="py-3 px-4 font-semibold">Email</th>
                            <th className="py-3 px-4 font-semibold">Rôle</th>
                            <th className="py-3 px-4 font-semibold text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr
                                key={u.id}
                                className="border-t border-white/5 hover:bg-white/[0.02]"
                            >
                                <td className="py-3 px-4 text-white font-semibold">
                                    {u.name}
                                </td>
                                <td className="py-3 px-4 text-zinc-400">{u.email}</td>
                                <td className="py-3 px-4">
                                    <span
                                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold ${
                                            u.role === "creator"
                                                ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                                                : "bg-white/5 text-zinc-300 border border-white/10"
                                        }`}
                                    >
                                        {u.role === "creator" ? "Créateur" : "Admin"}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                    <button
                                        data-testid={`edit-user-${u.email}`}
                                        onClick={() => setEditing(u)}
                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-cyan-400 hover:bg-cyan-500/10 text-xs font-semibold"
                                    >
                                        <Pencil className="w-3 h-3" />
                                        Éditer
                                    </button>
                                    {u.id !== current.id && (
                                        <button
                                            data-testid={`delete-user-${u.email}`}
                                            onClick={() => remove(u)}
                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-rose-400 hover:bg-rose-500/10 text-xs font-semibold ml-1"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                            Suppr.
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editing && (
                <UserEditor
                    user={editing === "new" ? null : editing}
                    onClose={() => setEditing(null)}
                    onSaved={() => {
                        setEditing(null);
                        load();
                    }}
                />
            )}
        </div>
    );
}

function UserEditor({ user, onClose, onSaved }) {
    const [form, setForm] = useState(
        user
            ? {
                  name: user.name,
                  email: user.email,
                  role: user.role,
                  password: "",
              }
            : { name: "", email: "", role: "admin", password: "" }
    );
    const [saving, setSaving] = useState(false);

    async function save() {
        setSaving(true);
        try {
            if (user) {
                const payload = {};
                if (form.name !== user.name) payload.name = form.name;
                if (form.role !== user.role) payload.role = form.role;
                if (form.password) payload.password = form.password;
                await api.patch(`/users/${user.id}`, payload);
                toast.success("Utilisateur mis à jour");
            } else {
                await api.post("/users", form);
                toast.success("Utilisateur créé");
            }
            onSaved();
        } catch (err) {
            toast.error(formatApiError(err));
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#0b0b12] border border-white/10 rounded-md">
                <div className="flex items-center justify-between p-5 border-b border-white/5">
                    <h3 className="font-display font-bold text-lg text-white">
                        {user ? "Éditer l'utilisateur" : "Nouvel utilisateur"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-zinc-500 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-5 space-y-4">
                    <Field label="Nom">
                        <input
                            data-testid="user-name-input"
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                            className="inp"
                        />
                    </Field>
                    <Field label="Email">
                        <input
                            data-testid="user-email-input"
                            type="email"
                            disabled={!!user}
                            value={form.email}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                            className="inp disabled:opacity-60"
                        />
                    </Field>
                    <Field label="Rôle">
                        <select
                            data-testid="user-role-select"
                            value={form.role}
                            onChange={(e) =>
                                setForm({ ...form, role: e.target.value })
                            }
                            className="inp"
                        >
                            <option value="admin">Admin</option>
                            <option value="creator">Créateur</option>
                        </select>
                    </Field>
                    <Field
                        label={
                            user
                                ? "Nouveau mot de passe (laisser vide pour conserver)"
                                : "Mot de passe"
                        }
                    >
                        <input
                            data-testid="user-password-input"
                            type="password"
                            value={form.password}
                            onChange={(e) =>
                                setForm({ ...form, password: e.target.value })
                            }
                            className="inp"
                            placeholder="••••••"
                        />
                    </Field>
                </div>
                <div className="flex items-center justify-end gap-2 p-5 border-t border-white/5">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded text-zinc-400 hover:text-white text-sm"
                    >
                        Annuler
                    </button>
                    <button
                        data-testid="save-user-btn"
                        onClick={save}
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-cyan-500 text-black text-xs font-bold uppercase tracking-wider hover:bg-cyan-400 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        Enregistrer
                    </button>
                </div>
            </div>
            <style>{`.inp{width:100%;padding:0.6rem 0.75rem;border-radius:0.375rem;background:#05050a;border:1px solid rgba(255,255,255,0.08);color:#fff;font-size:0.875rem;outline:none}.inp:focus{border-color:rgba(0,229,255,0.5)}`}</style>
        </div>
    );
}
