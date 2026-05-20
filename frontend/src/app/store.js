import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import quizReducer from "../features/quiz/quizSlice";
import userReducer from "../features/user/userSlice";
import adminReducer from "../features/admin/adminSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quiz: quizReducer,
    user: userReducer,
    admin: adminReducer
  }
});
