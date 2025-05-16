import React from "react";
import { Box } from "@mui/material";
import PropTypes from "prop-types";

function Loading({ logo, size = 100, animation = "zoom" }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "65vh",
        color: "#ffffff",
      }}
    >
      <Box
        component="img"
        src={logo}
        alt="Loading"
        sx={{
          width: `${size}px`,
          height: `${size}px`,
          animation: `${animation} 2s ease-in-out infinite`,
        }}
      />
      {/* Inline CSS for animations */}
      <style>
        {`
          @keyframes zoom {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1);
            }
          }
        `}
      </style>
    </Box>
  );
}

Loading.propTypes = {
  logo: PropTypes.string.isRequired, // Path to the SVG
  size: PropTypes.number, // Optional: Size of the logo
  animation: PropTypes.oneOf(["zoom"]), // Animation type (only zoom for now)
  message: PropTypes.string, // Optional: Loading message
};

export default Loading;
