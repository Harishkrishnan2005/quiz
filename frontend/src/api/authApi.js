import { apiClient } from "./client";

export const registerRequest = (payload) => apiClient.post("/auth/register", payload);
export const loginRequest = (payload) => apiClient.post("/auth/login", payload);
export const logoutRequest = () => apiClient.post("/auth/logout");
export const profileRequest = () => apiClient.get("/auth/profile");
export const updateProfileRequest = (payload) => apiClient.put("/auth/profile", payload);
