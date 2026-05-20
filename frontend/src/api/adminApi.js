import { apiClient } from "./client";

export const fetchAdminUsersRequest = () => apiClient.get("/admin/users");
export const blockUserRequest = (id) => apiClient.patch(`/admin/users/${id}/block`);
export const unblockUserRequest = (id) => apiClient.patch(`/admin/users/${id}/unblock`);
export const fetchAdminQuestionsRequest = () => apiClient.get("/admin/questions");
export const createQuestionRequest = (payload) => apiClient.post("/admin/questions", payload);
export const updateQuestionRequest = (id, payload) => apiClient.put(`/admin/questions/${id}`, payload);
export const deleteQuestionRequest = (id) => apiClient.delete(`/admin/questions/${id}`);
export const importQuestionsRequest = (payload) =>
  apiClient.post("/admin/questions/import-mcq", payload, {
    headers: { "Content-Type": "multipart/form-data" }
  });
export const fetchAnalyticsRequest = () => apiClient.get("/admin/analytics");
export const fetchGeneratedQuestionsRequest = () => apiClient.get("/admin/generated-questions");
export const saveGeneratedQuestionsRequest = (generatedId) =>
  apiClient.post("/admin/generated-questions/save", { generatedId });
export const generateMcqRequest = (payload, isFile = false) =>
  apiClient.post("/admin/ai/generate-mcq", payload, {
    headers: isFile ? { "Content-Type": "multipart/form-data" } : undefined
  });
