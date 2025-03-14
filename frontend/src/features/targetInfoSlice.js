import { createSlice, nanoid, createAsyncThunk } from '@reduxjs/toolkit';
import api from "../api/axios_token.jsx";

export const fetchTargetInfo = createAsyncThunk(
    "targetInfo/fetchTargetInfo",
    async (domain, { rejectWithValue }) => {
        try {
            const response = await api.get(`/get_target_info?domain=${domain}`);
            return { domain: domain.toLowerCase(), data: response.data };
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

const targetInfoSlice = createSlice({
    name: "targetInfo",
    initialState,
    reducers: {
        removeTargetInfo: (state, action) => {
            delete state.data[action.payload];
            delete state.loading[action.payload];
            delete state.error[action.payload];
        },
        clearAllTargetInfo: (state) => {
            state.data = {};
            state.loading = {};
            state.error = {};
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTargetInfo.pending, (state, action) => {
                const domain = action.meta.arg;
                state.loading[domain] = true;
                state.error[domain] = null;
            })
            .addCase(fetchTargetInfo.fulfilled, (state, action) => {
                const { domain, data } = action.payload;
                state.loading[domain] = false;
                state.data[domain] = { id: nanoid(), ...data };
                state.error[domain] = null;
            })
            .addCase(fetchTargetInfo.rejected, (state, action) => {
                const domain = action.meta.arg;
                state.loading[domain] = false;
                state.error[domain] = action.error.message;
            });
    },
});

export const { removeTargetInfo, clearAllTargetInfo } = targetInfoSlice.actions;

export default targetInfoSlice.reducer;