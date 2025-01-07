import React, { createContext, useState, useContext } from "react";

// Create Context
const IPandPortsContext = createContext();

// Custom Hook for Accessing Context
export const useIPandPorts = () => useContext(IPandPortsContext);

// Provider Component
export const IPandPortsProvider = ({ children }) => {
    const [IPandPorts, setIPandPorts] = useState({}); // Centralized state for IPandPorts

    // Add or Update IPandPorts for a Domain
    const addIPandPorts = (domain, data) => {
        setIPandPorts((prev) => ({
            ...prev,
            [domain]: data,
        }));
    };

    // Remove IPandPorts for a Domain
    const removeIPandPorts = (domain) => {
        setIPandPorts((prev) => {
            const updatedIPandPorts = { ...prev };
            delete updatedIPandPorts[domain];
            return updatedIPandPorts;
        });
    };

    return (
        <IPandPortsContext.Provider value={{ IPandPorts, addIPandPorts, removeIPandPorts }}>
            {children}
        </IPandPortsContext.Provider>
    );
};
