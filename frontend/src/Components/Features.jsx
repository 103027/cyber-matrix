import React, { useState } from "react";
import { Box, Typography, Avatar, Grid } from '@mui/material';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import SearchIcon from '@mui/icons-material/Search';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import LanguageIcon from '@mui/icons-material/Language';
import LockOpenIcon from '@mui/icons-material/LockOpen';

function Features() {
    const [icons] = useState([FormatListBulletedIcon, AttachFileIcon, FingerprintIcon, LanguageIcon, LockOpenIcon, SearchIcon]);
    const [featureNames] = useState([
        'Sub Domain Enumeration',
        'Network Scanning',
        'Asset Enumeration',
        'Pentesting Tools',
        'Password and Hash Cracking',
        'CVE Reporting',
    ]);
    const [featureDescriptions] = useState([
        'Subdomain Enumeration identifies and maps all subdomains linked to a target domain, uncovering hidden assets and potential vulnerabilities.It ensures better visibility and management of organizational web assets.',
        'Network Scanning identifies active devices, open ports, and services within a network to assess potential vulnerabilities. It helps in understanding the network structure and detecting security risks. This feature strengthens overall network security',
        'Asset Enumeration involves identifying and cataloging all digital assets within an organization`s infrastructure. It provides visibility into web servers, databases, APIs, and other resources. This process helps in managing assets effectively.',
        'Penetration testing tools like Nikto and Sipcalc help identify vulnerabilities and assess security risks. Nikto performs web server scans to detect outdated software, misconfigurations, and potential security issues, while Sipcalc aids in advanced subnet calculations for network analysis.',
        'Tools like Hydra and John the Ripper enable security testing by identifying weak passwords. Hydra excels in performing brute force and dictionary attacks on various protocols, while John the Ripper specializes in recovering passwords from hashed formats.',
        'CVE Reporting identifies and tracks known vulnerabilities in software by referencing the Common Vulnerabilities and Exposures (CVE) database. This feature provides detailed information on security flaws, enabling organizations to prioritize and address risks effectively.',
    ]);
    return (
        <Box sx={{ color: "#fff", marginTop: "100px" }}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Box>
                    <Typography
                        variant="h1"
                        gutterBottom
                        sx={{
                            fontWeight: 'bold',
                            fontSize: '2.0rem',
                            fontFamily: 'Poppins, sans-serif',
                            textAlign: "center"
                        }}
                    >
                        Features
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        gutterBottom
                        sx={{
                            fontSize: '1.0rem',
                            fontWeight: 500,
                            color: "#EFEFEF",
                            marginTop: '1rem',
                            maxWidth: '600px',
                            margin: "0 auto",
                            textAlign: 'center',
                        }}
                    >
                        <span
                            style={{
                                fontFamily: 'Courier New, monospace',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                            }}
                        >
                            Cyber-Matrix
                        </span>
                        {' '}combines all tools & lets you analyse the results using various awesome filters. Optimised, our computation engine gives you faster & accurate results which can be used for further analysis.
                    </Typography>
                </Box>
                <Grid
                    container
                    spacing={8}
                    sx={{
                        marginTop: '2rem',
                        justifyContent: 'center',
                    }}
                >
                    {icons.map((Icon, index) => (
                        <Grid item key={index} xs={12} sm={6} md={4}>
                            <Box
                                sx={{
                                    backgroundColor: '#26272B', // Dark background color
                                    color: '#fff', // Text color
                                    borderRadius: '12px', // Rounded corners
                                    padding: '1.5rem', // Padding inside the box
                                    textAlign: 'center', // Center-align the text
                                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)', // Add a shadow for effect
                                    height:"90%"
                                }}
                            >
                                <Avatar
                                    sx={{
                                        backgroundColor: '#49494C', // Icon background color
                                        margin: '0 auto', // Center the avatar
                                        width: 56,
                                        height: 56,
                                        marginBottom: '1rem', // Space between icon and title
                                    }}
                                >
                                    <Icon fontSize="large" />
                                </Avatar>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 'bold', // Bold title
                                        marginBottom: '1rem', // Space between title and description
                                    }}
                                >
                                    {featureNames[index]}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontSize: '1rem', // Text size
                                        lineHeight: 1.6, // Line spacing
                                    }}
                                >
                                    {featureDescriptions[index]}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
}

export default Features;
