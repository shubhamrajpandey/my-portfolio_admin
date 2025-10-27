import axios from "axios";

const API = axios.create({
  baseURL: "https://my-portfolio-backend-rnsi.onrender.com",
});

// Attach token if exists
API.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
