import React, { useState } from "react";
import { 
  Box, 
  Divider, 
  Typography, 
  Select, 
  MenuItem, 
  FormControl,
  useMediaQuery
} from "@mui/material";
import { useTheme } from "../contexts/theme/ThemeContext.jsx";
import LightModeIcon from "@mui/icons-material/LightMode";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import CodeIcon from "@mui/icons-material/Code";

function Settings() {
    const { theme, toggleTheme } = useTheme();
    const [selectedTheme, setSelectedTheme] = useState(theme.background === "#333333" ? "dark" : theme.background === "#000000" ? "hacker" : "light");
    const isMobile = useMediaQuery('(max-width:600px)');

    const handleThemeChange = (event) => {
        const newTheme = event.target.value;
        setSelectedTheme(newTheme);
        toggleTheme(newTheme);
    };

    return (
        <Box sx={{ 
            color: theme.text,
            p: 3,
            borderRadius: "16px", 
            backgroundColor: theme.bg_behind_boxes_2,
            border: "1px solid " + theme.bg_behind_boxes_2_border
        }}>
            {/* Header section */}
            <Box sx={{ mb: 3 }}>
                <Typography 
                    sx={{ 
                        fontWeight: '700', 
                        fontSize: '2.5rem', 
                        fontFamily: 'Poppins, sans-serif',
                        letterSpacing: '-0.5px'
                    }}
                >
                    Settings
                </Typography>
            </Box>

            <Divider sx={{ 
                width: "50%", 
                borderBottomWidth: "2px", 
                borderColor: theme.text,
                mb: 4
            }} />

            {/* Theme selector section */}
            <Box sx={{ 
                display: "flex", 
                flexDirection: isMobile ? "column" : "row", 
                alignItems: isMobile ? "flex-start" : "center",
                gap: isMobile ? 2 : 0,
            }}>
                <Typography sx={{ 
                    color: theme.text, 
                    fontWeight: '600', 
                    fontSize: '1.1rem', 
                    fontFamily: 'Poppins, sans-serif',
                    width: isMobile ? "100%" : "auto",
                    mr: isMobile ? 0 : 3
                }}>
                    Select your theme:
                </Typography>
                
                <FormControl sx={{ 
                    width: isMobile ? "100%" : "300px"
                }}>
                    <Select
                        value={selectedTheme}
                        onChange={handleThemeChange}
                        sx={{
                            backgroundColor: theme.filter_input_bg,
                            color: theme.text,
                            borderRadius: "12px",
                            fontSize: "1rem",
                            height: "56px",
                            padding: "10px",
                            fontFamily: "'Poppins', sans-serif",
                            fontWeight: "600",
                            letterSpacing: "0.5px",
                            display: "flex",
                            alignItems: "center",
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "rgba(128, 128, 128, 0.2)"
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "rgba(128, 128, 128, 0.5)"
                            }
                        }}
                        MenuProps={{
                            PaperProps: {
                                sx: {
                                    backgroundColor: theme.bg_behind_boxes_2,
                                    color: theme.text,
                                    borderRadius: "12px"
                                }
                            }
                        }}
                        displayEmpty
                        renderValue={(selected) => (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                {selected === "light" && 
                                    <LightModeIcon sx={{ color: "#FFB800" }} />}
                                {selected === "dark" && 
                                    <NightsStayIcon sx={{ color: "#9E9E9E" }} />}
                                {selected === "hacker" && 
                                    <CodeIcon sx={{ color: "#00C853" }} />}
                                <Typography sx={{ 
                                    fontFamily: "'Poppins', sans-serif", 
                                    fontWeight: "600" 
                                }}>
                                    {selected === "light" ? "Light Mode" :
                                     selected === "dark" ? "Dark Mode" : 
                                     "Hacker Mode"}
                                </Typography>
                            </Box>
                        )}
                    >
                        <MenuItem value="light" sx={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: 1.5,
                            py: 1.5
                        }}>
                            <LightModeIcon sx={{ color: "#FFB800" }} /> 
                            <Typography sx={{ fontFamily: "'Poppins', sans-serif" }}>
                                Light Mode
                            </Typography>
                        </MenuItem>
                        
                        <MenuItem value="dark" sx={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: 1.5,
                            py: 1.5
                        }}>
                            <NightsStayIcon sx={{ color: "#9E9E9E" }} /> 
                            <Typography sx={{ fontFamily: "'Poppins', sans-serif" }}>
                                Dark Mode
                            </Typography>
                        </MenuItem>
                        
                        <MenuItem value="hacker" sx={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: 1.5,
                            py: 1.5
                        }}>
                            <CodeIcon sx={{ color: "#00C853" }} /> 
                            <Typography sx={{ fontFamily: "'Poppins', sans-serif" }}>
                                Hacker Mode
                            </Typography>
                        </MenuItem>
                    </Select>
                </FormControl>
            </Box>
        </Box>
    );
}

export default Settings;