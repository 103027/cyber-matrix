import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import Footer from "./footer";

function TargetInfo() {
    return (
        <Box sx={{ color: "#fff" }}>
            <Box
                sx={{ display: "flex", flexDirection: "column" }}
            >
                <Box>
                    <Typography
                        sx={{
                            fontWeight: 'bold',
                            fontSize: '2.5rem',
                            fontFamily: 'Poppins, sans-serif',
                        }}
                    >
                        Target Information
                    </Typography>
                </Box>
                <Box sx={{ mt: 4 }}>
                    <Box sx={{ flexGrow: 1, mt: 2 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Grid item sx={{ mb: 2 }}>
                                    <Box
                                        sx={{
                                            backgroundColor: "#49494C",
                                            color: "#FFF",
                                            borderRadius: "8px",
                                            padding: "20px",
                                            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: 'bold', marginBottom: '16px', color: '#fff' }}
                                        >
                                            SITE INFO
                                        </Typography>
                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                URL
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                component="a"
                                                href="https://facebook.com:443"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                sx={{ textDecoration: 'underline', color: '#fff' }}
                                            >
                                                https://facebook.com:443
                                            </Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                Location
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                component="a"
                                                href="https://www.facebook.com/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                sx={{ textDecoration: 'underline', color: '#fff' }}
                                            >
                                                https://www.facebook.com/
                                            </Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                Title
                                            </Typography>
                                            <Typography variant="body2">--</Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                Web Server
                                            </Typography>
                                            <Typography variant="body2">--</Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                IP
                                            </Typography>
                                            <Typography variant="body2">31.13.80.36</Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                Content Length
                                            </Typography>
                                            <Typography variant="body2">--</Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between">
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                Status Code
                                            </Typography>
                                            <Typography variant="body2">301</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item sx={{ mb: 2 }}>
                                    <Box
                                        sx={{
                                            backgroundColor: "#49494C",
                                            color: "#FFF",
                                            borderRadius: "8px",
                                            padding: "20px",
                                            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: 'bold', marginBottom: '16px', color: '#fff' }}
                                        >
                                            DNS Names
                                        </Typography>
                                        <Box display="flex" justifyContent="space-between" mb={1} sx={{ backgroundColor: "#6E6E6D", paddingX: "10px" }}>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                #
                                            </Typography>
                                            <Typography variant="body1">IP</Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                1
                                            </Typography>
                                            <Typography variant="body2">*.facebook.com</Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                2
                                            </Typography>
                                            <Typography variant="body2">*.facebook.net</Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                3
                                            </Typography>
                                            <Typography variant="body2">*.fbcdn.net</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item sx={{ mb: 2 }}>
                                    <Box
                                        sx={{
                                            backgroundColor: "#49494C",
                                            color: "#FFF",
                                            borderRadius: "8px",
                                            padding: "20px",
                                            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: 'bold', marginBottom: '16px', color: '#fff' }}
                                        >
                                            Robots
                                        </Typography>
                                        <Box display="flex" justifyContent="space-between" mb={1} sx={{ backgroundColor: "#6E6E6D", paddingX: "10px" }}>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                #
                                            </Typography>
                                            <Typography variant="body1">URL</Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                1
                                            </Typography>
                                            <Typography variant="body2">/ajax/</Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                2
                                            </Typography>
                                            <Typography variant="body2">/album.php</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Grid item sx={{ mb: 2 }}>
                                    <Box
                                        sx={{
                                            backgroundColor: "#49494C",
                                            color: "#FFF",
                                            borderRadius: "8px",
                                            padding: "20px",
                                            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: 'bold', marginBottom: '16px', color: '#fff' }}
                                        >
                                            IPs
                                        </Typography>
                                        <Box display="flex" justifyContent="space-between" mb={1} sx={{ backgroundColor: "#6E6E6D", paddingX: "10px" }}>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                #
                                            </Typography>
                                            <Typography variant="body1">IP</Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                1
                                            </Typography>
                                            <Typography variant="body2">31.13.80.36</Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                2
                                            </Typography>
                                            <Typography variant="body2">2a03:2880:f10e:83:face:b00c:0:25de</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item sx={{ mb: 2 }}>
                                    <Box
                                        sx={{
                                            backgroundColor: "#49494C",
                                            color: "#FFF",
                                            borderRadius: "8px",
                                            padding: "20px",
                                            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: 'bold', marginBottom: '16px', color: '#fff' }}
                                        >
                                            Common Names
                                        </Typography>
                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                Subject
                                            </Typography>
                                            <Typography variant="body2">*.facebook.com</Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                Issuer
                                            </Typography>
                                            <Typography variant="body2">DigiCert SHA2 High Assurance Server CA</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item sx={{ mb: 2 }}>
                                    <Box
                                        sx={{
                                            backgroundColor: "#49494C",
                                            color: "#FFF",
                                            borderRadius: "8px",
                                            padding: "20px",
                                            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: 'bold', marginBottom: '16px', color: '#fff' }}
                                        >
                                            Organisation
                                        </Typography>
                                        <Box display="flex" justifyContent="space-between" mb={1} sx={{ backgroundColor: "#6E6E6D", paddingX: "10px" }}>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                #
                                            </Typography>
                                            <Typography variant="body1">IP</Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                1
                                            </Typography>
                                            <Typography variant="body2">Meta Platform.inc</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item sx={{ mb: 2 }}>
                                    <Box
                                        sx={{
                                            backgroundColor: "#49494C",
                                            color: "#FFF",
                                            borderRadius: "8px",
                                            padding: "20px",
                                            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: 'bold', marginBottom: '16px', color: '#fff' }}
                                        >
                                            Issuer Organisation
                                        </Typography>
                                        <Box display="flex" justifyContent="space-between" mb={1} sx={{ backgroundColor: "#6E6E6D", paddingX: "10px" }}>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                #
                                            </Typography>
                                            <Typography variant="body1">IP</Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                1
                                            </Typography>
                                            <Typography variant="body2">DigiCert.inc</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Footer />
            </Box>
        </Box >
    );
}

export default TargetInfo;
