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
      return res.data; // <-- shu yerda savedElons emas, to‘g‘ridan array
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchMyElons = createAsyncThunk(
  "elon/fetchMyElons",
  async (token, { rejectWithValue }) => {
    if (!token) return [];
    try {
      const res = await axios.get("http://localhost:5000/api/elons/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data; // backend to‘g‘ridan-to‘g‘ri array qaytaradi
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

// Async thunk: bitta elon detallarini olish
export const fetchElonById = createAsyncThunk(
  "elon/fetchElonById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/elons/${id}`);
      return res.data; // backend to‘g‘ridan object qaytaradi
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Async thunk: yangi elon qo‘shish
export const addElon = createAsyncThunk(
  "elon/addElon",
  async ({ formData, token }, { rejectWithValue }) => {
    try {
      const res = await axios.post("http://localhost:5000/api/elons", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      return res.data; // yangi elon object
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Async thunk: elonni yangilash
export const updateElon = createAsyncThunk(
  "elon/updateElon",
  async ({ id, formData, token }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/elons/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      return res.data; // updated elon object
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
    myElons: [], // <-- bu bo‘sh array bo‘lishi kerak
    loading: false,
    error: null,
    isLoaded: false, // <-- Caching uchun flag
    savedLoaded: false, // Saved page caching
    myLoaded: false, // My elons caching (keyinchalik qo‘shiladi)
    currentElon: null,
    currentLoading: false,
    currentError: null,
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
        state.isLoaded = true; // <-- CACHE to'ldi
      })
      .addCase(fetchElonlar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // fetchMyElons
    builder
      .addCase(fetchMyElons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyElons.fulfilled, (state, action) => {
        state.loading = false;
        state.myElons = action.payload || [];
        state.myLoaded = true; // flag to‘ldirildi
      })
      .addCase(fetchMyElons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(fetchElonById.pending, (state) => {
        state.currentLoading = true;
        state.currentError = null;
      })
      .addCase(fetchElonById.fulfilled, (state, action) => {
        state.currentElon = action.payload;
        state.currentLoading = false;
      })
      .addCase(fetchElonById.rejected, (state, action) => {
        state.currentError = action.payload;
        state.currentLoading = false;
      });

    // fetchSavedElons
    builder.addCase(fetchSavedElons.fulfilled, (state, action) => {
      state.loading = false;
      state.savedElons = action.payload || []; // <-- MUHIM
      state.savedLoaded = true;
    });

    // saveElon
    builder.addCase(saveElon.fulfilled, (state, action) => {
      state.savedElons = action.payload;
    });

    // deleteElon
    builder.addCase(deleteElon.fulfilled, (state, action) => {
      state.elonlar = state.elonlar.filter((item) => item._id !== action.payload);
      state.myElons = state.myElons.filter((item) => item._id !== action.payload);
    });
    builder.addCase(addElon.fulfilled, (state, action) => {
      state.myElons.unshift(action.payload);
    });

    builder.addCase(updateElon.fulfilled, (state, action) => {
      state.myElons = state.myElons.map((elon) =>
        elon._id === action.payload._id ? action.payload : elon
      );
    });
  },
});

export default elonSlice.reducer;
