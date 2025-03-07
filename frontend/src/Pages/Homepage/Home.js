import React from "react";
import { Box, Typography } from "@mui/material";

function Home() {
    return (
        <Box sx={{ color: "#fff" }}>
            <Box
                sx={{
                    backgroundColor: "#b5b5b5",
                    width: "100%",
                    borderRadius: "20px",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent:"space-between"
                }}
            >
                <Box
                    sx={{
                        margin: "50px",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Typography
                        variant="h3"
                        gutterBottom
                        sx={{
                            fontWeight: 'bold',
                            fontSize: '2.5rem',
                            fontFamily: 'Arial, sans-serif',
                            color: "#000000",
                        }}
                    >
                        Welcome to{' '}
                        <span
                            style={{
                                fontFamily: 'Courier New, monospace',
                                fontSize: '3rem',
                                fontWeight: 'bold',
                                color: "#000000",
                            }}
                        >
                            Cyber-Matrix
                        </span>
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        gutterBottom
                        sx={{
                            fontSize: '1.0rem', // Slightly larger font for better readability
                            fontWeight: 500, // Semi-bold for emphasis
                            // color: "#EFEFEF",
                            color: "#000000",
                            marginTop: '1rem', // Add spacing above
                            maxWidth: '800px', // Restrict width for better focus
                        }}
                    >
                        Your go-to platform for powerful cybersecurity tools, including penetration testing, password cracking, asset enumeration, CVE reporting, subdomain discovery, and network scanning. Let’s simplify and enhance your security journey together!
                    </Typography>
                </Box>
                <Box
                    sx={{
                        pt:2,
                        mr:5
                    }}
                >
                    <img
                        src={require("../../Images/try3.png")}
                        alt="Cyber-Matrix Logo"
                        style={{ width: "250px", marginBottom: "10px" }}
                    />
                </Box>
            </Box>
        </Box>
    );
}

export default Home;
