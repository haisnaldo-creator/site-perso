import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null); // null = checking, false = logged out
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("mouette_token");
        if (!token) {
            setUser(false);
            setLoading(false);
            return;
        }
        api
            .get("/auth/me")
            .then((res) => setUser(res.data))
            .catch(() => {
                localStorage.removeItem("mouette_token");
                setUser(false);
            })
            .finally(() => setLoading(false));
    }, []);

    async function login(email, password) {
        const res = await api.post("/auth/login", { email, password });
        localStorage.setItem("mouette_token", res.data.token);
        setUser(res.data.user);
        return res.data.user;
    }

    function logout() {
        localStorage.removeItem("mouette_token");
        setUser(false);
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
