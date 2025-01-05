import React, { createContext, useState, useContext } from "react";

const TargetInfoContext = createContext();

export const useTargetInfo = () => useContext(TargetInfoContext);

// Provider Component
export const TargetInfoProvider = ({ children }) => {
    const [targetInfos, setTargetInfos] = useState({}); // Centralized state
    const removeTargetInfo = (domain) => {
        setTargetInfos((prev) => {
            const updatedInfos = { ...prev };
            delete updatedInfos[domain];
            return updatedInfos;
        });
    };

    return (
        <TargetInfoContext.Provider value={{ targetInfos, setTargetInfos, removeTargetInfo }}>
            {children}
        </TargetInfoContext.Provider>
    );
};
