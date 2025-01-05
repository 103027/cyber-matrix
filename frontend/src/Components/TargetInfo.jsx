import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, CircularProgress } from "@mui/material";
import Footer from "./footer";
import api from "../api/axois.jsx";
import { useParams } from "react-router-dom";
import { useTargetInfo } from "../contexts/TargetInfoContext.jsx";
import Loading from "../Components/Loading.jsx";
import Logo from "../Images/logo3.png";

function TargetInfo() {
    const { targetInfos, setTargetInfos } = useTargetInfo();
    const { domain } = useParams();
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchTargetInfo = async () => {
            try {
                const response = await api.get(`/get_target_info?domain=${domain}`);
                console.log(response.data)
                setTargetInfos((prevInfos) => ({
                    ...prevInfos,
                    [domain]: response.data,
                }));
            } catch (err) {
                console.log(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        if (!targetInfos[domain]) {
            fetchTargetInfo();
            setLoading(true);
        } else {
            setLoading(false);
        }

    }, [domain]);

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
                    {
                        loading ? (
                            <Loading logo={Logo} size={80} animation="zoom"/>
                        ) : (
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
                                                {
                                                    targetInfos[domain]?.["DNS"]?.map((dnsEntry, index) => {
                                                        return (
                                                            <Box display="flex" justifyContent="space-between" mb={1}>
                                                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                                    {index + 1}
                                                                </Typography>
                                                                <Typography variant="body2">{dnsEntry}</Typography>
                                                            </Box>
                                                        )
                                                    }
                                                    )
                                                }
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
                                                {
                                                    targetInfos[domain]?.["IP"]?.map((ipEntry, index) => {
                                                        return (
                                                            <Box display="flex" justifyContent="space-between" mb={1}>
                                                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                                    {index + 1}
                                                                </Typography>
                                                                <Typography variant="body2">{ipEntry}</Typography>
                                                            </Box>
                                                        )
                                                    }
                                                    )
                                                }
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
                                                    <Typography variant="body2">{targetInfos[domain]?.["Subject CN"] || "--"}</Typography>
                                                </Box>
                                                <Box display="flex" justifyContent="space-between" mb={1}>
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                        Issuer
                                                    </Typography>
                                                    <Typography variant="body2">{targetInfos[domain]?.["Issuer CN"] || "--"}</Typography>
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
                                                    <Typography variant="body2">{targetInfos[domain]?.["Organization Name"]}</Typography>
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
                                                    <Typography variant="body2">{targetInfos[domain]?.["Issuer Organization"]}</Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Box>

                        )
                    }
                </Box>
                <Footer />
            </Box>
        </Box >
    );
}

export default TargetInfo;
