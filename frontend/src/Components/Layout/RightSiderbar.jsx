import React, { useState } from "react";
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton } from "@mui/material";
import AssignmentIcon from '@mui/icons-material/Assignment';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useNavigate } from "react-router-dom";

function RightSideBar(props) {
    const navigate = useNavigate();

    return (
        <Drawer
            variant="permanent"
            anchor="right"
            open={props.open}
            onMouseEnter={() => props.setOpen(true)}
            onMouseLeave={() => props.setOpen(false)}
            sx={{
                '& .MuiDrawer-paper': {
                    width: props.open ? 250 : 120,  // Adjust width based on the open state
                    transition: "width 0.3s ease",
                    backgroundColor: "transparent",
                    border: "1px solid transparent",
                    overflowX: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff"
                }
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#49494C",
                    padding: "20px",
                    border: "1px solid #49494C",
                    borderRadius: "20px",
                    width: props.open ? 'calc(100% - 60px)' : '60px',  // Adjust width based on the open state
                    transition: "width 0.3s ease",
                    mr: 2
                }}
            >
                <List sx={{ width: "100%" }}>
                    {[
                        { text: "Target Infomation", icon: <AssignmentIcon />, navigateto:"/targetinfo" },
                        { text: "Subdomain Enumeration", icon: <FormatListBulletedIcon />, navigateto:"/subdomainenueration" },
                        { text: "IP & Ports", icon: <AttachFileIcon />, navigateto:"/ipandports" },
                    ].map((item, index) => (
                        <ListItem disablePadding sx={{ display: 'block', mb: 3 }} key={index}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: "initial",
                                    px: 1,
                                }}
                                onClick={() => navigate(item.navigateto)}
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
                                {props.open && <ListItemText
                                    primary={item.text}
                                    sx={{
                                        opacity: 1,
                                        transition: "opacity 0.3s ease",
                                    }}
                                />}
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
}

export default RightSideBar;
