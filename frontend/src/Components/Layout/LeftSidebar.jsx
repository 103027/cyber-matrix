import React, { useEffect } from "react";
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Avatar, Typography, ListItemButton, useMediaQuery } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LogoutIcon from '@mui/icons-material/Logout';
import Tooltip from '@mui/material/Tooltip';

function LeftSidebar(props) {
    const isMobile = useMediaQuery("(max-width: 700px)");

    const openTab = (name) => {
        props.setOpenWhenTempDrawer(false);
        props.getName(name);
    };

    useEffect(() => {
        localStorage.setItem("sidebarOpen", JSON.stringify(props.open));
    }, [props.open]);

    useEffect(() => {
        props.getName(props.name);
    }, [props.name]);

    return (
        <Box sx={{ display: "flex", position: "relative" }}>
            <Drawer
                variant={isMobile ? "temporary" : "permanent"}
                open={props.openWhenTempDrawer}
                sx={{
                    width: props.open ? 200 : 80,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: props.open ? 200 : 80,
                        height: "87vh",
                        transition: "width 0.3s ease",
                        backgroundColor: "#49494C",
                        color: "#fff",
                        overflowX: "hidden",
                        borderTopRightRadius: "20px",
                        borderBottomRightRadius: "20px",
                        marginTop: "80px",
                    },
                }}
            >
                <Box display="flex" flexDirection="column" alignItems="center" p={1}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" px={1} sx={{ position: "relative" }}>
                        <Box display="flex" alignItems="center" mt={2}>
                            <img onClick={() => { openTab("Dashboard") }} src={require("../../Images/logo2.png")} alt="Cyber-Matrix Logo" style={{ width: "60px", marginBottom: "10px" }} />
                            {props.open && (
                                <Typography variant="h6" noWrap mb={1} sx={{ fontWeight: 'bold' }}>
                                    yber-Matrix
                                </Typography>
                            )}
                        </Box>
                    </Box>
                    <List sx={{ width: "100%" }}>
                        {[
                            { text: "Dashboard", icon: <DashboardIcon /> },
                            { text: "History", icon: <HistoryIcon /> },
                            { text: "Settings", icon: <SettingsIcon /> },
                        ].map((item, index) => (
                            <ListItem disablePadding sx={{ display: 'block', mb: 3 }} key={index}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: props.open ? "initial" : "center",
                                        px: 1,
                                    }}
                                    onClick={() => { openTab(item.text) }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            color: "#fff",
                                            bgcolor: "#333333",
                                            borderRadius: 2,
                                            padding: 1,
                                            minWidth: 30,
                                            display: "flex",
                                            justifyContent: "center",
                                            mr: props.open ? 2 : "auto",
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.text}
                                        sx={{
                                            opacity: props.open ? 1 : 0,
                                            transition: "opacity 0.3s ease",
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
                <Tooltip title="Logout">
                    <Box p={1} width="100%" textAlign="center" mt={"auto"} onClick={() => props.handleLogout()} sx={{ cursor: "pointer" }}>
                        <ListItem disablePadding>
                            <ListItemButton
                                sx={{
                                    justifyContent: props.open ? "initial" : "center",
                                    px: 1,
                                    bgcolor: "#333333",
                                    borderRadius: 2,
                                    ml: 1,
                                    width: props.open ? 0 : 50,
                                    mr: props.open ? 2 : 3,
                                    mb: 2
                                }}
                                onClick={props.handleLogout} // Optional: Add logout function
                            >
                                <ListItemIcon sx={{ minWidth: 0, mr: props.open ? 3 : "auto", justifyContent: "center" }}>
                                    <Avatar sx={{ width: 32, height: 32 }} src="/path-to-avatar.png" />
                                </ListItemIcon>

                                {
                                    props.open && (
                                        <>
                                            <Typography variant="body2" fontWeight="bold">{props.username}</Typography>
                                            <ListItemIcon sx={{ minWidth: 0, ml: props.open ? 3 : "auto", justifyContent: "center" }}>
                                                <LogoutIcon color="action" fontSize="small" />
                                            </ListItemIcon>
                                        </>
                                    )
                                }
                            </ListItemButton>
                        </ListItem>

                    </Box>
                </Tooltip>
            </Drawer>
            {
                isMobile ?
                    <IconButton
                        onClick={props.handleToggleWhenTempDrawer}
                        sx={{
                            color: "#fff",
                            position: "fixed",
                            right: props.openWhenTempDrawer ? -12 : -12,
                            top: props.openWhenTempDrawer ? 130 : 130,
                            backgroundColor: "#26272B",
                            "&:hover": {
                                backgroundColor: "#3A3B40",
                            },
                            width: 30,
                            height: 30,
                            borderRadius: props.openWhenTempDrawer ? "20%" : "0 40% 40% 0",
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                            zIndex: 1300,
                            left: props.openWhenTempDrawer ? props.open ? "190px" : "70px" : "0px", // Adjust position based on sidebar width
                            transition: "left 0.3s ease" // Smooth transition
                        }}
                    >
                        {props.openWhenTempDrawer ? <ChevronLeftIcon fontSize="medium" /> : <ChevronRightIcon fontSize="medium" />}
                    </IconButton>
                    :
                    <IconButton
                        onClick={props.handleToggle}
                        sx={{
                            color: "#fff",
                            position: "fixed",
                            right: props.open ? -12 : -12,
                            top: 130,
                            backgroundColor: "#26272B",
                            "&:hover": {
                                backgroundColor: "#3A3B40",
                            },
                            width: 20,
                            height: 20,
                            borderRadius: "20%",
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                            zIndex: 1300,
                            left: props.open ? "190px" : "70px", // Adjust position based on sidebar width
                            transition: "left 0.3s ease" // Smooth transition
                        }}
                    >
                        {props.open ? <ChevronLeftIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
                    </IconButton>
            }
        </Box>
    );
}

export default LeftSidebar;