import React, { useState , useEffect} from "react";
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Avatar, Typography, ListItemButton } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LogoutIcon from '@mui/icons-material/Logout';


function LeftSidebar(props) {
    const [open, setOpen] = useState(() => {
        const storedState = localStorage.getItem("sidebarOpen");
        return storedState !== null ? JSON.parse(storedState) : true;
    });

    useEffect(() => {
        localStorage.setItem("sidebarOpen", JSON.stringify(open));
    }, [open]);

    const handleToggle = () => {
        setOpen(!open);
    };

    const openTab = (name) => {
        props.getName(name);
    };

    useEffect(() => {
        props.getName(props.name);
    }, [props.name]);

    return (
        <Box sx={{ display: "flex", position: "relative" }}>
            <Drawer
                variant="permanent"
                sx={{
                    width: open ? 200 : 80,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: open ? 200 : 80,
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
                            <img onClick={() => { openTab("home") }} src={require("../../Images/logo2.png")} alt="Cyber-Matrix Logo" style={{ width: "60px", marginBottom: "10px" }} />
                            {open && (
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
                                        justifyContent: open ? "initial" : "center",
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
                                            mr: open ? 2 : "auto",
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.text}
                                        sx={{
                                            opacity: open ? 1 : 0,
                                            transition: "opacity 0.3s ease",
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
                <Box p={1} width="100%" textAlign="center" mt={"auto"}>
                    <ListItem
                        button
                        sx={{
                            justifyContent: open ? "initial" : "center",
                            px: 1,
                            bgcolor: "#333333",
                            borderRadius: 2,
                            ml: 1,
                            width: open ? "auto" : 50,
                            mr: open ? 2 : "auto",
                            mb: 2
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: "center" }}>
                            <Avatar sx={{ width: 32, height: 32 }} src="/path-to-avatar.png" />
                        </ListItemIcon>
                        {
                            open
                            &&
                            <>
                                <Typography variant="body2" fontWeight="bold">Hassan Muzaffar</Typography>
                                <ListItemIcon sx={{ minWidth: 0, ml: open ? 3 : 'auto', justifyContent: "center" }}>
                                    <LogoutIcon color="action" fontSize="small" />
                                </ListItemIcon>
                            </>
                        }
                    </ListItem>
                </Box>
            </Drawer>
            <IconButton
                onClick={handleToggle}
                sx={{
                    color: "#fff",
                    position: "fixed",
                    right: open ? -12 : -12,
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
                    left: open ? "190px" : "70px", // Adjust position based on sidebar width
                    transition: "left 0.3s ease" // Smooth transition
                }}
            >
                {open ? <ChevronLeftIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
            </IconButton>
        </Box>
    );
}

export default LeftSidebar;