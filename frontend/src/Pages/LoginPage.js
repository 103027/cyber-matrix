import React, { useState } from "react";
import { Box, TextField, Button, Typography, Link, Grid, IconButton, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNotification } from "../contexts/NotificationContext.jsx";
import api from "../api/axois.jsx";

function Login() {
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isValidEmail, setIsValidEmail] = useState(false);

    const [formValues, setFormValues] = useState({
        email: "",
        password: "",
    });

    const handleClick = (event) => {
        event.preventDefault();
        navigate("/signup");
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
        setIsSubmitted(false)
    };

    const userLogin = async (userInput) => {
        try {
            const response = await api.post(`/login`, userInput);
            console.log("Response:", response.data);
            showNotification(response?.data?.message);
            navigate("/home");
        } catch (error) {
            console.error("Error:", error.response ? error.response.data : error.message);
            const errorMsg = error.response?.data?.message || "Something went wrong";
            showNotification(errorMsg);
        }
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
        setIsValidEmail(true);
        const { email, password } = formValues;

        // Validation
        if (!email || !password) {
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
        console.log("Password:", password);

        const userInput = {
            email: email.trim(),
            password: password.trim(),
        };

        // Add API call or further actions here
        userLogin(JSON.stringify(userInput));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

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
                <Box onClick={() => navigate("/")} sx={{ display: "flex", flexDirection: "column", alignItems: "center", height: "auto",cursor:"pointer" }}>
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
                            <Link onClick={handleClick} underline="hover" style={{ color: "#D9D9D9", fontWeight: "bold", cursor: "pointer" }}>
                                Create a new account
                            </Link>{" "}
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
                            placement="right"
                            open={isSubmitted && (!formValues["email"] || !isValidEmail)}
                        >
                            <TextField
                                name="email"
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

                    <Box sx={{ marginBottom: 3 }}>
                        <Typography variant="body1" color="white" sx={{ marginBottom: 1 }}>
                            Password
                        </Typography>
                        <Tooltip
                            title={
                                isSubmitted && !formValues["password"]
                                    ? `Fill out this field`
                                    : ""
                            }
                            arrow
                            placement="right"
                            open={isSubmitted && !formValues["password"]}
                        >
                            <TextField
                                name="password"
                                placeholder="Enter your password"
                                type={showPassword ? "text" : "password"} // Toggle between text and password
                                variant="outlined"
                                fullWidth
                                size="small"
                                onChange={handleInputChange}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton onClick={togglePasswordVisibility} edge="end">
                                            {showPassword ? <VisibilityOff sx={{ color: "white" }} /> : <Visibility sx={{ color: "white" }} />}
                                        </IconButton>
                                    ),
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
                        Sign in ➔
                    </Button>

                    <Typography variant="body2" align="end" mt={2} style={{ color: "#D9D9D9" }}>
                        <Link onClick={() => navigate("/forgotpassword")} underline="hover" style={{ color: "#D9D9D9", fontWeight: "bold", cursor: "pointer" }}>
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

export default Login;