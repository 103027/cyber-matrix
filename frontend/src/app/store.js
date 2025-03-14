import { configureStore } from '@reduxjs/toolkit';
import targetInfoReducer from '../features/targetInfoSlice'
import subdomainsReducer from '../features/subdomainSlice'
import ipandportsRuducer from '../features/ipandportsSlice'

const store = configureStore({
    reducer: {
        targetInfo: targetInfoReducer,
        subdomains: subdomainsReducer,
        ipandports: ipandportsRuducer,
    }
});

export default store;