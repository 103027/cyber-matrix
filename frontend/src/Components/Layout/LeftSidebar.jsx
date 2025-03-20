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
                        backgroundColor: props.theme.drawer_background,
                        color: props.theme.secondary_text,
                        overflowX: "hidden",
                        borderTopRightRadius: "20px",
                        borderBottomRightRadius: "20px",
                        border: "1px solid " + props.theme.drawer_background_border,
                        marginTop: "80px",
                    },
                }}
            >
                <Box display="flex" flexDirection="column" alignItems="center" p={1}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" px={1} sx={{ position: "relative" }}>
                        <Box display="flex" alignItems="center" mt={2}>
                            <img onClick={() => { openTab("Dashboard") }} src={require(props.theme.background === "#333333" ? "../../Images/logo2.png" : props.theme.background === "#000000" ? "../../Images/logo_hacker.png" : "../../Images/logo2_light.png")} alt="Cyber-Matrix Logo" style={{ width: "60px", marginBottom: "10px" }} />
                            {props.open && (
                                <Typography variant="h6" noWrap mb={1} sx={{ fontWeight: 'bold' }}>
                                    yber-Matrix
                                </Typography>
                            )}
                        </Box>
                    </Box>
                    <List sx={{ width: "100%" }}>
                        {[
                            { text: "Dashboard", icon: <DashboardIcon sx={{color: props.theme.text_3}}/> },
                            { text: "History", icon: <HistoryIcon sx={{color: props.theme.text_3}}/> },
                            { text: "Settings", icon: <SettingsIcon sx={{color: props.theme.text_3}}/> },
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
                                            bgcolor: props.theme.bg_list_Item_Icon,
                                            border: "1px solid " + props.theme.drawer_background_border,
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
                    <Box p={1} width="100%" textAlign="center" mt={"auto"} sx={{ cursor: "pointer" }}>
                        <ListItem disablePadding>
                            <ListItemButton
                                sx={{
                                    justifyContent: props.open ? "initial" : "center",
                                    px: 1,
                                    bgcolor: props.theme.bg_list_Item_Icon,
                                    border: "1px solid " + props.theme.drawer_background_border,
                                    borderRadius: 2,
                                    ml: 1,
                                    width: props.open ? "auto" : 50,
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
                                            <Typography variant="body2" fontWeight="bold" sx={{ color: props.theme.text_3 }}>{props.username}</Typography>
                                            <Box sx={{ minWidth: 0, ml: props.open ? 3 : "auto", justifyContent: "center" }}>
                                                <LogoutIcon sx={{ color: props.theme.text_3 }} fontSize="small" />
                                            </Box>
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
                            color: props.theme.text_3,
                            position: "fixed",
                            right: props.openWhenTempDrawer ? -12 : -12,
                            top: props.openWhenTempDrawer ? 130 : 130,
                            backgroundColor: props.theme.bg_arrow,
                            "&:hover": {
                                backgroundColor: props.theme.bg_arrow_hover,
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
                        {props.openWhenTempDrawer ? <ChevronLeftIcon sx={{ color: props.theme.text_3 }} fontSize="medium" /> : <ChevronRightIcon sx={{color: props.theme.text_3}} fontSize="medium" />}
                    </IconButton>
                    :
                    <IconButton
                        onClick={props.handleToggle}
                        sx={{
                            color: "#fff",
                            position: "fixed",
                            right: props.open ? -12 : -12,
                            top: 130,
                            backgroundColor: props.theme.bg_arrow,
                            "&:hover": {
                                backgroundColor: props.theme.bg_arrow_hover,
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
                        {props.open ? <ChevronLeftIcon sx={{ color: props.theme.text_3 }} fontSize="small" /> : <ChevronRightIcon sx={{ color: props.theme.text_3 }} fontSize="small" />}
                    </IconButton>
            }
        </Box>
    );
}

export default LeftSidebar;