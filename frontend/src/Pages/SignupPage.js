import React, { useState } from "react";
import { Box, TextField, Button, Typography, Link, Grid, IconButton, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNotification } from "../contexts/NotificationContext.jsx";
import api from "../api/axois.jsx";

function Signup() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [openPasswordConditions, setOpenPasswordConditions] = useState(false);
  const [isSame, setIsSame] = useState(true);
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    if (name === "password") {
      if (value) {
        setOpenPasswordConditions(true);
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (passwordRegex.test(value)) {
          setOpenPasswordConditions(false);
        }
      } else {
        setOpenPasswordConditions(false);
      }
      setIsSubmitted(false);
    } else {
      // Reset state for other fields
      setIsSubmitted(false);
      setOpenPasswordConditions(false);
      setIsSame(true)
    }
  };

  const registerUser = async (userInput) => {
    try {
      const response = await api.post(`/register`, userInput);
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
    setIsValidPassword(true);
    setIsSame(true)
    const { name, email, password, confirmPassword } = formValues;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
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

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      console.log("Password must be at least 8 characters long, contain at least one number, one special character, and one uppercase letter");
      setIsValidPassword(false);
      showNotification("Form is not valid")
      return;
    }

    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      setIsSame(false)
      showNotification("Form is not valid")
      return;
    }

    // Log all input values
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);

    const userInput = {
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
    };

    // Add API call or further actions here
    registerUser(userInput);
  };

  const handleClick = (event) => {
    event.preventDefault();
    navigate("/login");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
              Get started with Cyber-Matrix
            </Typography>
            <Typography variant="body2" gutterBottom style={{ color: "#D9D9D9" }}>
              Already Registered?{" "}
              <Link onClick={handleClick} underline="hover" style={{ color: "#D9D9D9", fontWeight: "bold", cursor: "pointer", }}>
                Sign in
              </Link>{" "}
              to your account
            </Typography>
          </Box>

          <Box sx={{ marginBottom: 3 }}>
            <Typography variant="body1" color="white" sx={{ marginBottom: 1 }}>
              Name
            </Typography>
            <Tooltip
              title={
                isSubmitted && !formValues["name"]
                  ? `Fill out this field`
                  : ""
              }
              arrow
              placement="right"
              open={isSubmitted && !formValues["name"]}
            >
              <TextField
                name="name"
                placeholder="Enter your name"
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
                !formValues["password"] && isSubmitted
                  ? "Fill out this field"
                  : openPasswordConditions ? (
                    <span style={{
                      fontSize: '1.0rem',
                      fontFamily: 'Poppins, sans-serif',
                      color:'#F5F5F5'
                    }}>
                      Follow the format:
                      <br /> - At least 8 characters
                      <br /> - At least 1 special character
                      <br /> - At least 1 number
                      <br /> - At least 1 capital letter
                    </span>
                  ) : ""
              }
              arrow
              placement="right"
              open={
                (!formValues["password"] && isSubmitted) || openPasswordConditions
              }
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

          <Box sx={{ marginBottom: 4 }}>
            <Typography variant="body1" color="white" sx={{ marginBottom: 1 }}>
              Confirm Password
            </Typography>
            <Tooltip
              title={
                isSubmitted && !formValues["confirmPassword"]
                  ? `Fill out this field`
                  : ""
              }
              arrow
              placement="right"
              open={isSubmitted && !formValues["confirmPassword"]}
            >
              <TextField
                name="confirmPassword"
                placeholder="Enter your password again"
                type={showConfirmPassword ? "text" : "password"} // Toggle between text and password
                variant="outlined"
                fullWidth
                size="small"
                onChange={handleInputChange}
                helperText={!isSame ? "The two password fields didn’t match." : ""}
                FormHelperTextProps={{
                  style: {
                    color: !isSame ? "white" : "inherit",
                    fontSize: "1.0rem",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={toggleConfirmPasswordVisibility} edge="end">
                      {showConfirmPassword ? <VisibilityOff sx={{ color: "white" }} /> : <Visibility sx={{ color: "white" }} />}
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
            Sign Up ➔
          </Button>

          <Typography variant="body2" align="center" mt={2} style={{ color: "#D9D9D9" }}>
            By signing up, you agree to the{" "}
            <Link onClick={() => navigate("/terms")} underline="hover" style={{ color: "#D9D9D9", fontWeight: "bold", cursor: "pointer", }}>
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link onClick={() => navigate("/privacy_policy")} underline="hover" style={{ color: "#D9D9D9", fontWeight: "bold", cursor: "pointer", }}>
              Privacy Policy
            </Link>.
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

export default Signup;
