import React, { useState, useRef, useEffect } from "react";
import { Box, List, ListItem, ListItemIcon, ListItemButton, Tooltip, Zoom } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import SearchIcon from "@mui/icons-material/Search";
import LanguageIcon from "@mui/icons-material/Language";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import { useLocation } from "react-router-dom";

function RightSideBar({ isMobile }) {
    const navigate = useNavigate();
    const { domain } = useParams();
    const location = useLocation();
    const listRef = useRef(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [selectedItem, setSelectedItem] = useState();
    let feature = location.pathname.split("/")[2];

    const menuItems = [
        { text: "Target Information", icon: <AssignmentIcon />, navigateto: `${domain}/targetinfo` },
        { text: "Subdomain Enumeration", icon: <FormatListBulletedIcon />, navigateto: `${domain}/subdomainenumeration` },
        { text: "IP & Ports", icon: <AttachFileIcon />, navigateto: `${domain}/ipandports` },
        { text: "Asset Enumeration", icon: <FingerprintIcon />, navigateto: `${domain}/ipandports` },
        { text: "Pentesting Tools", icon: <LanguageIcon />, navigateto: `${domain}/ipandports` },
        { text: "Network Scanning", icon: <SignalCellularAltIcon />, navigateto: `${domain}/ipandports` },
        { text: "CVE Reporting", icon: <SearchIcon />, navigateto: `${domain}/ipandports` },
        { text: "Password Cracking", icon: <LockOpenIcon />, navigateto: `${domain}/ipandports` },
    ];

    useEffect(() => {
        const handleScroll = () => {
            if (listRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = listRef.current;
                const progress = (scrollTop / (scrollHeight - clientHeight)) * (menuItems.length - 1);
                setScrollProgress(Math.round(progress));
            }
        };

        const listElement = listRef.current;
        if (listElement) {
            listElement.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (listElement) {
                listElement.removeEventListener("scroll", handleScroll);
            }
        };
    }, [menuItems.length]);

    useEffect(()=>{
        setSelectedItem(`${feature}`)
    },[feature])


    return (
        <Box
            sx={{
                height: isMobile ? "10vh" : "100vh",
                display: "flex",
                alignItems: isMobile ? "flex-end" : "center",
                justifyContent: "center",
            }}
        >
            <Box
                sx={{
                    position: "fixed",
                    right: isMobile ? "50%" : 0,
                    top: isMobile ? "none" : "60%",
                    bottom: isMobile ? 5 : "auto",
                    transform: isMobile ? "translateX(50%)" : "translateY(-60%)",
                    width: isMobile ? "60vw" : "60px",
                    backgroundColor: "#49494C",
                    padding: "20px",
                    border: "2px solid #3a3a3a",
                    borderRadius: "20px",
                    display: "flex",
                    flexDirection: isMobile ? "row" : "column",
                    alignItems: "center",
                    justifyContent: isMobile ? "center" : "space-between",
                    zIndex: 1000,
                    height: isMobile ? "60px" : "45vh",
                    mr: isMobile ? 0 : 2,
                }}
            >
                {
                    !isMobile && <Box
                        sx={{
                            position: "absolute",
                            left: "-15px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "6px",
                        }}
                    >
                        {menuItems.slice(0, 3).map((_, index) => (
                            <Box
                                key={index}
                                sx={{
                                    width: "8px",
                                    height: "8px",
                                    borderRadius: "50%",
                                    backgroundColor: scrollProgress >= index ? "#fff" : "#666",
                                }}
                            />
                        ))}
                    </Box>
                }

                {/* Scrollable List */}
                <List
                    ref={listRef}
                    sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: isMobile ? "row" : "column",
                        overflowX: isMobile ? "auto" : "hidden",
                        overflowY: isMobile ? "hidden" : "auto",
                        scrollbarWidth: "none",
                    }}
                >
                    {menuItems.map((item, index) => (
                        <ListItem disablePadding sx={{ display: "block", mb: isMobile ? 0 : 3 }} key={index}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: "initial",
                                    px: 1,
                                }}
                                onClick={() => {
                                    navigate(item.navigateto)
                                }}
                            >
                                <Tooltip title={item.text} arrow placement={isMobile ? "top" : "left"} TransitionComponent={Zoom}>
                                    <ListItemIcon
                                        sx={{
                                            color: "#fff",
                                            bgcolor: selectedItem === item.navigateto.split("/")[1] ? "#333333" : "transparent",
                                            borderRadius: 2,
                                            padding: 1,
                                            minWidth: 30,
                                            display: "flex",
                                            justifyContent: "center",
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
        </Box>
    );
}

export default RightSideBar;
