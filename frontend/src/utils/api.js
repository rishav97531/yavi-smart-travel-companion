import { auth } from "../firebase";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const API_BASE_URL = rawBaseUrl.endsWith("/")
    ? rawBaseUrl.slice(0, -1)
    : rawBaseUrl;

export const fetchWithAuth = async (url, options = {}) => {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("User not logged in");
    }

    const token = await user.getIdToken();

    const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers,
    };

    const targetUrl = url.startsWith("http")
        ? url
        : `${API_BASE_URL}${url.startsWith("/") ? url : `/${url}`}`;

    if (import.meta.env.DEV) {
        console.log(`🚀 API Request: ${options.method || 'GET'} ${targetUrl}`);
    }

    try {
        const response = await fetch(targetUrl, {
            ...options,
            headers,
        });

        if (response.status === 401) {
            console.warn('❌ Session expired or unauthorized. Please re-sign in.');
            // Optional: trigger logout or redirect
        }

        return response;
    } catch (error) {
        console.error('🌐 Network error:', error.message);
        throw error;
    }
};
