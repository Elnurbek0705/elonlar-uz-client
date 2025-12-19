import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async (token, { rejectWithValue }) => {
    if (!token) return rejectWithValue({ message: "No token" });
    try {
      const res = await axios.get(`${API}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.user ?? res.data;
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        return rejectWithValue({ unauthorized: true, message: err.response?.data || err.message });
      }
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      // Normalize payload to always contain { token, user }
      const token = action.payload?.token ?? action.payload?.token;
      const user = action.payload?.user ?? action.payload?.user ?? action.payload;
      state.userInfo = { token, user };
      localStorage.setItem("userInfo", JSON.stringify(state.userInfo));
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("token");
    },
    updateUserInfo: (state, action) => {
      if (state.userInfo) {
        // Support being passed either the user object directly or an object with { user }
        const payloadUser = action.payload?.user ?? action.payload;
        state.userInfo.user = { ...state.userInfo.user, ...payloadUser };
        localStorage.setItem("userInfo", JSON.stringify(state.userInfo));
      }
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      const user = action.payload;
      const token = state.userInfo?.token ?? localStorage.getItem("token");
      state.userInfo = { token, user };
      localStorage.setItem("userInfo", JSON.stringify(state.userInfo));
    });
    builder.addCase(fetchCurrentUser.rejected, (state, action) => {
      // If fetch failed (e.g., 401), clear stored user info to force re-login
      if (action.payload?.unauthorized) {
        state.userInfo = null;
        localStorage.removeItem("userInfo");
        localStorage.removeItem("token");
      }
    });
  }
});

export const { loginSuccess, logout, updateUserInfo } = userSlice.actions;
export default userSlice.reducer;
