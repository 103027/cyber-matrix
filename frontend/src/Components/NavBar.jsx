import React from "react";
import { Box, AppBar, Toolbar, Container, Button, Drawer, IconButton, List, ListItem, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-scroll";
import { useTheme } from "../contexts/theme/ThemeContext.jsx";

function NavBar({ navigate, scrollToSection, toggleDrawer, drawerOpen }) {
    const { theme } = useTheme();

    const listItemStyle = {
        justifyContent: "center",
        width: "100%",
        "&:hover": {
            color: "black",
            backgroundColor: theme.text_3,
        },
        cursor: "pointer"
    };

    const textStyle = {
        color: theme.drawer_lists_text_color,
        textAlign: "center",
        fontWeight: "bold",
    };

    const navButtonStyle = {
        my: 2,
        ml: 4,
        color: theme.secondary_text,
        display: "block",
        textTransform: "none",
        border: "2px solid " + theme.right_grid_bg,
        borderRadius: "30px",
        "&:hover": {
            border: "2px solid " + theme.border_navbar_buttons,
        },
    };

    const animatedButtonStyle = {
        my: 2,
        color: theme.text,
        textTransform: "none",
        border: "2px solid " + theme.bg_behind_boxes_2_border,
        borderRadius: "30px",
        ml: 4,
        pr: 4,
        pl: 4,
        position: "relative",
        overflow: "hidden",
        backgroundColor: theme.get_started_button_hover,
        transition: "color 500ms ease-in-out",
        zIndex: 1,
    
        "&::before": {
            content: '""',
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "200%",
            height: "200%",
            backgroundColor: theme.input_bg,
            borderRadius: "50%",
            transition: "transform 500ms ease-in-out",
            transform: "translate(-50%, -50%) scale(1.5)",
            zIndex: -1,
        },
    
        "&:hover::before, &:focus::before": {
            transform: "translate(-50%, -50%) scale(0)",
        },
    
        "&:hover, &:focus": {
            color: theme.input_bg,
        },
    };

    return (
        <Box>
            <AppBar position="static" sx={{ backgroundColor: theme.right_grid_bg }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ padding: { xs: "40px 20px", md: "40px 100px" } }}>
                        <img
                            src={require(theme.background === "#333333" ? "../Images/logo.png" : theme.background === "#000000" ? "../Images/logo_hacker.png" : "../Images/logo2_light.png")}
                            alt="Cyber-Matrix Logo"
                            style={{ width: "50px", marginBottom: "10px" }}
                        />

                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            <Button onClick={() => navigate("/docs")} sx={navButtonStyle}>Docs</Button>
                            <Link to="features" smooth={true} duration={500}>
                                <Button sx={navButtonStyle}>Features</Button>
                            </Link>
                            <Link to="contact" smooth={true} duration={500}>
                                <Button sx={navButtonStyle}>Contact</Button>
                            </Link>
                        </Box>

                        <Box sx={{ display: { xs: 'flex', md: 'none' }, ml: "auto" }}>
                            <IconButton onClick={toggleDrawer(true)} sx={{ color: theme.secondary_text }}>
                                <MenuIcon />
                            </IconButton>
                        </Box>

                        <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: "auto" }}>
                            <Button onClick={() => navigate("/login")} sx={navButtonStyle}>Login</Button>
                            <Button onClick={() => navigate("/signup")} sx={animatedButtonStyle}>
                                Get started
                            </Button>
                        </Box>

                    </Toolbar>
                </Container>
            </AppBar>

            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
            >
                <Box
                    sx={{ width: 250, backgroundColor: theme.landingPage_drawer_bg, height: "100vh", paddingTop: "20px" }}
                    role="presentation"
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                >
                    <List
                        sx={{
                            height: "90vh", // Full viewport height
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            alignItems: "center", // Center items horizontally
                            overflow: "hidden", // Prevent scrolling
                            paddingY: 2, // Add padding to prevent cutoff
                        }}
                    >
                        {/* Top Navigation Links */}
                        <Box sx={{ width: "100%" }}>
                            <ListItem button onClick={() => navigate("/docs")} sx={listItemStyle}>
                                <ListItemText primary="Docs" sx={textStyle} />
                            </ListItem>
                            <ListItem button onClick={() => scrollToSection("features")} sx={listItemStyle}>
                                <ListItemText primary="Features" sx={textStyle} />
                            </ListItem>
                            <ListItem button onClick={() => scrollToSection("contact")} sx={listItemStyle}>
                                <ListItemText primary="Contact" sx={textStyle} />
                            </ListItem>
                        </Box>

                        {/* Bottom Authentication Links */}
                        <Box sx={{ width: "100%" }}>
                            <ListItem button onClick={() => navigate("/login")} sx={listItemStyle}>
                                <ListItemText primary="Login" sx={textStyle} />
                            </ListItem>
                            <ListItem button onClick={() => navigate("/signup")} sx={listItemStyle}>
                                <ListItemText primary="Get started" sx={textStyle} />
                            </ListItem>
                            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                                <img
                                    src={require("../Images/logo.png")}
                                    alt="Cyber-Matrix Logo"
                                    style={{ width: "50px", marginBottom: "10px" }}
                                />
                            </Box>
                        </Box>
                    </List>
                </Box>
            </Drawer>
        </Box>
    );
}

export default NavBar;