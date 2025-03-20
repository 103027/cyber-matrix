import React, { useEffect } from "react";
import { Box, Typography, Avatar, Grid } from "@mui/material";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import SearchIcon from "@mui/icons-material/Search";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import LanguageIcon from "@mui/icons-material/Language";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useTheme } from "../contexts/theme/ThemeContext.jsx";

function Features({featureRefs,titleRef,subtitleRef}) {
    const { theme } = useTheme();
    const icons = [
        FormatListBulletedIcon,
        AttachFileIcon,
        FingerprintIcon,
        LanguageIcon,
        LockOpenIcon,
        SearchIcon,
    ];
    const featureNames = [
        "Sub Domain Enumeration",
        "Network Scanning",
        "Asset Enumeration",
        "Pentesting Tools",
        "Password and Hash Cracking",
        "CVE Reporting",
    ];
    const featureDescriptions = [
        'Subdomain Enumeration identifies and maps all subdomains linked to a target domain, uncovering hidden assets and potential vulnerabilities.It ensures better visibility and management of organizational web assets.',
        'Network Scanning identifies active devices, open ports, and services within a network to assess potential vulnerabilities. It helps in understanding the network structure and detecting security risks. This feature strengthens overall network security',
        'Asset Enumeration involves identifying and cataloging all digital assets within an organization`s infrastructure. It provides visibility into web servers, databases, APIs, and other resources. This process helps in managing assets effectively.',
        'Penetration testing tools like Nikto and Sipcalc help identify vulnerabilities and assess security risks. Nikto performs web server scans to detect outdated software, misconfigurations, and potential security issues, while Sipcalc aids in advanced subnet calculations for network analysis.',
        'Tools like Hydra and John the Ripper enable security testing by identifying weak passwords. Hydra excels in performing brute force and dictionary attacks on various protocols, while John the Ripper specializes in recovering passwords from hashed formats.',
        'CVE Reporting identifies and tracks known vulnerabilities in software by referencing the Common Vulnerabilities and Exposures (CVE) database. This feature provides detailed information on security flaws, enabling organizations to prioritize and address risks effectively.',
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("fade-in");
                    } else {
                        entry.target.classList.remove("fade-in");
                    }
                });
            },
            { threshold: 0.3 }
        );

        featureRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        if (titleRef.current) observer.observe(titleRef.current);
        if (subtitleRef.current) observer.observe(subtitleRef.current);

        return () => {
            featureRefs.current.forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
            if (titleRef.current) observer.unobserve(titleRef.current);
            if (subtitleRef.current) observer.unobserve(subtitleRef.current);
        };
    }, []);

    return (
        <Box sx={{ color: theme.text, marginTop: "80px", marginX: { xs: "20px", md: "100px" } }}>
            <style>
                {`
                    /* Default state before animation */
                    .fade-in-element {
                        opacity: 0;
                        transform: translateY(50px);
                        transition: opacity 0.8s ease-out, transform 0.8s ease-out;
                    }

                    /* Scroll Animation (Appears when scrolling in) */
                    .fade-in {
                        opacity: 1 !important;
                        transform: translateY(0) !important;
                    }

                    /* Hover Animation */
                    .feature-box:hover {
                        transform: scale(1.05);
                        box-shadow: 0px 8px 20px rgba(255, 255, 255, 0.2);
                    }
                `}
            </style>
            <Box
                height={"10vh"}
            >
            </Box>
            <Typography
                ref={titleRef}
                variant="h1"
                gutterBottom
                className="fade-in-element"
                sx={{
                    fontWeight: "bold",
                    fontSize: "2.0rem",
                    fontFamily: "Poppins, sans-serif",
                    textAlign: "center",
                }}
            >
                Features
            </Typography>
            <Typography
                ref={subtitleRef}
                variant="subtitle1"
                gutterBottom
                className="fade-in-element"
                sx={{
                    fontSize: "1.0rem",
                    fontWeight: 500,
                    color: theme.desc_text,
                    marginTop: "1rem",
                    maxWidth: "600px",
                    margin: "0 auto",
                    textAlign: "center",
                }}
            >
                <span
                    style={{
                        fontFamily: "Courier New, monospace",
                        fontSize: "1rem",
                        fontWeight: "bold",
                    }}
                >
                    Cyber-Matrix
                </span>{" "}
                combines all tools & lets you analyse the results using various awesome filters. Optimised, our computation engine gives you faster & accurate results which can be used for further analysis.
            </Typography>

            <Grid container spacing={5} sx={{ marginTop: "2rem", justifyContent: "center" }}>
                {icons.map((Icon, index) => (
                    <Grid item key={index} xs={12} sm={6} md={6} lg={4}>
                        <Box
                            ref={(el) => (featureRefs.current[index] = el)}
                            className="feature-box fade-in-element"
                            sx={{
                                backgroundColor: theme.box_bg_2,
                                color: theme.drawer_lists_text_color,
                                border: "1px solid " + theme.box_bg_2_border,
                                borderRadius: "12px",
                                padding: "1.5rem",
                                textAlign: "center",
                                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                                height: "90%",
                                transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                            }}
                        >
                            <Avatar
                                sx={{
                                    backgroundColor: theme.drawer_lists_text_color,
                                    margin: "0 auto",
                                    width: 56,
                                    height: 56,
                                    marginBottom: "1rem",
                                }}
                            >
                                <Icon fontSize="large" sx={{color:theme.input_bg}}/>
                            </Avatar>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: "bold",
                                    marginBottom: "1rem",
                                }}
                            >
                                {featureNames[index]}
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: "1rem",
                                    lineHeight: 1.6,
                                }}
                            >
                                {featureDescriptions[index]}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default Features;
