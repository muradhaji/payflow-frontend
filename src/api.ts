import axios from 'axios';
import { STORAGE_KEYS } from './constants/common';

const api = axios.create({
  baseURL:
    import.meta.env.API_BASE_URL ||
    'https://payflow-backend-2aid.onrender.com/',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const user = localStorage.getItem(STORAGE_KEYS.USER);
  if (user) {
    const parsed = JSON.parse(user);
    if (parsed.token) {
      config.headers.Authorization = `Bearer ${parsed.token}`;
    }
  }
  return config;
});

export default api;
