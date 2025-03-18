import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useTheme } from "../contexts/theme/ThemeContext.jsx";

function Settings() {
    const { theme, toggleTheme } = useTheme();

    return (
        <Box sx={{ color: "#fff", minHeight: "100vh", p: 3 }}>
            <Typography variant="h2">Settings</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
                The Settings content will come here in the future.
            </Typography>

            <div style={{ background: theme.background, color: theme.text, padding: "20px", marginTop: "20px" }}>
                <h1>Themed Application</h1>
                <p>This is a <strong>{theme.text === "#ffffff" ? "Greyscale" : theme.text === "#000000" ? "Light" : "Hacker"}</strong> themed UI.</p>
                
                <Button variant="contained" onClick={() => toggleTheme("light")} sx={{ margin: 1 }}>Light Theme</Button>
                <Button variant="contained" onClick={() => toggleTheme("greyscale")} sx={{ margin: 1 }}>Greyscale Theme</Button>
                <Button variant="contained" onClick={() => toggleTheme("hacker")} sx={{ margin: 1 }}>Hacker Theme</Button>
            </div>
        </Box>
    );
}

export default Settings;
