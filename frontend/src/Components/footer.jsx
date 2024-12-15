import React from "react";
import { Box, Typography } from '@mui/material';

function Footer() {
    return (
        <Box sx={{ color: "#fff", marginTop: "50px" }}>
            <Box
                sx={{
                    backgroundColor: "#49494C",
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