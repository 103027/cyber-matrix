import React from "react";
import { Box, Typography } from "@mui/material";
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";

function HeroSection() {
    const navigate = useNavigate();

    return (
        <Box>
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
                <Box
                    sx={{
                        textAlign: "center",
                        animation: "fadeSlideIn 1s ease-in-out",
                    }}
                >
                    {/* Logo */}
                    <img
                        src={require("../Images/name.png")}
                        alt="Cyber-Matrix name"
                        style={{
                            width: "300px",
                            marginBottom: "10px",
                            animation: "bounceIn 1.5s ease-in-out",
                        }}
                    />

                    {/* Tagline */}
                    <Typography
                        variant="subtitle1"
                        gutterBottom
                        sx={{
                            fontSize: "1.0rem",
                            fontWeight: 500,
                            color: "#EFEFEF",
                            marginTop: "1rem",
                            maxWidth: "800px",
                            animation: "fadeSlideIn 1.5s ease-in-out",
                        }}
                    >
                        Securing Cyberspace, Simplifying Security
                    </Typography>
                    <Button
                        onClick={() => navigate("/signup")}
                        sx={{...animatedButtonStyle, animation: "fadeSlideIn 1.5s ease-in-out",}}
                    >
                        Get started
                    </Button>

                    {/* Injecting CSS Animations */}
                    <style>
                        {`
                            @keyframes fadeSlideIn {
                                0% {
                                    opacity: 0;
                                    transform: translateY(20px);
                                }
                                100% {
                                    opacity: 1;
                                    transform: translateY(0);
                                }
                            }

                            @keyframes bounceIn {
                                0% {
                                    opacity: 0;
                                    transform: scale(0.8);
                                }
                                60% {
                                    opacity: 1;
                                    transform: scale(1.1);
                                }
                                100% {
                                    transform: scale(1);
                                }
                            }
                        `}
                    </style>
                </Box>
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
        </Box>
    );
}

const animatedButtonStyle = {
    my: 2,
    color: "white",
    textTransform: "none",
    border: "2px solid #49494C",
    borderRadius: "30px",
    ml: 4,
    pr: 4,
    pl: 4,
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#b5b5b5",
    transition: "color 500ms ease-in-out",
    zIndex: 1,

    "&::before": {
        content: '""',
        position: "absolute",
        top: "50%",
        left: "50%",
        width: "200%",
        height: "200%",
        backgroundColor: "black",
        borderRadius: "50%",
        transition: "transform 500ms ease-in-out",
        transform: "translate(-50%, -50%) scale(1.5)",
        zIndex: -1,
    },

    "&:hover::before, &:focus::before": {
        transform: "translate(-50%, -50%) scale(0)",
    },

    "&:hover, &:focus": {
        color: "black",
    },
};

export default HeroSection;
