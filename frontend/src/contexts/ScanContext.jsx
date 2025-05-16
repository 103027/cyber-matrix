import React, { createContext, useContext, useState, useEffect } from "react";

const ScanContext = createContext();

const RUNNING_KEY = "runningScans";
const COMPLETED_KEY = "completedScans";

export function ScanProvider({ children }) {
    const [runningScans, setRunningScans] = useState(() => {
        return Number(localStorage.getItem(RUNNING_KEY)) || 0;
    });
    const [completedScans, setCompletedScans] = useState(() => {
        return Number(localStorage.getItem(COMPLETED_KEY)) || 0;
    });

    useEffect(() => {
        localStorage.setItem(RUNNING_KEY, runningScans);
    }, [runningScans]);

    useEffect(() => {
        localStorage.setItem(COMPLETED_KEY, completedScans);
    }, [completedScans]);

    const incrementRunningScans = () => setRunningScans(prev => prev + 1);

    const incrementCompletedScans = () => {
        setCompletedScans(prev => prev + 1);
        setRunningScans(prev => (prev > 0 ? prev - 1 : 0));
    };

    const resetScans = () => {
        setRunningScans(0);
        setCompletedScans(0);
        localStorage.removeItem(RUNNING_KEY);
        localStorage.removeItem(COMPLETED_KEY);
    };

    return (
        <ScanContext.Provider
            value={{
                runningScans,
                completedScans,
                incrementRunningScans,
                incrementCompletedScans,
                resetScans,
            }}
        >
            {children}
        </ScanContext.Provider>
    );
}

export function useScan() {
    const context = useContext(ScanContext);
    if (!context) {
        throw new Error("useScan must be used within a ScanProvider");
    }
    return context;
}