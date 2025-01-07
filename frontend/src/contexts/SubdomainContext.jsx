import React, { createContext, useState, useContext } from "react";

// Create Context
const SubdomainContext = createContext();

// Custom Hook for Accessing Context
export const useSubdomain = () => useContext(SubdomainContext);

// Provider Component
export const SubdomainProvider = ({ children }) => {
    const [subdomains, setSubdomains] = useState({}); // Centralized state for subdomains

    // Add or Update Subdomains for a Domain
    const addSubdomains = (domain, data) => {
        setSubdomains((prev) => ({
            ...prev,
            [domain]: data,
        }));
    };

    // Remove Subdomains for a Domain
    const removeSubdomains = (domain) => {
        setSubdomains((prev) => {
            const updatedSubdomains = { ...prev };
            delete updatedSubdomains[domain];
            return updatedSubdomains;
        });
    };

    const clearAllSubdomains = () => {
        setSubdomains({});
    };

    return (
        <SubdomainContext.Provider value={{ subdomains,setSubdomains, addSubdomains, removeSubdomains,clearAllSubdomains }}>
            {children}
        </SubdomainContext.Provider>
    );
};
