import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { loginRequest, logoutRequest, profileRequest, registerRequest, updateProfileRequest } from "../../api/authApi";
import { getApiErrorMessage } from "../../utils/apiError";
import { notifyError, notifySuccess } from "../../utils/toast";

const initialState = {
  user: null,
  token: localStorage.getItem("skillforge_token") || "",
  loading: false
};

export const registerUser = createAsyncThunk("auth/register", async (payload, thunkAPI) => {
  try {
    const { data } = await registerRequest(payload);
    return data;
  } catch (error) {
    notifyError(getApiErrorMessage(error, "Registration failed"));
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

export const loginUser = createAsyncThunk("auth/login", async (payload, thunkAPI) => {
  try {
    const { data } = await loginRequest(payload);
    return data;
  } catch (error) {
    notifyError(getApiErrorMessage(error, "Login failed"));
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

export const loadProfile = createAsyncThunk("auth/profile", async (_, thunkAPI) => {
  try {
    const { data } = await profileRequest();
    return data.user;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

export const saveProfile = createAsyncThunk("auth/saveProfile", async (payload, thunkAPI) => {
  try {
    const { data } = await updateProfileRequest(payload);
    notifySuccess("Profile updated");
    return data.user;
  } catch (error) {
    notifyError(getApiErrorMessage(error, "Unable to update profile"));
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

export const signOut = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    await logoutRequest();
    notifySuccess("Signed out");
    return true;
  } catch (error) {
    notifyError(getApiErrorMessage(error, "Logout failed"));
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token || state.token;
      if (state.token) localStorage.setItem("skillforge_token", state.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = "";
      localStorage.removeItem("skillforge_token");
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("skillforge_token", action.payload.token);
        notifySuccess("Account created");
      })
      .addCase(registerUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("skillforge_token", action.payload.token);
        notifySuccess("Welcome back");
      })
      .addCase(loginUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(loadProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(saveProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.token = "";
        localStorage.removeItem("skillforge_token");
      });
  }
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
