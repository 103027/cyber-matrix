import React, { useState, useEffect, useCallback } from "react";
import { Box, useMediaQuery } from "@mui/material";
import LeftSidebar from "./LeftSidebar.jsx";
import MainTabs from "./Tabs.jsx";
import { Outlet } from "react-router-dom";
import RightSideBar from "./RightSiderbar.jsx";
import { useLocation } from "react-router-dom";
import { useNotification } from "../../contexts/NotificationContext.jsx";
import { useNavigate } from "react-router-dom";
import { removeTargetInfo, clearAllTargetInfo } from '../../features/targetInfoSlice'
import { removeSubdomains, clearAllSubdomains } from "../../features/subdomainSlice.js";
import { removeIPandPorts, clearAllIPandPorts } from "../../features/ipandportsSlice.js";
import { useDispatch } from "react-redux";
import { removeSipCalc, clearAllSipCalc } from '../../features/sipcalcSlice.js';
import { removeCVE, clearAllCVE } from '../../features/cveSlice.js';
import { useTheme } from "../../contexts/theme/ThemeContext.jsx";
import ChatBot from "../ChatBot.jsx";
import { useScan } from "../../contexts/ScanContext.jsx";

function AppLayout() {
    const [username, setUsername] = useState("");
    const location = useLocation();
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const [open, setOpen] = useState(() => {
        const storedState = localStorage.getItem("sidebarOpen");
        return storedState !== null ? JSON.parse(storedState) : true;
    });
    const [openWhenTempDrawer, setOpenWhenTempDrawer] = useState(false);
    const [tabs, setTabs] = useState(() => {
        const storedTabs = localStorage.getItem("tabs");
        return storedTabs
            ? JSON.parse(storedTabs)
            : [{ label: "Dashboard", icon: "Dashboard" }];
    });
    const [value, setValue] = useState(() => {
        const savedActiveTab = localStorage.getItem("activeTab");
        return savedActiveTab ? parseInt(savedActiveTab, 10) : 0;
    });
    const [openModal, setOpenModal] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const isMobile = useMediaQuery("(max-width: 700px)");
    const dispatch = useDispatch()
    const { theme } = useTheme();
    const { resetScans } = useScan()

    const getName = (tabName) => {
        if (tabName) {
            if (tabName === "Dashboard" || tabName === "Settings" || tabName === "History") {
                navigate("/" + tabName);
            } else {
                navigate("/" + tabName + "/targetinfo");
            }
            const tabExists = tabs.find((tab) => tab.label === tabName);
            if (tabExists) {
                const existingTabIndex = tabs.findIndex((tab) => tab.label === tabName);
                setValue(existingTabIndex);
            }
            else {
                setTabs(tabs => [...tabs, { label: tabName }]);
                setValue(tabs.length);
            }
        }
    };

    const shouldDisplayRightSidebar = !["/dashboard", "/Dashboard", "/home", "/Settings", "/settings", "/History", "/history"].includes(location.pathname);

    const handleToggle = () => {
        setOpen(!open);
    };

    const handleToggleWhenTempDrawer = () => {
        setOpenWhenTempDrawer(!openWhenTempDrawer);
    }

    const handleClear = () => {
        dispatch(clearAllIPandPorts());
        dispatch(clearAllSubdomains());
        dispatch(clearAllTargetInfo());
        dispatch(clearAllSipCalc());
        dispatch(clearAllCVE());
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("tabs");
        localStorage.removeItem("activetabs");
        localStorage.removeItem('crackedPasswords');
        localStorage.removeItem('chatMessages');
        resetScans()
        handleClear()
        navigate("/login");
        showNotification("Logged out successfully!");
    };

    const handleModalClose = useCallback(() => {
        setOpenModal(false);
        setInputValue("");
    }, []);

    const handleAddTabSubmit = () => {
        console.log("from applayout: " + inputValue)
        if (inputValue) {
            console.log(inputValue)
            setTabs([...tabs, { label: inputValue }]);
            setValue(tabs.length);
            handleModalClose();
            navigate("/" + inputValue + "/targetinfo");
        }
    };

    const handleRemoveTab = (index) => {
        if (index === 0) return;
        const removedTab = tabs[index];
        const newTabs = tabs.filter((_, i) => i !== index);
        setTabs(newTabs);
        dispatch(removeTargetInfo(removedTab.label));
        dispatch(removeSubdomains(removedTab.label));
        dispatch(removeIPandPorts(removedTab.label));
        dispatch(removeSipCalc(removedTab.label));
        dispatch(removeCVE(removedTab.label));
        if (value === index) {
            setValue(0);
            navigate("/Dashboard");
        } else if (value > index) {
            setValue((prev) => prev - 1);
        }
    };

    const handleAddTab = useCallback(() => {
        setOpenModal(true);
    }, []);

    const handleChange = (event, newValue) => {
        setValue(newValue + 1);
        const selectedTab = tabs[newValue + 1];
        if (selectedTab.label === "Dashboard" || selectedTab.label === "Settings" || selectedTab.label === "History") {
            navigate("/" + selectedTab.label);
        } else {
            navigate("/" + selectedTab.label + "/targetinfo");
        }
    };

    useEffect(() => {
        localStorage.setItem("tabs", JSON.stringify(tabs));
        localStorage.setItem("activeTab", value);
    }, [tabs, value]);

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    return (
        <Box sx={{ backgroundColor: theme.background, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Box sx={{
                width: "100%", position: "sticky",
                top: 0,
                zIndex: 1000,
            }}>
                <MainTabs tabs={tabs} value={value} setValue={setValue} navigate={navigate} handleChange={handleChange} handleRemoveTab={handleRemoveTab} handleAddTab={handleAddTab} openModal={openModal} handleModalClose={handleModalClose} inputValue={inputValue} setInputValue={setInputValue} handleAddTabSubmit={handleAddTabSubmit} theme={theme}/>
            </Box>

            <Box sx={{ display: "flex", flexGrow: 1 }}>
                <Box>
                    <LeftSidebar getName={getName} username={username} handleLogout={handleLogout} openWhenTempDrawer={openWhenTempDrawer} open={open} handleToggle={handleToggle} handleToggleWhenTempDrawer={handleToggleWhenTempDrawer} setOpenWhenTempDrawer={setOpenWhenTempDrawer} theme={theme}/>
                </Box>
                <Box
                    sx={{
                        flexGrow: 1,
                        backgroundColor: theme.background,
                        padding: 5,
                        overflow: "auto",
                        height: "calc(100vh - 60px)",
                        position: "relative", // Add relative position
                        zIndex: 1,
                        scrollbarWidth: "none",
                    }}
                >
                    <Outlet />
                    {shouldDisplayRightSidebar && isMobile && (
                        <Box sx={{ width: "100px", flexShrink: 0, mt: 7 }}>
                            <RightSideBar isMobile={isMobile} theme={theme}/>
                        </Box>
                    )}
                </Box>
                {shouldDisplayRightSidebar && !isMobile && (
                    <Box sx={{ width: "100px", flexShrink: 0 }}>
                        <RightSideBar isMobile={isMobile} theme={theme}/>
                    </Box>
                )}
            </Box>
            <ChatBot />
        </Box>
    );
}

export default AppLayout;