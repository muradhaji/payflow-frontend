import axios from 'axios';

const api = axios.create({
  baseURL:
    import.meta.env.API_BASE_URL ||
    'https://payflow-backend-2aid.onrender.com/',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');
  if (user) {
    const parsed = JSON.parse(user);
    if (parsed.token) {
      config.headers.Authorization = `Bearer ${parsed.token}`;
    }
  }
  return config;
});

export default api;
