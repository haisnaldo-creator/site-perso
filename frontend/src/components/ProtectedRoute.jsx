import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, requireCreator = false }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading || user === null) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="text-zinc-500 text-sm">Chargement…</div>
            </div>
        );
    }
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    if (requireCreator && user.role !== "creator") {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="max-w-md text-center px-6">
                    <div className="text-rose-400 font-display font-bold text-xl mb-2">
                        Accès refusé
                    </div>
                    <p className="text-zinc-500 text-sm">
                        Seul le rôle <span className="text-cyan-400">Créateur</span>{" "}
                        peut accéder à cette section.
                    </p>
                </div>
            </div>
        );
    }
    return children;
}
