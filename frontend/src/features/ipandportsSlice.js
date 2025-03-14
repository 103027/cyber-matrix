import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios_token.jsx";

export const fetchIPandPorts = createAsyncThunk(
    "ipandports/fetchIPandPorts",
    async (domain, { rejectWithValue }) => {
        try {
            const response = await api.get(`/get_ip_ports?domain=${domain}`);
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
    ipandports_: {},
    loading: {},
    error: {},
};

const ipandportsSlice = createSlice({
    name: "ipandports",
    initialState,
    reducers: {
        removeIPandPorts: (state, action) => {
            delete state.ipandports_[action.payload];
            delete state.loading[action.payload];
            delete state.error[action.payload];
        },
        clearAllIPandPorts: (state) => {
            state.ipandports_ = {};
            state.loading = {};
            state.error = {};
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchIPandPorts.pending, (state, action) => {
                const domain = action.meta.arg;
                state.loading[domain] = true;
                state.error[domain] = null;
            })
            .addCase(fetchIPandPorts.fulfilled, (state, action) => {
                const { domain, data } = action.payload;
                state.loading[domain] = false;
                state.ipandports_[domain] = { id: nanoid(), ...data };
                state.error[domain] = null;
            })
            .addCase(fetchIPandPorts.rejected, (state, action) => {
                const domain = action.meta.arg;
                state.loading[domain] = false;
                state.error[domain] = action.payload || "Something went wrong";
            })
    },
});

export const { removeIPandPorts, clearAllIPandPorts } = ipandportsSlice.actions;

export default ipandportsSlice.reducer;
