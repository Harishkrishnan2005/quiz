import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  blockUserRequest,
  createQuestionRequest,
  deleteQuestionRequest,
  fetchAdminQuestionsRequest,
  fetchAdminUsersRequest,
  fetchAnalyticsRequest,
  fetchGeneratedQuestionsRequest,
  generateMcqRequest,
  importQuestionsRequest,
  saveGeneratedQuestionsRequest,
  unblockUserRequest,
  updateQuestionRequest
} from "../../api/adminApi";
import { getApiErrorMessage } from "../../utils/apiError";
import { notifyError, notifySuccess } from "../../utils/toast";

const initialState = {
  users: [],
  questions: [],
  generatedQuestions: [],
  analytics: null,
  loading: false
};

export const fetchAdminUsers = createAsyncThunk("admin/users", async () => {
  const { data } = await fetchAdminUsersRequest();
  return data.users;
});

export const toggleUserBlock = createAsyncThunk("admin/toggleBlock", async ({ id, blocked }, thunkAPI) => {
  try {
    const { data } = blocked ? await unblockUserRequest(id) : await blockUserRequest(id);
    notifySuccess(`User ${blocked ? "unblocked" : "blocked"}`);
    return data.user;
  } catch (error) {
    notifyError(getApiErrorMessage(error, "Unable to update user"));
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

export const fetchAdminQuestions = createAsyncThunk("admin/questions", async () => {
  const { data } = await fetchAdminQuestionsRequest();
  return data.questions;
});

export const saveQuestion = createAsyncThunk("admin/saveQuestion", async (payload, thunkAPI) => {
  try {
    const request = payload._id ? updateQuestionRequest(payload._id, payload) : createQuestionRequest(payload);
    const { data } = await request;
    notifySuccess(`Question ${payload._id ? "updated" : "created"}`);
    return data.question;
  } catch (error) {
    notifyError(getApiErrorMessage(error, "Unable to save question"));
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

export const deleteQuestion = createAsyncThunk("admin/deleteQuestion", async (id, thunkAPI) => {
  try {
    await deleteQuestionRequest(id);
    notifySuccess("Question deleted");
    return id;
  } catch (error) {
    notifyError(getApiErrorMessage(error, "Unable to delete question"));
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

export const importQuestions = createAsyncThunk("admin/importQuestions", async (payload, thunkAPI) => {
  try {
    const { data } = await importQuestionsRequest(payload);
    notifySuccess(`${data.savedQuestions.length} questions imported`);
    return data.savedQuestions;
  } catch (error) {
    notifyError(getApiErrorMessage(error, "Unable to import MCQs from the document"));
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

export const fetchAdminAnalytics = createAsyncThunk("admin/analytics", async () => {
  const { data } = await fetchAnalyticsRequest();
  return data.analytics;
});

export const fetchGeneratedSets = createAsyncThunk("admin/generatedSets", async () => {
  const { data } = await fetchGeneratedQuestionsRequest();
  return data.generatedQuestions;
});

export const generateMcq = createAsyncThunk("admin/generateMcq", async ({ payload, isFile }, thunkAPI) => {
  try {
    const { data } = await generateMcqRequest(payload, isFile);
    notifySuccess("AI questions generated");
    return data.generated;
  } catch (error) {
    notifyError(getApiErrorMessage(error, "AI generation failed"));
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

export const saveGeneratedSet = createAsyncThunk("admin/saveGeneratedSet", async (generatedId, thunkAPI) => {
  try {
    await saveGeneratedQuestionsRequest(generatedId);
    notifySuccess("Generated questions saved");
    return generatedId;
  } catch (error) {
    notifyError(getApiErrorMessage(error, "Unable to save generated questions"));
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(toggleUserBlock.fulfilled, (state, action) => {
        state.users = state.users.map((user) => (user._id === action.payload._id ? action.payload : user));
      })
      .addCase(fetchAdminQuestions.fulfilled, (state, action) => {
        state.questions = action.payload;
      })
      .addCase(saveQuestion.fulfilled, (state, action) => {
        const index = state.questions.findIndex((question) => question._id === action.payload._id);
        if (index >= 0) state.questions[index] = action.payload;
        else state.questions.unshift(action.payload);
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.questions = state.questions.filter((question) => question._id !== action.payload);
      })
      .addCase(importQuestions.fulfilled, (state, action) => {
        state.questions = [...action.payload, ...state.questions];
      })
      .addCase(fetchAdminAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload;
      })
      .addCase(fetchGeneratedSets.fulfilled, (state, action) => {
        state.generatedQuestions = action.payload;
      })
      .addCase(generateMcq.fulfilled, (state, action) => {
        state.generatedQuestions.unshift(action.payload);
      });
  }
});

export default adminSlice.reducer;
