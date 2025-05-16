import { createContext, useContext, useState, useEffect } from "react";
import { themes } from "./themestyles";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const storedTheme = localStorage.getItem("theme") || "dark"; 
    const [currentTheme, setCurrentTheme] = useState(storedTheme);

    useEffect(() => {
        localStorage.setItem("theme", currentTheme);
    }, [currentTheme]);

    const toggleTheme = (newTheme) => {
        if (themes[newTheme]) {
            setCurrentTheme(newTheme);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme: themes[currentTheme], toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);