import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({
    baseURL: API,
});

// Attach token from localStorage
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("mouette_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// On 401, clear token and let UI react
api.interceptors.response.use(
    (r) => r,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("mouette_token");
        }
        return Promise.reject(error);
    }
);

export function formatApiError(err) {
    const detail = err?.response?.data?.detail;
    if (!detail) return err?.message || "Une erreur est survenue.";
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail))
        return detail
            .map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e)))
            .join(" ");
    return String(detail);
}
