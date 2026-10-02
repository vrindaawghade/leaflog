import axios from "axios";

// Backend URL: http://localhost:5000/api while developing.
// After deployment, set VITE_API_URL to your Render URL + /api
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

export default api;