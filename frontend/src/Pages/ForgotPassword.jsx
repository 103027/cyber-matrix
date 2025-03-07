import React, { useState } from "react";
import { Box, TextField, Button, Typography, Link, Grid, IconButton, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../contexts/NotificationContext.jsx";
import api from "../api/axois.jsx";

function ForgotPasword() {
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isValidEmail, setIsValidEmail] = useState(false);

    const [formValues, setFormValues] = useState({
        email: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
        setIsSubmitted(false)
    };

    const resetPassword = async (userInput) => {
        try {
            const response = await api.post(`/forgot-password`, userInput);
            console.log("Response:", response.data);
            showNotification(response?.data?.message);
            navigate("/login");
        } catch (error) {
            console.error("Error:", error.response ? error.response.data : error.message);
            const errorMsg = error.response?.data?.message || "Something went wrong";
            showNotification(errorMsg);
        }
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
        setIsValidEmail(true);
        const { email } = formValues;

        if (!email) {
            console.log("All fields are required");
            showNotification("Form is not valid")
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log("Invalid email format");
            setIsValidEmail(false)
            showNotification("Form is not valid")
            return;
        }

        console.log("Email:", email);

        const userInput = {
            email: email.trim()
        };

        resetPassword(JSON.stringify(userInput));
    };

    return (
        <Grid
            container
            sx={{
                backgroundColor: "#333",
                height: "100vh",
            }}
        >
            <Grid
                item
                xs={12}
                md={6}
                sx={{
                    backgroundColor: "#333",
                    width: { xs: "100%", md: "auto" },
                    animation: "fadeSlideIn 0.5s ease-in-out",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: { sm: "none", md: "center" },
                        height: "100%",
                        px: { xs: 2, sm: 8, md: 10 },
                        color: "#fff",
                    }}
                >
                    <Box onClick={() => navigate("/")} sx={{ display: { xs: "flex", md: "none" }, flexDirection: "column", alignItems: "center", cursor: "pointer" }}>
                        <img
                            src={require("../Images/logo3.png")}
                            alt="Cyber-Matrix Logo"
                            style={{ width: "120px", marginBottom: "50px" }}
                        />
                    </Box>
                    <Box sx={{ marginBottom: 6 }}>
                        <Typography gutterBottom sx={{ fontSize: { xs: "1.5rem", md: "2.0rem" }, fontWeight: "bold" }}>
                            Recover your Account
                        </Typography>
                        <Typography gutterBottom sx={{ color: "#D9D9D9", fontSize: "1rem" }}>
                            Remember your password?{" "}
                            <Link onClick={() => navigate("/login")} underline="hover" style={{ color: "#D9D9D9", fontWeight: "bold", cursor: "pointer" }}>
                                Sign in
                            </Link>{" "}
                            to your Account
                        </Typography>
                    </Box>

                    <Box sx={{ marginBottom: 3 }}>
                        <Typography variant="body1" color="white" sx={{ marginBottom: 1 }}>
                            Email Address
                        </Typography>
                        <Tooltip
                            title={
                                isSubmitted && !formValues["email"]
                                    ? "Fill out this field"
                                    : isSubmitted && !isValidEmail
                                        ? "Enter a valid email"
                                        : ""
                            }
                            arrow
                            placement="top"
                            open={isSubmitted && (!formValues["email"] || !isValidEmail)}
                        >
                            <TextField
                                name = "email"
                                placeholder="Enter your email address"
                                variant="outlined"
                                fullWidth
                                size="small"
                                onChange={handleInputChange}
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
                        </Tooltip>
                    </Box>

                    <Button
                        variant="contained"
                        onClick={handleSubmit}
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
                        Submit ➔
                    </Button>
                </Box>
                {/* Injecting CSS Animations */}
                <style>
                    {`
                        @keyframes fadeSlideIn {
                            0% {
                                opacity: 0;
                                transform: rotateX(70deg);
                            }
                            100% {
                                opacity: 1;
                                transform: rotateX(0deg);
                            }
                        }
                    `}
                </style>
            </Grid>

            <Grid
                item
                xs={12}
                md={6}
                sx={{
                    backgroundColor: "#000",
                    display: { xs: "none", md: "flex" },
                    justifyContent: "center",
                    alignItems: "center",
                    borderTopLeftRadius: { md: "30px" },
                    borderBottomLeftRadius: { md: "30px" },
                }}
            >
                <Box onClick={() => navigate("/")} sx={{ display: "flex", flexDirection: "column", alignItems: "center",cursor:"pointer" }}>
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

export default ForgotPasword;