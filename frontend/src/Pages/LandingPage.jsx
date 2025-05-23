import React, { useState, useRef } from "react";
import { Box } from "@mui/material";
import Features from "../Components/Features";
import ContactUs from "../Components/Contactus";
import Footer from "../Components/footer";
import HeroSection from "../Components/HeroSection";
import NavBar from "../Components/NavBar";
import { useNavigate } from "react-router-dom";
import { scroller } from "react-scroll";
import { useTheme } from "../contexts/theme/ThemeContext.jsx";

function LandingPage() {
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const featureRefs = useRef([]);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const { theme } = useTheme();

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const scrollToSection = (section) => {
        setDrawerOpen(false);
        scroller.scrollTo(section, {
            smooth: true,
            duration: 500,
        });
    };

    return (
        <Box sx={{ color: theme.text, backgroundColor: theme.background }}>
            <NavBar navigate={navigate} scrollToSection={scrollToSection} toggleDrawer={toggleDrawer} drawerOpen={drawerOpen} />
            <HeroSection />
            <Box
                id="features"
            >
                <Features featureRefs={featureRefs} titleRef={titleRef} subtitleRef={subtitleRef}/>
            </Box>
            <Box
                id="contact"
            >
                <ContactUs />
            </Box>
            <Box sx={{paddingX: { xs: "20px", sm: "50px", md: "80px", lg: "100px" } }}>
                <Footer />
            </Box>
        </Box>
    );
}

export default LandingPage;