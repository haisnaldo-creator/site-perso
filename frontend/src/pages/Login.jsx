import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { formatApiError } from "../lib/api";
import { LogIn, Shield, AlertCircle } from "lucide-react";

export default function Login() {
    const { login } = useAuth();
    const nav = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/admin";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            await login(email, password);
            nav(from, { replace: true });
        } catch (err) {
            setError(formatApiError(err));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div
            data-testid="login-page"
            className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-5"
        >
            <div className="absolute inset-0 bg-grid opacity-25 pointer-events-none" />
            <div className="relative w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6">
                        <Shield className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-[11px] uppercase tracking-[0.2em] text-cyan-400 font-semibold">
                            Espace admin
                        </span>
                    </div>
                    <h1 className="font-display font-black text-3xl md:text-4xl text-white tracking-tight mb-2">
                        Connexion
                    </h1>
                    <p className="text-sm text-zinc-500">
                        Connecte-toi pour gérer les tutoriels et les utilisateurs.
                    </p>
                </div>

                <form
                    onSubmit={onSubmit}
                    className="p-6 md:p-8 rounded-md bg-[#0b0b12] border border-white/5 space-y-5"
                >
                    <div>
                        <label className="block text-[11px] uppercase tracking-[0.18em] text-zinc-500 font-semibold mb-2">
                            Email
                        </label>
                        <input
                            data-testid="login-email-input"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-md bg-[#05050a] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                            placeholder="createur@mouette.gg"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] uppercase tracking-[0.18em] text-zinc-500 font-semibold mb-2">
                            Mot de passe
                        </label>
                        <input
                            data-testid="login-password-input"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-md bg-[#05050a] border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div
                            data-testid="login-error"
                            className="flex items-start gap-2 p-3 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm"
                        >
                            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        data-testid="login-submit-btn"
                        type="submit"
                        disabled={submitting}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-cyan-500 text-black text-sm font-bold uppercase tracking-wider hover:bg-cyan-400 transition-colors disabled:opacity-50"
                    >
                        <LogIn className="w-4 h-4" />
                        {submitting ? "Connexion…" : "Se connecter"}
                    </button>

                    <div className="pt-3 border-t border-white/5 text-center">
                        <Link
                            to="/"
                            className="text-xs text-zinc-500 hover:text-cyan-400"
                        >
                            ← Retour à l'accueil
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
