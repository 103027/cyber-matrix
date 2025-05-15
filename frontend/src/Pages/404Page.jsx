import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { useTheme } from "../contexts/theme/ThemeContext.jsx";

function NoPage() {
    const navigate = useNavigate();
    const { theme } = useTheme();

    const goToDashboard = () => {
        navigate("/Dashboard");
    };

    return (
        <Box
            sx={{
                height: "100vh",
                backgroundColor: theme.background,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                color: theme.text,
                px: 2,
                textAlign: "center",
            }}
        >
            <Typography variant="h1" sx={{ fontWeight: "bold", mb: 2 }}>
                404
            </Typography>
            <Typography variant="h5" sx={{ mb: 4 }}>
                Oops! Page Not Found
            </Typography>
            <Typography sx={{ maxWidth: 400, mb: 6 }}>
                The page you are looking for might have been removed or is temporarily unavailable.
            </Typography>
            <Button
                variant="contained"
                onClick={goToDashboard}
                sx={{
                    px: 4, py: 1.5, fontWeight: "bold", backgroundColor: theme.drawer_background
                }}
            >
                Go to Dashboard
            </Button>
        </Box>
    );
}

export default NoPage;
