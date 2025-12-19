import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:5000/api";

/* ===================== FETCH ELONLAR ===================== */
export const fetchElonlar = createAsyncThunk(
  "elon/fetchElonlar",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}/elons`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===================== FETCH SAVED ===================== */
export const fetchSavedElons = createAsyncThunk(
  "elon/fetchSavedElons",
  async (token, { rejectWithValue }) => {
    if (!token) return [];
    try {
      const res = await axios.get(`${API}/users/saved-elons`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data; // ⬅️ FULL OBJECT ARRAY
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===================== FETCH MY ===================== */
export const fetchMyElons = createAsyncThunk(
  "elon/fetchMyElons",
  async (token, { rejectWithValue }) => {
    if (!token) return [];
    try {
      const res = await axios.get(`${API}/elons/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===================== SAVE ELON ===================== */
export const saveElon = createAsyncThunk(
  "elon/saveElon",
  async ({ id, token }, { rejectWithValue }) => {
    if (!token) return rejectWithValue("No token");
    try {
      const res = await axios.post(
        `${API}/users/save-elon/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data; // ⬅️ saved elon OBJECT
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===================== UNSAVE ELON ===================== */
export const unsaveElon = createAsyncThunk(
  "elon/unsaveElon",
  async ({ id, token }, { rejectWithValue }) => {
    if (!token) return rejectWithValue("No token");
    try {
      await axios.delete(`${API}/users/save-elon/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===================== DELETE ELON ===================== */
export const deleteElon = createAsyncThunk(
  "elon/deleteElon",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API}/elons/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===================== FETCH BY ID ===================== */
export const fetchElonById = createAsyncThunk(
  "elon/fetchElonById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}/elons/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===================== ADD ELON ===================== */
export const addElon = createAsyncThunk(
  "elon/addElon",
  async ({ formData, token }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API}/elons`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===================== UPDATE ELON ===================== */
export const updateElon = createAsyncThunk(
  "elon/updateElon",
  async ({ id, formData, token }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API}/elons/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ===================== SLICE ===================== */
const elonSlice = createSlice({
  name: "elon",
  initialState: {
    elonlar: [],
    savedElons: [],
    myElons: [],
    loading: false,
    error: null,
    isLoaded: false,
    savedLoaded: false,
    myLoaded: false,
    currentElon: null,
    currentLoading: false,
    currentError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* ===== ELONLAR ===== */
      .addCase(fetchElonlar.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchElonlar.fulfilled, (state, action) => {
        state.elonlar = action.payload;
        state.loading = false;
        state.isLoaded = true;
      })
      .addCase(fetchElonlar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== SAVED ===== */
      .addCase(fetchSavedElons.fulfilled, (state, action) => {
        state.savedElons = action.payload || [];
        state.savedLoaded = true;
      })
      .addCase(saveElon.fulfilled, (state, action) => {
        const exists = state.savedElons.some(
          (e) => e._id === action.payload._id
        );
        if (!exists) {
          state.savedElons.push(action.payload);
        }
      })
      .addCase(unsaveElon.fulfilled, (state, action) => {
        state.savedElons = state.savedElons.filter(
          (e) => e._id !== action.payload
        );
      })

      /* ===== MY ELONS ===== */
      .addCase(fetchMyElons.fulfilled, (state, action) => {
        state.myElons = action.payload || [];
        state.myLoaded = true;
      })

      /* ===== CURRENT ===== */
      .addCase(fetchElonById.pending, (state) => {
        state.currentLoading = true;
      })
      .addCase(fetchElonById.fulfilled, (state, action) => {
        state.currentElon = action.payload;
        state.currentLoading = false;
      })

      /* ===== DELETE ===== */
      .addCase(deleteElon.fulfilled, (state, action) => {
        state.elonlar = state.elonlar.filter(e => e._id !== action.payload);
        state.myElons = state.myElons.filter(e => e._id !== action.payload);
      })

      /* ===== ADD / UPDATE ===== */
      .addCase(addElon.fulfilled, (state, action) => {
        state.myElons.unshift(action.payload);
      })
      .addCase(updateElon.fulfilled, (state, action) => {
        state.myElons = state.myElons.map((e) =>
          e._id === action.payload._id ? action.payload : e
        );
      });
  },
});

export default elonSlice.reducer;
