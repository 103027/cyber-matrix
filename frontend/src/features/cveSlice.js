import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios_token.jsx";

export const fetchCVE = createAsyncThunk(
    "cve/fetchCVE",
    async (domain, { rejectWithValue }) => {
        try {
            const response = await api.get(`/cve?domain=${domain}`);
            return {
                domain: domain.toLowerCase(),
                data: response.data
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

const initialState = {
    data: {},
    loading: {},
    error: {},
};

const cveSlice = createSlice({
    name: "cve",
    initialState,
    reducers: {
        removeCVE: (state, action) => {
            delete state.data[action.payload];
            delete state.loading[action.payload];
            delete state.error[action.payload];
        },
        clearAllCVE: (state) => {
            state.data = {};
            state.loading = {};
            state.error = {};
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCVE.pending, (state, action) => {
                const domain = action.meta.arg;
                state.loading[domain] = true;
                state.error[domain] = null;
            })
            .addCase(fetchCVE.fulfilled, (state, action) => {
                const { domain, data } = action.payload;
                state.loading[domain] = false;
                const cveList = Object.values(data.cve_results).flat();
                state.data[domain] = { id: nanoid(), cveList };
                state.error[domain] = null;
            })
            .addCase(fetchCVE.rejected, (state, action) => {
                const domain = action.meta.arg;
                state.loading[domain] = false;
                state.error[domain] = action.payload || "Something went wrong";
            })
    },
});

export const { removeCVE, clearAllCVE } = cveSlice.actions;

export default cveSlice.reducer;
