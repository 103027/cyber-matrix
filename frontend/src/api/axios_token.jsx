import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:5000",
});

// Interceptor to add Authorization and Content-Type headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Add Content-Type header if not already set
        if (!config.headers['Content-Type']) {
            config.headers['Content-Type'] = 'application/json'; // Set default content type
        }
        
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;