import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, Shield, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
    const { user, logout } = useAuth();
    const nav = useNavigate();
    const [open, setOpen] = useState(false);

    const links = [
        { to: "/", label: "Accueil", exact: true },
        { to: "/tutoriels", label: "Tutoriels" },
        { to: "/categories", label: "Catégories" },
        { to: "/a-propos", label: "À propos" },
    ];

    return (
        <header
            data-testid="site-header"
            className="sticky top-0 z-50 glass border-b border-white/5"
        >
            <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
                <Link
                    to="/"
                    data-testid="logo-link"
                    className="flex items-center gap-2.5 group"
                >
                    <div className="relative w-9 h-9 rounded-sm bg-[#d4a574]/10 border border-[#d4a574]/25 flex items-center justify-center overflow-hidden">
                        <span className="text-[#d4a574] font-display text-xl leading-none italic">
                            m
                        </span>
                    </div>
                    <div className="leading-tight">
                        <div className="font-display text-[19px] text-white tracking-tight leading-none">
                            Tête de Mouette
                        </div>
                        <div className="text-[10px] uppercase tracking-[0.18em] text-[#d4a574]/70 font-medium">
                            FiveM Hub
                        </div>
                    </div>
                </Link>

                <nav className="hidden md:flex items-center gap-1">
                    {links.map((l) => (
                        <NavLink
                            key={l.to}
                            to={l.to}
                            end={l.exact}
                            data-testid={`nav-${l.label.toLowerCase()}`}
                            className={({ isActive }) =>
                                `px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                    isActive
                                        ? "text-[#d4a574] bg-[#d4a574]/10"
                                        : "text-zinc-400 hover:text-white"
                                }`
                            }
                        >
                            {l.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    {user && typeof user === "object" ? (
                        <>
                            <Link
                                to="/admin"
                                data-testid="admin-dashboard-link"
                                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-[#d4a574]/25 bg-[#d4a574]/10 text-[#d4a574] text-xs font-semibold uppercase tracking-wider hover:bg-[#d4a574]/10 transition-colors"
                            >
                                <Shield className="w-3.5 h-3.5" />
                                Admin
                            </Link>
                            <button
                                data-testid="logout-button"
                                onClick={() => {
                                    logout();
                                    nav("/");
                                }}
                                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-zinc-400 hover:text-white text-xs font-medium"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                Déconnexion
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            data-testid="login-link"
                            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#d4a574] text-black text-xs font-bold uppercase tracking-wider hover:bg-[#e0b687] transition-colors"
                        >
                            Connexion
                        </Link>
                    )}
                    <button
                        data-testid="mobile-menu-toggle"
                        onClick={() => setOpen((o) => !o)}
                        className="md:hidden p-2 rounded-md text-white hover:bg-white/5"
                    >
                        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {open && (
                <div className="md:hidden border-t border-white/5 bg-black/80">
                    <div className="px-5 py-4 flex flex-col gap-1">
                        {links.map((l) => (
                            <NavLink
                                key={l.to}
                                to={l.to}
                                end={l.exact}
                                onClick={() => setOpen(false)}
                                className={({ isActive }) =>
                                    `px-4 py-3 rounded-md text-sm font-medium ${
                                        isActive
                                            ? "text-[#d4a574] bg-[#d4a574]/10"
                                            : "text-zinc-300"
                                    }`
                                }
                            >
                                {l.label}
                            </NavLink>
                        ))}
                        {user && typeof user === "object" ? (
                            <>
                                <Link
                                    to="/admin"
                                    onClick={() => setOpen(false)}
                                    className="px-4 py-3 rounded-md text-sm font-medium text-[#d4a574]"
                                >
                                    Tableau de bord admin
                                </Link>
                                <button
                                    onClick={() => {
                                        logout();
                                        setOpen(false);
                                        nav("/");
                                    }}
                                    className="text-left px-4 py-3 rounded-md text-sm font-medium text-zinc-300"
                                >
                                    Déconnexion
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                onClick={() => setOpen(false)}
                                className="mx-4 mt-1 text-center px-4 py-3 rounded-md bg-[#d4a574] text-black text-sm font-bold uppercase"
                            >
                                Connexion
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
