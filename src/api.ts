import axios from 'axios';

const api = axios.create({
  baseURL:
    import.meta.env.API_BASE_URL ||
    'https://payflow-backend-2aid.onrender.com/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
