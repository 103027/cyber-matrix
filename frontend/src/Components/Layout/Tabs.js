import React, { useState, useEffect, useCallback } from "react";
import { Box, Dialog, TextField, Tabs, Tab, IconButton, Avatar, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { useTargetInfo } from "../../contexts/TargetInfoContext.jsx";
import { useSubdomain } from "../../contexts/SubdomainContext.jsx";
import { useIPandPorts } from "../../contexts/IPandPortsContext.jsx"

function MainTabs(props) {
    const [tabs, setTabs] = useState(() => {
        const storedTabs = localStorage.getItem("tabs");
        return storedTabs
            ? JSON.parse(storedTabs)
            : [{ label: "home", icon: "home" }];
    });

    const [value, setValue] = useState(() => {
        const savedActiveTab = localStorage.getItem("activeTab");
        return savedActiveTab ? parseInt(savedActiveTab, 10) : 0;
    });
    const [openModal, setOpenModal] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const { removeTargetInfo } = useTargetInfo();
    const { removeSubdomains } = useSubdomain()
    const { removeIPandPorts } = useIPandPorts()
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem("tabs", JSON.stringify(tabs));
        localStorage.setItem("activeTab", value);
    }, [tabs, value]);

    const handleAddTab = useCallback(() => {
        setOpenModal(true);
    }, []);

    const handleModalClose = useCallback(() => {
        setOpenModal(false);
        setInputValue("");
    }, []);

    const handleAddTabSubmit = () => {
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
        removeTargetInfo(removedTab.label);
        removeSubdomains(removedTab.label);
        removeIPandPorts(removedTab.label );
        if (value === index) {
            setValue(0);
            navigate("/home");
        } else if (value > index) {
            setValue((prev) => prev - 1);
        }
    };

    const handleChange = (event, newValue) => {
        setValue(newValue + 1);
        const selectedTab = tabs[newValue + 1];
        if (selectedTab.label == "home" || selectedTab.label == "dashboard" || selectedTab.label == "settings" || selectedTab.label == "history" || selectedTab.label == "Dashboard" || selectedTab.label == "Settings" || selectedTab.label == "History") {
            navigate("/" + selectedTab.label);
        } else {
            navigate("/" + selectedTab.label + "/targetinfo");
        }
    };

    useEffect(() => {
        if (props.Name) {
            if (props.Name == "home" || props.Name == "dashboard" || props.Name == "settings" || props.Name == "history" || props.Name == "Dashboard" || props.Name == "Settings" || props.Name == "History") {
                navigate("/" + props.Name);
            } else {
                navigate("/" + props.Name + "/targetinfo");
            }
            const tabExists = tabs.find((tab) => tab.label === props.Name);
            if (tabExists) {
                const existingTabIndex = tabs.findIndex((tab) => tab.label === props.Name);
                setValue(existingTabIndex);
            }
            else {
                setTabs([...tabs, { label: props.Name }]);
                setValue(tabs.length);
            }
        }
    }, [props.Name]);

    return (
        <Box sx={{ display: "flex", flexGrow: 1, flexDirection: "column", width: "100%", }}>
            <Box
                sx={{
                    backgroundColor: "#26272B",
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <Tab
                    label={
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <HomeIcon />
                        </Box>
                    }
                    selected={value === 0}
                    onClick={() => {
                        setValue(0)
                        navigate("/home");
                    }}
                    sx={{
                        color: "#ffffff",
                        backgroundColor: value === 0 ? "#333333" : "transparent",
                        minHeight: "48px",
                        padding: "0 12px",
                        borderRight: "0.5px solid #aaa",
                        borderBottom: "1px solid #aaa",
                        "&.Mui-selected": {
                            borderBottom: "none",
                        },
                        "& .MuiTab-wrapper": {
                            display: "flex",
                            alignItems: "center",
                        },
                    }}
                    disableRipple
                />
                <Box sx={{ overflowX: "auto", display: "flex" }}>
                    <Tabs
                        value={value > 0 ? value - 1 : false}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons={false}
                        sx={{
                            // borderBottom: "1px solid #333333",
                            minHeight: "48px",
                            "& .MuiTabs-indicator": { display: "none" },
                            "& .MuiTab-root": {
                                color: "#aaa",
                                minHeight: "48px",
                                padding: "0 12px",
                                borderBottom: "1px solid #aaa",
                            },
                            "& .Mui-selected": {
                                backgroundColor: "#333333",
                                borderBottom: "none",
                                color: "#ffffff",
                            },
                            "& .Mui-focusVisible": {
                                outline: "none", // Remove blue outline on focus
                            },

                        }}
                    >
                        {tabs.slice(1).map((tab, index) => (
                            <Tab
                                key={index + 1}
                                label={
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <Typography sx={{
                                            ml: 1, fontWeight: "bold", maxWidth: 200, // Limit the width
                                            overflow: "hidden",
                                            whiteSpace: "nowrap",
                                            textOverflow: "ellipsis",
                                        }}>{tab.label}</Typography>
                                        {value === index + 1 && ( // Display Close button only for selected tab
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveTab(index + 1);
                                                }}
                                                sx={{ ml: 1, color: "#aaa" }}
                                            >
                                                <CloseIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                    </Box>
                                }
                                sx={{
                                    borderRight: "0.5px solid #aaa",
                                    "&.Mui-selected": {
                                        color: "#ffffff", // Set selected tab text color
                                    },
                                }}

                            />
                        ))}
                    </Tabs>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "47px",
                        borderBottom: " 1px solid #aaa",
                        borderLeft: " 0.5px solid #aaa",
                        "&:hover": { color: "#ffffff" },
                    }}
                >
                    <IconButton onClick={handleAddTab} sx={{ color: "#aaa" }}>
                        <AddIcon />
                    </IconButton>
                </Box>
                <Box
                    sx={{
                        flexGrow: 1,
                        borderBottom: "1px solid #aaa",
                        mt: 5.9
                    }}
                />
            </Box>
            <Dialog open={openModal} onClose={handleModalClose} maxWidth="md" fullWidth sx={{ mb: 40, ml: 10 }}
                PaperProps={{
                    sx: { boxShadow: 'none', backgroundColor: 'transparent' }
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", backgroundColor: "#26272B", padding: "8px 16px", borderRadius: "20px", border: "2px solid #BCB6B6" }}>
                    <SearchIcon sx={{ color: "#BCB6B6", mr: 1 }} />
                    <TextField
                        placeholder="Enter the target Domain"
                        variant="standard"
                        fullWidth
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault(); // Prevents Dialog from closing unintentionally
                                handleAddTabSubmit();
                            }
                        }}
                        InputProps={{
                            disableUnderline: true,
                            style: { color: "#fff" },
                        }}
                        sx={{ ml: 2 }}
                    />
                    <Button
                        variant="outlined"
                        sx={{
                            color: "#BCB6B6",
                            borderColor: "#BCB6B6",
                            "&:hover": {
                                borderColor: "#BCB6B6",
                                backgroundColor: "rgba(188, 182, 182, 0.1)"
                            },
                        }}
                        onClick={handleAddTabSubmit}
                    >
                        Enter
                    </Button>
                </Box>
            </Dialog>
        </Box>
    );
}

export default MainTabs;