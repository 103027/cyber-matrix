import React from "react";
import { Box, Typography } from "@mui/material";

function Dashboard() {
    return (
        <Box sx={{ color: "#fff" }}>
            <Typography variant="h2">Dashboard</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
                This is the Dashboard content. It will take up the remaining space beside the sidebar and below the tabs.
            </Typography>
        </Box>
    );
}

export default Dashboard;
