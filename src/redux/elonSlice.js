import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


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
      return res.data; 
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
      return res.data;
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
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchElonById = createAsyncThunk(
  "elon/fetchElonById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/elons/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const addElon = createAsyncThunk(
  "elon/addElon",
  async ({ formData, token }, { rejectWithValue }) => {
    try {
      const res = await axios.post("http://localhost:5000/api/elons", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      return res.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateElon = createAsyncThunk(
  "elon/updateElon",
  async ({ id, formData, token }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/elons/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      return res.data; 
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
      .addCase(fetchElonlar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchElonlar.fulfilled, (state, action) => {
        state.loading = false;
        state.elonlar = action.payload;
        state.isLoaded = true;
      })
      .addCase(fetchElonlar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(fetchMyElons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyElons.fulfilled, (state, action) => {
        state.loading = false;
        state.myElons = action.payload || [];
        state.myLoaded = true;
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

    builder.addCase(fetchSavedElons.fulfilled, (state, action) => {
      state.loading = false;
      state.savedElons = action.payload || [];
      state.savedLoaded = true;
    });

    builder.addCase(saveElon.fulfilled, (state, action) => {
      state.savedElons = action.payload;
    });

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
