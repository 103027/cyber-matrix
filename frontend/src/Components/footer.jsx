import React from "react";
import { Box, Typography } from '@mui/material';
import { useTheme } from "../contexts/theme/ThemeContext.jsx";

function Footer() {
    const { theme } = useTheme();

    return (
        <Box sx={{ color: theme.secondary_text, paddingY: "50px" }}>
            <Box
                sx={{
                    backgroundColor: theme.drawer_background,
                    width: "100%",
                    borderRadius: "20px",
                    display: "flex",
                    flexDirection: "row",
                }}
            >
                <Box
                    sx={{
                        margin: "20px"
                    }}
                >
                    <Typography
                        variant="h3"
                        gutterBottom
                        sx={{
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            fontFamily: 'Arial, sans-serif',
                        }}
                    >
                        © 2024{' '}
                        <span
                            style={{
                                fontFamily: 'Courier New, monospace',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                            }}
                        >
                            Cyber-Matrix
                        </span>
                        {' '} — All Rights Reserved
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}

export default Footer;