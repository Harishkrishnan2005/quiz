import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { fetchDashboardRequest, fetchHistoryRequest, fetchPerformanceRequest } from "../../api/quizApi";

const initialState = {
  dashboard: null,
  performance: null,
  history: [],
  loading: false
};

export const fetchDashboard = createAsyncThunk("user/dashboard", async () => {
  const { data } = await fetchDashboardRequest();
  return data.dashboard;
});

export const fetchPerformance = createAsyncThunk("user/performance", async () => {
  const { data } = await fetchPerformanceRequest();
  return data.performance;
});

export const fetchHistory = createAsyncThunk("user/history", async () => {
  const { data } = await fetchHistoryRequest();
  return data.history;
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchPerformance.fulfilled, (state, action) => {
        state.performance = action.payload;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.history = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state) => {
        state.loading = false;
      });
  }
});

export default userSlice.reducer;
