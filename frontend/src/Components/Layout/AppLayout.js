import React, { useState } from "react";
import { Box } from "@mui/material";
import LeftSidebar from "./LeftSidebar";
import MainTabs from "./Tabs";
import { Outlet } from "react-router-dom";

function AppLayout() {
    const [tabName, setTabName] = useState();

    const getName = (name) => {
        setTabName(name);
    };

    return (
        <Box sx={{ backgroundColor: "#333333", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Box sx={{
                width: "100%", position: "sticky",
                top: 0,
                zIndex: 1000,
            }}>
                <MainTabs Name={tabName} />
            </Box>

            <Box sx={{ display: "flex", flexGrow: 1 }}>
                <Box>
                    <LeftSidebar getName={getName} />
                </Box>
                <Box
                    sx={{
                        flexGrow: 1,
                        backgroundColor: "#333333",
                        padding: 5,
                        overflow: "auto",
                    }}
                >
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}

export default AppLayout;