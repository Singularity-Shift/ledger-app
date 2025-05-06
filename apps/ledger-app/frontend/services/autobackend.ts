import axios from "axios";

export const autobackend = axios.create({
  baseURL: import.meta.env.VITE_AUTO_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
