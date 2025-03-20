import React from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "../contexts/theme/ThemeContext.jsx";

function History() {
    const { theme } = useTheme();

    return (
        <Box sx={{ color: theme.text }}>
            <Box sx={{
                display: "flex", flexDirection: "column", justifyContent: "center", gap: 3, p: 2, pb: 3, borderRadius: "20px", backgroundColor: theme.bg_behind_boxes
            }}>
                <Box>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '2.5rem', fontFamily: 'Poppins, sans-serif' }}>
                        History
                    </Typography>
                </Box>
                <Typography sx={{ fontSize: '1rem', fontFamily: 'Poppins, sans-serif' }}>
                    The History will come here in the future.
                </Typography>
            </Box>
        </Box>
    );
}

export default History;
