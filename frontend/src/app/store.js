import { configureStore } from '@reduxjs/toolkit';
import targetInfoReducer from '../features/targetInfoSlice'
import subdomainsReducer from '../features/subdomainSlice'
import ipandportsRuducer from '../features/ipandportsSlice'
import sipcalcReducer from '../features/sipcalcSlice'

const store = configureStore({
    reducer: {
        targetInfo: targetInfoReducer,
        subdomains: subdomainsReducer,
        ipandports: ipandportsRuducer,
        sipcalc: sipcalcReducer,
    }
});

export default store;