import React, { useState } from "react";
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton } from "@mui/material";
import AssignmentIcon from '@mui/icons-material/Assignment';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useNavigate } from "react-router-dom";
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import { useParams } from "react-router-dom";

function RightSideBar() {
    const navigate = useNavigate();
    const { domain } = useParams();

    return (
        <Drawer
            variant="permanent"
            anchor="right"
            sx={{
                '& .MuiDrawer-paper': {
                    width: 120,
                    transition: "width 0.3s ease",
                    backgroundColor: "transparent",
                    border: "1px solid transparent",
                    overflowX: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    marginTop:"30px"
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
                    width: '60px',
                    transition: "width 0.3s ease",
                    mr: 2
                }}
            >
                <List sx={{ width: "100%" }}>
                    {[
                        { text: "Target Infomation", icon: <AssignmentIcon />, navigateto: `${domain}/targetinfo` },
                        { text: "Subdomain Enumeration", icon: <FormatListBulletedIcon />, navigateto: `${domain}/subdomainenumeration` },
                        { text: "IP & Ports", icon: <AttachFileIcon />, navigateto: `${domain}/ipandports` },
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
                                <Tooltip title={item.text} arrow placement="top-start" slots={{
                                    transition: Zoom,
                                }}
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
                                            mr: "auto",
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                </Tooltip>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
}

export default RightSideBar;
