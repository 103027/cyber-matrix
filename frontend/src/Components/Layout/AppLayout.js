import React, { useState } from "react";
import { Box } from "@mui/material";
import LeftSidebar from "./LeftSidebar";
import MainTabs from "./Tabs";
import { Outlet } from "react-router-dom";
import RightSideBar from "./RightSiderbar";
import { useLocation } from "react-router-dom";

function AppLayout() {
    const [tabName, setTabName] = useState();
    const location = useLocation();

    const getName = (name) => {
        setTabName(name);
    };

    const shouldDisplayRightSidebar = !["/dashboard","/Dashboard", "/home", "/Settings","/settings" ,"/History","/history"].includes(location.pathname);

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
                        marginRight: shouldDisplayRightSidebar ? "100px" : "0px",
                        position: "relative", // Add relative position
                        zIndex: 1
                    }}
                >
                    <Outlet />
                </Box>
            </Box>
            {shouldDisplayRightSidebar && <RightSideBar/>}
        </Box>
    );
}

export default AppLayout;