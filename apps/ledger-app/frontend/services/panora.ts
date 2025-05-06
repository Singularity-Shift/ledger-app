import axios from "axios";

export const panora = axios.create({
  baseURL: import.meta.env.VITE_PANORA_API_URL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": import.meta.env.VITE_PANORA_API_KEY,
  },
});
