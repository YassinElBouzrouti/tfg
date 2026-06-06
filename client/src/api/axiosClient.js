import axios from 'axios';
import { getAuthToken } from '../utils/authSession.js';

const PRODUCTION_API_URL = 'https://tfg-server-88vo.vercel.app/api';

const resolvedApiBaseURL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:3000/api' : PRODUCTION_API_URL);

const axiosClient = axios.create({
  baseURL: resolvedApiBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosClient;
