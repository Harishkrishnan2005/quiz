import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  addBookmarkRequest,
  fetchAttemptStatusRequest,
  fetchAttemptRequest,
  fetchBookmarksRequest,
  fetchLeaderboardRequest,
  fetchQuestionsRequest,
  removeBookmarkRequest,
  retakeQuizRequest,
  submitQuizRequest
} from "../../api/quizApi";
import { getApiErrorMessage } from "../../utils/apiError";
import { notifyError, notifySuccess } from "../../utils/toast";

const initialState = {
  questions: [],
  currentAttempt: null,
  attemptStatus: null,
  retakeMeta: null,
  leaderboard: [],
  bookmarks: [],
  loading: false
};

export const fetchQuestions = createAsyncThunk("quiz/fetchQuestions", async (category, thunkAPI) => {
  try {
    const { data } = await fetchQuestionsRequest(category);
    return data.questions;
  } catch (error) {
    notifyError(getApiErrorMessage(error, "Unable to load questions"));
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

export const fetchAttemptStatus = createAsyncThunk("quiz/fetchAttemptStatus", async (category, thunkAPI) => {
  try {
    const { data } = await fetchAttemptStatusRequest(category);
    return {
      attempted: data.attempted,
      latestResult: data.latestResult || null
    };
  } catch (error) {
    notifyError(getApiErrorMessage(error, "Unable to load previous attempt"));
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

export const submitQuiz = createAsyncThunk("quiz/submitQuiz", async (payload, thunkAPI) => {
  try {
    const { data } = await submitQuizRequest(payload);
    notifySuccess("Quiz submitted");
    return data.attempt;
  } catch (error) {
    notifyError(getApiErrorMessage(error, "Quiz submission failed"));
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

export const fetchAttempt = createAsyncThunk("quiz/fetchAttempt", async (attemptId, thunkAPI) => {
  try {
    const { data } = await fetchAttemptRequest(attemptId);
    return data.attempt;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

export const retakeQuiz = createAsyncThunk("quiz/retakeQuiz", async (category, thunkAPI) => {
  try {
    const { data } = await retakeQuizRequest(category);
    return {
      questions: data.questions,
      retakeMeta: {
        attemptNumber: data.attemptNumber,
        previousResult: data.previousResult
      }
    };
  } catch (error) {
    notifyError(getApiErrorMessage(error, "Unable to retake quiz"));
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

export const fetchLeaderboard = createAsyncThunk("quiz/fetchLeaderboard", async (_, thunkAPI) => {
  try {
    const { data } = await fetchLeaderboardRequest();
    return data.leaderboard;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

export const fetchBookmarks = createAsyncThunk("quiz/fetchBookmarks", async (_, thunkAPI) => {
  try {
    const { data } = await fetchBookmarksRequest();
    return data.bookmarks;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

export const addBookmark = createAsyncThunk("quiz/addBookmark", async (questionId, thunkAPI) => {
  try {
    const { data } = await addBookmarkRequest(questionId);
    notifySuccess("Bookmarked");
    return data.bookmark;
  } catch (error) {
    notifyError(getApiErrorMessage(error, "Unable to bookmark question"));
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

export const removeBookmark = createAsyncThunk("quiz/removeBookmark", async (questionId, thunkAPI) => {
  try {
    await removeBookmarkRequest(questionId);
    notifySuccess("Bookmark removed");
    return questionId;
  } catch (error) {
    notifyError(getApiErrorMessage(error, "Unable to remove bookmark"));
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    clearQuizSession: (state) => {
      state.questions = [];
      state.currentAttempt = null;
      state.attemptStatus = null;
      state.retakeMeta = null;
      state.loading = false;
    },
    clearCurrentAttempt: (state) => {
      state.currentAttempt = null;
    },
    clearAttemptStatus: (state) => {
      state.attemptStatus = null;
      state.retakeMeta = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.questions = [];
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchAttemptStatus.pending, (state) => {
        state.loading = true;
        state.questions = [];
        state.attemptStatus = null;
        state.retakeMeta = null;
      })
      .addCase(fetchAttemptStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.attemptStatus = action.payload;
      })
      .addCase(fetchAttemptStatus.rejected, (state) => {
        state.loading = false;
      })
      .addCase(submitQuiz.fulfilled, (state, action) => {
        state.currentAttempt = action.payload;
        state.attemptStatus = null;
        state.retakeMeta = null;
      })
      .addCase(fetchAttempt.fulfilled, (state, action) => {
        state.currentAttempt = action.payload;
      })
      .addCase(retakeQuiz.pending, (state) => {
        state.loading = true;
        state.questions = [];
        state.attemptStatus = null;
        state.retakeMeta = null;
      })
      .addCase(retakeQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload.questions;
        state.retakeMeta = action.payload.retakeMeta;
        state.currentAttempt = null;
      })
      .addCase(retakeQuiz.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.leaderboard = action.payload;
      })
      .addCase(fetchBookmarks.fulfilled, (state, action) => {
        state.bookmarks = action.payload;
      })
      .addCase(addBookmark.fulfilled, (state, action) => {
        state.bookmarks.unshift(action.payload);
      })
      .addCase(removeBookmark.fulfilled, (state, action) => {
        state.bookmarks = state.bookmarks.filter((bookmark) => bookmark.questionId?._id !== action.payload);
      });
  }
});

export const { clearAttemptStatus, clearCurrentAttempt, clearQuizSession } = quizSlice.actions;
export default quizSlice.reducer;
