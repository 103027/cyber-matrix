import React from "react";
import { Box, Dialog, TextField, Tabs, Tab, IconButton, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';

function MainTabs({ tabs, value, setValue, navigate, handleChange, handleRemoveTab, handleAddTab, openModal, handleModalClose, handleAddTabSubmit, inputValue, setInputValue, theme }) {

    return (
        <Box sx={{ display: "flex", flexGrow: 1, flexDirection: "column", width: "100%", }}>
            <Box
                sx={{
                    backgroundColor: theme.tabs_bg,
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <Tab
                    label={
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <DashboardIcon/>
                        </Box>
                    }
                    selected={value === 0}
                    onClick={() => {
                        setValue(0)
                        navigate("/Dashboard");
                    }}
                    sx={{
                        color: theme.secondary_text,
                        backgroundColor: value === 0 ? theme.background : "transparent",
                        minHeight: "48px",
                        padding: "0 12px",
                        borderRight: "0.5px solid " + theme.tabs_notselected_color,
                        borderBottom: "1px solid " + theme.tabs_notselected_color,
                        "&.Mui-selected": {
                            borderBottom: "none",
                            color: theme.text,
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
                                color: theme.tabs_notselected_color,
                                minHeight: "48px",
                                padding: "0 12px",
                                borderBottom: "1px solid " + theme.tabs_notselected_color,
                            },
                            "& .Mui-selected": {
                                backgroundColor: theme.background,
                                borderBottom: "none",
                                color: theme.text,
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
                                            textTransform: "none"
                                        }}>{tab.label}</Typography>
                                        {value === index + 1 && ( // Display Close button only for selected tab
                                            <Box
                                                component="div"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveTab(index + 1);
                                                }}
                                                sx={{
                                                    ml: 1,
                                                    color: theme.cross_color,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    padding: "4px",
                                                    borderRadius: "50%",
                                                    "&:hover": {
                                                        backgroundColor: theme.cross_color_hover,
                                                        cursor: "pointer"
                                                    }
                                                }}
                                            >
                                                <CloseIcon fontSize="small" />
                                            </Box>
                                        )}
                                    </Box>
                                }
                                sx={{
                                    borderRight: "0.5px solid " + theme.tabs_notselected_color,
                                    "&.Mui-selected": {
                                        color: theme.text, // Set selected tab text color
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
                        borderBottom: " 1px solid " + theme.tabs_notselected_color,
                        borderLeft: " 0.5px solid " + theme.tabs_notselected_color,
                        "&:hover": { color: "#ffffff" },
                    }}
                >
                    <IconButton onClick={handleAddTab} sx={{ color: theme.tabs_notselected_color }}>
                        <AddIcon />
                    </IconButton>
                </Box>
                <Box
                    sx={{
                        flexGrow: 1,
                        borderBottom: "1px solid " + theme.tabs_notselected_color,
                        mt: 5.9
                    }}
                />
            </Box>
            <Dialog open={openModal} onClose={handleModalClose} maxWidth="md" fullWidth sx={{ mb: 40, ml: { sm: 2, md: 10 } }}
                PaperProps={{
                    sx: { boxShadow: 'none', backgroundColor: 'transparent' }
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", backgroundColor: theme.tabs_bg, padding: "8px 16px", borderRadius: "20px", border: "2px solid #BCB6B6" }}>
                    <SearchIcon sx={{ color: theme.dialog_search_icon, mr: 1 }} />
                    <TextField
                        autoFocus
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
                        sx={{
                            ml: 2,
                        }}
                    />
                    <KeyboardReturnIcon onClick={handleAddTabSubmit} sx={{ color: "whitesmoke" }} />
                </Box>
            </Dialog>
        </Box>
    );
}

export default MainTabs;