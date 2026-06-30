import axios from "axios";

const BASE_URL = import.meta.env.MODE === "development"
  ? "http://localhost:3001/api"
  : "https://ganeshsbsa08-me-mern-xexit.onrender.com/api"; 

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;