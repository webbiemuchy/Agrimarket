import axios from "axios";

const api = axios.create({
  baseURL: "https://agrimarket-1-zdum.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // optional if you need cookies
});

// Add token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Axios error:", error); // <-- debug Network Error
    if (!error.response) {
      // Likely CORS / URL / Network issue
      alert("Network error: Cannot reach server. Check API URL and CORS.");
    } else if (error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export default api;
