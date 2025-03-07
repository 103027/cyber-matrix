import React from "react";
import { Box, Typography, Button, Grid, TextField , Divider } from "@mui/material";

function ContactUs() {
    return (
        <Box sx={{ color: "#fff", marginTop: "80px", marginBottom: "125px", overflowX: "hidden" }}>
            <Box height={"10vh"}></Box>
            <Box
                sx={{
                    backgroundColor: "#b5b5b5",
                    borderRadius: "20px",
                    display: "flex",
                    flexDirection: { xs: "column", md: "column", lg: "row" }, // Image only appears on lg screens
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginX: { xs: "20px", sm: "50px", md: "80px", lg: "100px" },
                    paddingY: "50px",
                    maxWidth: "100%",
                    pl: { sm: "none", md: "none", lg: "60px" }
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        color: "black",
                        flex: 1,
                        maxWidth: "600px",
                    }}
                >
                    <Typography
                        variant="h1"
                        gutterBottom
                        sx={{
                            fontWeight: "bold",
                            fontSize: "2.5rem",
                            fontFamily: "Poppins, sans-serif",
                            ml: "20px"
                        }}
                    >
                        Contact Us
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        gutterBottom
                        sx={{
                            fontSize: "1rem",
                            fontWeight: 500,
                            marginTop: "0.5rem",
                            maxWidth: "600px",
                            ml: "20px"
                        }}
                    >
                        Help us help you, use this form to connect with us!
                    </Typography>
                    <Divider sx={{mx:3 , mt:2}}/>
                    <Box
                        sx={{
                            padding: "20px",
                            borderRadius: "8px",
                            maxWidth: "100%",
                            marginTop: "20px",
                        }}
                    >
                        <Grid container spacing={2}>
                            {[
                                { label: "Name" },
                                { label: "Email" },
                                { label: "Subject", fullWidth: true },
                                { label: "Message", fullWidth: true, multiline: true, rows: 4 },
                            ].map((field, index) => (
                                <Grid item xs={12} sm={field.fullWidth ? 12 : 6} key={index}>
                                    <Typography variant="body1" sx={{ marginBottom: 1 }}>
                                        {field.label}
                                    </Typography>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        multiline={field.multiline || false}
                                        rows={field.rows || 1}
                                        InputProps={{
                                            sx: {
                                                backgroundColor: "#49494C",
                                                color: "#fff",
                                                borderRadius: "10px",
                                                "&.Mui-focused": {
                                                    backgroundColor: "#26272B",
                                                },
                                            },
                                        }}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                "& fieldset": { borderColor: "#26272B" },
                                                "&:hover fieldset": { borderColor: "#26272B" },
                                                "&.Mui-focused fieldset": { borderColor: "#26272B" },
                                            },
                                        }}
                                    />
                                </Grid>
                            ))}
                        </Grid>

                        <Button
                            variant="contained"
                            sx={{
                                width: 200,
                                mt: 10,
                                bgcolor: "black",
                                py: 1,
                                fontSize: "1rem",
                                borderRadius: "10px",
                                border: "1px solid #49494C",
                                "&:hover": {
                                    bgcolor: "#2E2E30",
                                    border: "1px solid #49494C",
                                },
                            }}
                        >
                            Submit
                        </Button>
                    </Box>
                </Box>

                <Box
                    sx={{
                        pt: 2,
                        flex: 1,
                        display: { xs: "none", sm: "none", md: "none", lg: "flex" }, // Hides image on sm, md, xs
                        justifyContent: "center",
                        maxWidth: "100%",
                    }}
                >
                    <img
                        src={require("../Images/try3.png")}
                        alt="Cyber-Matrix Logo"
                        style={{ width: "100%", maxWidth: "380px" }}
                    />
                </Box>
            </Box>
        </Box>
    );
}

export default ContactUs;
