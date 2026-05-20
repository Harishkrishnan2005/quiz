import { apiClient } from "./client";

export const fetchDashboardRequest = () => apiClient.get("/users/dashboard");
export const fetchPerformanceRequest = () => apiClient.get("/users/performance");
export const fetchHistoryRequest = () => apiClient.get("/users/history");
export const fetchQuestionsRequest = (category) => apiClient.get(`/quiz/questions/${encodeURIComponent(category)}`);
export const fetchAttemptStatusRequest = (category) => apiClient.get(`/quiz/attempt-status/${encodeURIComponent(category)}`);
export const submitQuizRequest = (payload) => apiClient.post("/quiz/submit", payload);
export const fetchAttemptRequest = (attemptId) => apiClient.get(`/quiz/score/${attemptId}`);
export const retakeQuizRequest = (category) => apiClient.post(`/quiz/retake/${encodeURIComponent(category)}`);
export const fetchLeaderboardRequest = () => apiClient.get("/leaderboard");
export const fetchBookmarksRequest = () => apiClient.get("/bookmarks");
export const addBookmarkRequest = (questionId) => apiClient.post("/bookmarks", { questionId });
export const removeBookmarkRequest = (questionId) => apiClient.delete(`/bookmarks/${questionId}`);
