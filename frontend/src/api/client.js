import axios from "axios";

import { store } from "../app/store";
import { logout, setCredentials } from "../features/auth/authSlice";

const resolveApiBaseUrl = () => {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
  const fallbackBaseUrl = "http://localhost:5000/api";

  if (!configuredBaseUrl) {
    return fallbackBaseUrl;
  }

  try {
    const url = new URL(configuredBaseUrl);

    if (!url.pathname || url.pathname === "/") {
      url.pathname = "/api";
    }

    return url.toString().replace(/\/$/, "");
  } catch {
    return configuredBaseUrl.replace(/\/$/, "");
  }
};

export const apiClient = axios.create({
  baseURL: resolveApiBaseUrl(),
  withCredentials: true
});

apiClient.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export const hydrateSession = async () => {
  try {
    const response = await apiClient.get("/auth/profile");
    const state = store.getState().auth;
    store.dispatch(setCredentials({ user: response.data.user, token: state.token }));
  } catch {
    return null;
  }
  return true;
};
