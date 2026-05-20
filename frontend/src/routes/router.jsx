import { createBrowserRouter } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import PublicLayout from "../layouts/PublicLayout";
import ProtectedRoute from "./ProtectedRoute";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import ProfilePage from "../pages/ProfilePage";
import CategoriesPage from "../pages/CategoriesPage";
import QuizPage from "../pages/QuizPage";
import ResultsPage from "../pages/ResultsPage";
import ReviewPage from "../pages/ReviewPage";
import BookmarksPage from "../pages/BookmarksPage";
import LeaderboardPage from "../pages/LeaderboardPage";
import PerformancePage from "../pages/PerformancePage";
import HistoryPage from "../pages/HistoryPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import ManageUsersPage from "../pages/ManageUsersPage";
import ManageQuestionsPage from "../pages/ManageQuestionsPage";
import QuestionFormPage from "../pages/QuestionFormPage";
import AiGeneratorPage from "../pages/AiGeneratorPage";
import AdminAnalyticsPage from "../pages/AdminAnalyticsPage";
import NotFoundPage from "../pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> }
    ]
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/profile", element: <ProfilePage /> },
          { path: "/categories", element: <CategoriesPage /> },
          { path: "/quiz/:category", element: <QuizPage /> },
          { path: "/results/:attemptId", element: <ResultsPage /> },
          { path: "/review/:attemptId", element: <ReviewPage /> },
          { path: "/bookmarks", element: <BookmarksPage /> },
          { path: "/leaderboard", element: <LeaderboardPage /> },
          { path: "/performance", element: <PerformancePage /> },
          { path: "/history", element: <HistoryPage /> }
        ]
      }
    ]
  },
  {
    element: <ProtectedRoute roles={["admin"]} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "/admin", element: <AdminDashboardPage /> },
          { path: "/admin/users", element: <ManageUsersPage /> },
          { path: "/admin/questions", element: <ManageQuestionsPage /> },
          { path: "/admin/questions/new", element: <QuestionFormPage /> },
          { path: "/admin/questions/:questionId/edit", element: <QuestionFormPage /> },
          { path: "/admin/ai-generator", element: <AiGeneratorPage /> },
          { path: "/admin/analytics", element: <AdminAnalyticsPage /> }
        ]
      }
    ]
  },
  { path: "*", element: <NotFoundPage /> }
]);
