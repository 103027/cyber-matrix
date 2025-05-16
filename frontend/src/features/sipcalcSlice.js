import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios_token.jsx";

export const fetchSipCalc = createAsyncThunk(
    "sipcalc/fetchSipCalc",
    async (domain, { rejectWithValue }) => {
        try {
            const response = await api.get(`/get_sipcalc?domain=${domain}`);
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

const sipcalcSlice = createSlice({
    name: "sipcalc",
    initialState,
    reducers: {
        removeSipCalc: (state, action) => {
            delete state.data[action.payload];
            delete state.loading[action.payload];
            delete state.error[action.payload];
        },
        clearAllSipCalc: (state) => {
            state.data = {};
            state.loading = {};
            state.error = {};
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSipCalc.pending, (state, action) => {
                const domain = action.meta.arg;
                state.loading[domain] = true;
                state.error[domain] = null;
            })
            .addCase(fetchSipCalc.fulfilled, (state, action) => {
                const { domain, data } = action.payload;
                state.loading[domain] = false;
                state.data[domain] = { id: nanoid(), ...data };
                state.error[domain] = null;
            })
            .addCase(fetchSipCalc.rejected, (state, action) => {
                const domain = action.meta.arg;
                state.loading[domain] = false;
                state.error[domain] = action.payload || "Something went wrong";
            })
    },
});

export const { removeSipCalc, clearAllSipCalc } = sipcalcSlice.actions;

export default sipcalcSlice.reducer;
