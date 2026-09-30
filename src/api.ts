import axios from 'axios';
import { API_URL } from './config';

let token: string | null = null;
let onUnauthorized: (() => void) | null = null;

export const setToken = (t: string | null) => { token = t; };
export const setOnUnauthorized = (fn: () => void) => { onUnauthorized = fn; };

export const api = axios.create({ baseURL: API_URL, timeout: 15000 });

api.interceptors.request.use((config) => {
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) onUnauthorized?.();
    return Promise.reject(error);
  },
);
