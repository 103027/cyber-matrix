import React from "react";
import { Box, Typography } from "@mui/material";
import Features from "../Components/Features";
import ContactUs from "../Components/Contactus";
import Footer from "../Components/footer";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import { Link } from "react-scroll";

function LandingPage() {
    const navigate = useNavigate();

    return (
        <Box sx={{ color: "#fff", backgroundColor: "#333333" }}>
            <AppBar position="static" sx={{ backgroundColor: "black" }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ padding: "50px" }}>
                        <img
                            src={require("../Images/logo.png")}
                            alt="Cyber-Matrix Logo"
                            style={{ width: "50px", marginBottom: "10px" }}
                        />
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            <Button
                                onClick={() => navigate("/docs")}
                                sx={{
                                    my: 2,
                                    ml: 4,
                                    color: "white",
                                    display: "block",
                                    textTransform: "none",
                                    border: "2px solid black",
                                    borderRadius: "30px",
                                    "&:hover": {
                                        border: "2px solid #49494C",
                                        borderRadius: "30px",
                                    },
                                }}
                            >
                                Docs
                            </Button>
                            <Link
                                to="features"
                                smooth={true}
                                duration={500}
                            >
                                <Button
                                    sx={{
                                        my: 2,
                                        ml: 4,
                                        color: "white",
                                        display: "block",
                                        textTransform: "none",
                                        border: "2px solid black",
                                        borderRadius: "30px",
                                        "&:hover": {
                                            border: "2px solid #49494C",
                                            borderRadius: "30px",
                                        },
                                    }}
                                >
                                    Features
                                </Button>
                            </Link>
                            <Link
                                to="contact"
                                smooth={true}
                                duration={500}
                            >
                                <Button
                                    sx={{
                                        my: 2,
                                        ml: 4,
                                        color: "white",
                                        display: "block",
                                        textTransform: "none",
                                        border: "2px solid black",
                                        borderRadius: "30px",
                                        "&:hover": {
                                            border: "2px solid #49494C",
                                            borderRadius: "30px",
                                        },
                                    }}
                                >
                                    Contact
                                </Button>
                            </Link>
                        </Box>
                        <Box sx={{ display: "flex", ml: "auto" }}>
                            <Button
                                onClick={() => navigate("/login")}
                                sx={{
                                    my: 2,
                                    color: "white",
                                    textTransform: "none",
                                    border: "2px solid black",
                                    borderRadius: "30px",
                                    ml: 2,
                                    "&:hover": {
                                        border: "2px solid #49494C",
                                        borderRadius: "30px",
                                    },
                                }}
                            >
                                Login
                            </Button>
                            <Button
                                onClick={() => navigate("/signup")}
                                sx={{
                                    my: 2,
                                    color: "white",
                                    textTransform: "none",
                                    border: "2px solid #49494C",
                                    borderRadius: "30px",
                                    ml: 4,
                                    pr: 4,
                                    pl: 4,
                                }}
                            >
                                Get started
                            </Button>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    borderBottom: "2px solid #333333",
                    // borderBottomLeftRadius: "50%",
                    // borderBottomRightRadius: "50%",
                    backgroundColor: "black",
                    height: "70vh",
                }}
            >
                <img
                    src={require("../Images/name.png")}
                    alt="Cyber-Matrix name"
                    style={{ width: "300px", marginBottom: "10px" }}
                />
                <Typography
                    variant="subtitle1"
                    gutterBottom
                    sx={{
                        fontSize: '1.0rem', // Slightly larger font for better readability
                        fontWeight: 500, // Semi-bold for emphasis
                        color: "#EFEFEF",
                        marginTop: '1rem', // Add spacing above
                        maxWidth: '800px', // Restrict width for better focus
                    }}
                >
                    Securing Cyberspace, Simplifying Security
                </Typography>
                <Button
                    onClick={() => navigate("/signup")}
                    sx={{
                        my: 2,
                        color: "white",
                        textTransform: "none",
                        border: "2px solid #49494C",
                        borderRadius: "30px",
                        ml: 4,
                        pr: 4,
                        pl: 4,
                    }}
                >
                    Get started
                </Button>
            </Box>
            <Box
                sx={{
                    width: 0,
                    height: 0,
                    borderRight: "100vw solid transparent",
                    borderBottom: "6.9vw solid #333333",
                    marginTop: "-6.9vw"
                }}
            >
            </Box>
            <Box sx={{ pl: 7, pr: 7, pb: 4 }}>
                <Box
                    id="features"
                >
                    <Features />
                </Box>
                <Box
                    id="contact"
                >
                    <ContactUs />
                </Box>
                <Footer />
            </Box>
        </Box>
    );
}

export default LandingPage;
