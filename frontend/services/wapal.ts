import axios from "axios";

export const wapal = axios.create({
  baseURL: import.meta.env.VITE_WAPAL_AGGREGATOR_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
