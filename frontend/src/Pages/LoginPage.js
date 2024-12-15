import React from "react";
import { Box, TextField, Button, Typography, Link, Grid } from "@mui/material";

function Login() {
    return (
        <Grid
            container
            sx={{
                backgroundColor: "#333",
                height: "100vh",
            }}
        >
            {/* Only show on small screens */}
            <Grid
                item
                xs={12}
                md={6}
                sx={{
                    backgroundColor: "#000",
                    display: { xs: "flex", md: "none" },
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", height: "auto" }}>
                    <img
                        src={require("../Images/logo.png")}
                        alt="Cyber-Matrix Logo"
                        style={{ width: "150px", marginBottom: "10px" }}
                    />
                    <img
                        src={require("../Images/name.png")}
                        alt="Cyber-Matrix name"
                        style={{ width: "300px", marginBottom: "10px" }}
                    />
                </Box>
            </Grid>

            {/* Left side - Form section */}
            <Grid
                item
                xs={12}
                md={6}
                sx={{
                    backgroundColor: "#333",
                    padding: "50px",
                    width: { xs: "100%", md: "auto" },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        height: "100%",
                        px: 6,
                        color: "#fff",
                    }}
                >
                    <Box sx={{ marginBottom: 6 }}>
                        <Typography variant="h4" gutterBottom>
                            Sign in to your Account
                        </Typography>
                        <Typography variant="body2" gutterBottom style={{ color: "#D9D9D9" }}>
                            Don't have an account?{" "}
                            <Link href="#" underline="hover" style={{ color: "#D9D9D9", fontWeight: "bold" }}>
                                Create a new account
                            </Link>{" "}
                        </Typography>
                    </Box>

                    <Box sx={{ marginBottom: 3 }}>
                        <Typography variant="body1" color="white" sx={{ marginBottom: 1 }}>
                            Email Address
                        </Typography>
                        <TextField
                            placeholder="Enter your email address"
                            variant="outlined"
                            fullWidth
                            size="small"
                            InputProps={{
                                sx: {
                                    backgroundColor: "#333333",
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
                                        borderColor: "white",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "white",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#49494C",
                                    },
                                },
                            }}
                        />
                    </Box>

                    <Box sx={{ marginBottom: 3 }}>
                        <Typography variant="body1" color="white" sx={{ marginBottom: 1 }}>
                            Password
                        </Typography>
                        <TextField
                            placeholder="Enter your password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            size="small"
                            InputProps={{
                                sx: {
                                    backgroundColor: "#333333",
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
                                        borderColor: "white",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "white",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#49494C",
                                    },
                                },
                            }}
                        />
                    </Box>

                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                            mt: 2,
                            mb: 2,
                            bgcolor: "#49494C",
                            py: 1,
                            fontSize: "1rem",
                            borderRadius: "30px",
                            border: "1px solid white",
                            "&:hover": {
                                bgcolor: "#2E2E30",
                                border: "1px solid white",
                            },
                        }}
                    >
                        Sign in ➔
                    </Button>

                    <Typography variant="body2" align="end" mt={2} style={{ color: "#D9D9D9" }}>
                        <Link href="#" underline="hover" style={{ color: "#D9D9D9", fontWeight: "bold" }}>
                            Forgot Password?
                        </Link>{" "}
                    </Typography>
                </Box>
            </Grid>

            {/* Right side - Logo section */}
            <Grid
                item
                xs={12}
                md={6}
                sx={{
                    backgroundColor: "#000",
                    display: { xs: "none", md: "flex" }, // Hide on xs, show on md and above
                    justifyContent: "center",
                    alignItems: "center",
                    borderTopLeftRadius: { md: "30px" },
                    borderBottomLeftRadius: { md: "30px" },
                }}
            >
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <img
                        src={require("../Images/logo.png")}
                        alt="Cyber-Matrix Logo"
                        style={{ width: "150px", marginBottom: "10px" }}
                    />
                    <img
                        src={require("../Images/name.png")}
                        alt="Cyber-Matrix name"
                        style={{ width: "300px", marginBottom: "10px" }}
                    />
                </Box>
            </Grid>
        </Grid>
    );
}

export default Login;
