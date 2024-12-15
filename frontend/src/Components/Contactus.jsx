import React from "react";
import { Box, Typography, Button, Grid, TextField } from '@mui/material';

function ContactUs() {
    return (
        <Box sx={{ color: "#fff", marginTop: "100px" }}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Box>
                    <Typography
                        variant="h1"
                        gutterBottom
                        sx={{
                            fontWeight: 'bold',
                            fontSize: '3.0rem',
                            fontFamily: 'Poppins, sans-serif',
                            textAlign: "center"
                        }}
                    >
                        Contact Us
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        gutterBottom
                        sx={{
                            fontSize: '1.0rem',
                            fontWeight: 500,
                            color: "#EFEFEF",
                            marginTop: '1rem',
                            maxWidth: '600px',
                            margin: "0 auto",
                            textAlign: 'center',
                        }}
                    >
                        Help us help you, use this form to connect with us!
                    </Typography>
                </Box>
                <Box
                    sx={{
                        padding: "20px",
                        borderRadius: "8px",
                        maxWidth: "600px",
                        margin: "auto",
                    }}
                >
                    <Grid container spacing={2}>
                        {/* Name and Email Fields */}
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1" color="#EFEFEF" sx={{ marginBottom: 1 }}>
                                Name
                            </Typography>
                            <TextField
                                variant="outlined"
                                fullWidth
                                size="small"
                                InputProps={{
                                    sx: {
                                        backgroundColor: "#26272B",
                                        color: "#fff",
                                        borderRadius: "10px",
                                        "&.Mui-focused": {
                                            backgroundColor: "black",
                                        },
                                    },
                                }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                            borderColor: "#49494C",
                                        },
                                        "&:hover fieldset": {
                                            borderColor: "#49494C",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#49494C",
                                        },
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1" color="#EFEFEF" sx={{ marginBottom: 1 }}>
                                Email
                            </Typography>
                            <TextField
                                variant="outlined"
                                fullWidth
                                size="small"
                                InputProps={{
                                    sx: {
                                        backgroundColor: "#26272B",
                                        color: "#fff",
                                        borderRadius: "10px",
                                        "&.Mui-focused": {
                                            backgroundColor: "black",
                                        },
                                    },
                                }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                            borderColor: "#49494C",
                                        },
                                        "&:hover fieldset": {
                                            borderColor: "#49494C",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#49494C",
                                        },
                                    },
                                }}
                            />
                        </Grid>

                        {/* Subject Field */}
                        <Grid item xs={12}>
                            <Typography variant="body1" color="#EFEFEF" sx={{ marginBottom: 1 }}>
                                Subject
                            </Typography>
                            <TextField
                                variant="outlined"
                                fullWidth
                                size="small"
                                InputProps={{
                                    sx: {
                                        backgroundColor: "#26272B",
                                        color: "#fff",
                                        borderRadius: "10px",
                                        "&.Mui-focused": {
                                            backgroundColor: "black",
                                        },
                                    },
                                }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                            borderColor: "#49494C",
                                        },
                                        "&:hover fieldset": {
                                            borderColor: "#49494C",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#49494C",
                                        },
                                    },
                                }}
                            />
                        </Grid>

                        {/* Message Field */}
                        <Grid item xs={12}>
                            <Typography variant="body1" color="#EFEFEF" sx={{ marginBottom: 1 }}>
                                Message
                            </Typography>
                            <TextField
                                variant="outlined"
                                fullWidth
                                size="small"
                                multiline
                                rows={4}
                                InputProps={{
                                    sx: {
                                        backgroundColor: "#26272B",
                                        color: "#fff",
                                        borderRadius: "10px",
                                        "&.Mui-focused": {
                                            backgroundColor: "black",
                                        },
                                    },
                                }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                            borderColor: "#49494C",
                                        },
                                        "&:hover fieldset": {
                                            borderColor: "#49494C",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#49494C",
                                        },
                                    },
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                        }}
                    >
                        <Button
                            variant="contained"
                            sx={{
                                width: 200,
                                mt: 4,
                                mb: 2,
                                bgcolor: "#49494C",
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
            </Box>
        </Box>
    );
}

export default ContactUs;
