import React, { useState } from "react";
import { Box, TextField, Button, Typography, Link, Grid, IconButton, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNotification } from "../contexts/NotificationContext.jsx";
import api from "../api/axois.jsx";
import { useTheme } from "../contexts/theme/ThemeContext.jsx";

function Login() {
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isValidEmail, setIsValidEmail] = useState(false);
    const { theme } = useTheme();

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
            const token = response?.data?.access_token;
            localStorage.setItem("token", token);
            localStorage.setItem("username", response?.data?.username);
            navigate("/Dashboard");
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

        userLogin(JSON.stringify(userInput));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Grid
            container
            sx={{
                backgroundColor: theme.background,
                height: "100vh",
            }}
        >
            <Grid
                item
                xs={12}
                md={6}
                sx={{
                    backgroundColor: theme.background,
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
                        color: theme.text,
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
                            Sign in to your Account
                        </Typography>
                        <Typography gutterBottom sx={{ color: theme.text_2, fontSize: "1rem" }}>
                            Don't have an account?{" "}
                            <Link onClick={handleClick} underline="hover" style={{ color: theme.text_2, fontWeight: "bold", cursor: "pointer" }}>
                                Create a new account
                            </Link>{" "}
                        </Typography>
                    </Box>

                    <Box sx={{ marginBottom: 3 }}>
                        <Typography variant="body1" color= {theme.text} sx={{ marginBottom: 1 }}>
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
                                name="email"
                                placeholder="Enter your email address"
                                variant="outlined"
                                fullWidth
                                size="small"
                                onChange={handleInputChange}
                                InputProps={{
                                    sx: {
                                        backgroundColor: theme.background,
                                        color: theme.text,
                                        borderRadius: "10px",
                                        "&.Mui-focused": {
                                            backgroundColor: theme.input_bg,
                                        },
                                    },
                                }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                            border: "1px solid " + theme.text, 
                                            borderColor: theme.text,
                                        },
                                        "&:hover fieldset": {
                                            border: "1px solid " + theme.text,
                                            borderColor: theme.text,
                                        },
                                        "&.Mui-focused fieldset": {
                                            border: "1px solid " + theme.text,
                                            borderColor: theme.box_bg_border,
                                        },
                                    },
                                }}
                            />
                        </Tooltip>
                    </Box>

                    <Box sx={{ marginBottom: 3 }}>
                        <Typography variant="body1" color={theme.text} sx={{ marginBottom: 1 }}>
                            Password
                        </Typography>
                        <Tooltip
                            title={
                                isSubmitted && !formValues["password"]
                                    ? `Fill out this field`
                                    : ""
                            }
                            arrow
                            placement="top"
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
                                            {showPassword ? <VisibilityOff sx={{ color: theme.text }} /> : <Visibility sx={{ color: theme.text }} />}
                                        </IconButton>
                                    ),
                                    sx: {
                                        backgroundColor: theme.background,
                                        color: theme.text,
                                        borderRadius: "10px",
                                        "&.Mui-focused": {
                                            backgroundColor: theme.input_bg,
                                        },
                                    },
                                }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                            border: "1px solid " + theme.text, 
                                            borderColor: theme.text,
                                        },
                                        "&:hover fieldset": {
                                            border: "1px solid " + theme.text,
                                            borderColor: theme.text,
                                        },
                                        "&.Mui-focused fieldset": {
                                            border: "1px solid " + theme.text,
                                            borderColor: theme.box_bg_border,
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
                            bgcolor: theme.box_bg,
                            color: theme.secondary_text,
                            py: 1,
                            fontSize: "1rem",
                            borderRadius: "30px",
                            border: "1px solid " + theme.login_button_bg_border,
                            "&:hover": {
                                bgcolor: theme.login_button_bg_hover,
                                border: "1px solid " + theme.text,
                            },
                        }}
                    >
                        Sign in ➔
                    </Button>

                    <Typography variant="body2" align="right" mt={2} style={{ color: theme.text_2 }}>
                        <Link onClick={() => navigate("/forgotpassword")} underline="hover" style={{ color: theme.text_2, fontWeight: "bold", cursor: "pointer" }}>
                            Forgot Password?
                        </Link>{" "}
                    </Typography>
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
                    backgroundColor: theme.right_grid_bg,
                    border: "1px solid" + theme.right_grid_bg_border,
                    display: { xs: "none", md: "flex" },
                    justifyContent: "center",
                    alignItems: "center",
                    borderTopLeftRadius: { md: "30px" },
                    borderBottomLeftRadius: { md: "30px" },
                }}
            >
                <Box onClick={() => navigate("/")} sx={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }}>
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