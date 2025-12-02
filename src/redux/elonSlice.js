import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🔹 Async Thunklar

export const fetchElonlar = createAsyncThunk(
  "elon/fetchElonlar",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("http://localhost:5000/api/elons");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchSavedElons = createAsyncThunk(
  "elon/fetchSavedElons",
  async (token, { rejectWithValue }) => {
    if (!token) return [];
    try {
      const res = await axios.get("http://localhost:5000/api/users/saved-elons", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.savedElons;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const saveElon = createAsyncThunk(
  "elon/saveElon",
  async ({ id, token }, { rejectWithValue }) => {
    if (!token) return [];
    try {
      const res = await axios.post(
        `http://localhost:5000/api/users/save-elon/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.savedElons;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteElon = createAsyncThunk(
  "elon/deleteElon",
  async ({ id, token }, { rejectWithValue }) => {
    if (!token) return rejectWithValue("No token");
    try {
      await axios.delete(`http://localhost:5000/api/elons/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id; // o‘chirgan id ni reducerga yuboramiz
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const elonSlice = createSlice({
  name: "elon",
  initialState: {
    elonlar: [],
    savedElons: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // fetchElonlar
    builder
      .addCase(fetchElonlar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchElonlar.fulfilled, (state, action) => {
        state.loading = false;
        state.elonlar = action.payload;
      })
      .addCase(fetchElonlar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // fetchSavedElons
    builder
      .addCase(fetchSavedElons.fulfilled, (state, action) => {
        state.savedElons = action.payload;
      });

    // saveElon
    builder
      .addCase(saveElon.fulfilled, (state, action) => {
        state.savedElons = action.payload;
      });

    // deleteElon
    builder
      .addCase(deleteElon.fulfilled, (state, action) => {
        state.elonlar = state.elonlar.filter((item) => item._id !== action.payload);
      });
  },
});

export default elonSlice.reducer;
