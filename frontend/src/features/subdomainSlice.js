import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios_token.jsx";

function createData(url, status) {
    return { url, status };
}

export const fetchSubdomains = createAsyncThunk(
    "subdomains/fetchSubdomains",
    async (domain, { rejectWithValue }) => {
        try {
            const response = await api.get(`/new_subdomain?domain=${domain}`);
            return {
                domain: domain.toLowerCase(),
                data: response.data?.["subdomains"]?.map((subdomain) => createData(subdomain, "--")),
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

export const fetchSubdomainStatus = createAsyncThunk(
    "subdomains/fetchSubdomainStatus",
    async ({ domain, url }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/get_status?domain=${url}`);
            return { domain, url, status: response?.data?.status };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Error fetching status");
        }
    }
);

const initialState = {
    data: {},
    loading: {},
    error: {},
    loadingRow: {},
};

const subdomainsSlice = createSlice({
    name: "subdomains",
    initialState,
    reducers: {
        removeSubdomains: (state, action) => {
            delete state.data[action.payload];
            delete state.loading[action.payload];
            delete state.error[action.payload];
            delete state.loadingRow[action.payload];
        },
        clearAllSubdomains: (state) => {
            state.data = {};
            state.loading = {};
            state.error = {};
            state.loadingRow = {};
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubdomains.pending, (state, action) => {
                const domain = action.meta.arg;
                state.loading[domain] = true;
                state.error[domain] = null;
            })
            .addCase(fetchSubdomains.fulfilled, (state, action) => {
                const { domain, data } = action.payload;
                state.loading[domain] = false;
                state.data[domain] = { id: nanoid(), data };
                state.error[domain] = null;
            })
            .addCase(fetchSubdomains.rejected, (state, action) => {
                const domain = action.meta.arg;
                state.loading[domain] = false;
                state.error[domain] = action.payload || "Something went wrong";
            })

            .addCase(fetchSubdomainStatus.pending, (state, action) => {
                const { domain, url } = action.meta.arg;
                state.loadingRow[domain] = url;
            })
            .addCase(fetchSubdomainStatus.fulfilled, (state, action) => {
                const { domain, url, status } = action.payload;
                state.loadingRow[domain] = null;

                if (state.data[domain]) {
                    state.data[domain].data = state.data[domain].data.map((subdomain) =>
                        subdomain.url === url ? { ...subdomain, status } : subdomain
                    );
                }
            })
            .addCase(fetchSubdomainStatus.rejected, (state, action) => {
                const { domain, url } = action.meta.arg;
                state.loadingRow[domain] = null;
                state.error[domain] = action.payload || "Error fetching status";
            });
    },
});

export const { removeSubdomains, clearAllSubdomains } = subdomainsSlice.actions;

export default subdomainsSlice.reducer;
