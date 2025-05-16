import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Snackbar, IconButton, Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import { useTheme } from "../contexts/theme/ThemeContext.jsx";

const NotificationSnackbar = forwardRef((_, ref) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { theme } = useTheme();

  // Allow parent components to call `showSnackbar`
  useImperativeHandle(ref, () => ({
    showSnackbar(notificationMessage) {
      setMessage(notificationMessage);
      setOpen(true);
    },
  }));

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      autoHideDuration={3000} // Auto-hide after 3 seconds
      anchorOrigin={{ vertical: "top", horizontal: "right" }} // Top-right position
      sx={{
        "& .MuiSnackbarContent-root": {
          backgroundColor: theme.bg_list_Item_Icon,
          color: theme.text_3,
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
        },
      }}
      message={
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <NotificationImportantIcon
            sx={{ color: "#FFD700", marginRight: "8px" }}
          />
          <Typography
            variant="body2"
            sx={{ flexGrow: 1, fontSize: "1rem", color: theme.text_3 }}
          >
            {message}
          </Typography>
        </Box>
      }
      action={
        <IconButton
          size="small"
          color="inherit"
          onClick={handleClose}
          sx={{ marginLeft: "8px" }}
        >
          <CloseIcon />
        </IconButton>
      }
    />
  );
});

export default NotificationSnackbar;
