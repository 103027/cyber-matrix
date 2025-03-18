import React, { useRef, useEffect } from "react";
import { Box, Typography, Grid, } from "@mui/material";
import { useParams } from "react-router-dom";
import Loading from "../Components/Loading.jsx";
import Logo from "../Images/logo3.png";
import { useNotification } from "../contexts/NotificationContext.jsx";
import { useDispatch, useSelector } from "react-redux";
import { fetchTargetInfo } from "../features/targetInfoSlice";

function TargetInfo() {
    const { data, loading, error } = useSelector((state) => state.targetInfo);
    const { domain } = useParams();
    const { showNotification } = useNotification();
    const dispatch = useDispatch();
    
    const targetInfos = data;
    const isLoading = loading[domain];
    const isError = error[domain];

    useEffect(() => {

        if (!data[domain] && !isLoading) {
            console.log("Hello from target Info")
            dispatch(fetchTargetInfo(domain))
        }

    }, [domain]);

    useEffect(() => {
        if (isError) {
            showNotification("Invalid Domain Name: " + isError);
        }
    }, [isError, showNotification]);


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
                        isLoading ? (
                            <Loading logo={Logo} size={80} animation="zoom" />
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
                                                        href={targetInfos[domain]?.["Url"]}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        sx={{ textDecoration: 'underline', color: '#fff' }}
                                                    >
                                                        {targetInfos[domain]?.["Url"] || "--"}
                                                    </Typography>
                                                </Box>
                                                <Box display="flex" justifyContent="space-between" mb={1}>
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                        Location
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        component="a"
                                                        href={targetInfos[domain]?.["Location"]}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        sx={{ textDecoration: 'underline', color: '#fff' }}
                                                    >
                                                        {targetInfos[domain]?.["Location"] || "--"}
                                                    </Typography>
                                                </Box>
                                                <Box display="flex" justifyContent="space-between" mb={1}>
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                        Title
                                                    </Typography>
                                                    <Typography variant="body2">{targetInfos[domain]?.["Title"] || "--"}</Typography>
                                                </Box>
                                                <Box display="flex" justifyContent="space-between" mb={1}>
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                        Web Server
                                                    </Typography>
                                                    <Typography variant="body2">{targetInfos[domain]?.["Web Server"] || "--"}</Typography>
                                                </Box>
                                                <Box display="flex" justifyContent="space-between" mb={1}>
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                        IP
                                                    </Typography>
                                                    <Typography variant="body2">{targetInfos[domain]?.["IP"]?.[0] || "--"}</Typography>
                                                </Box>
                                                <Box display="flex" justifyContent="space-between" mb={1}>
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                        Content Length
                                                    </Typography>
                                                    <Typography variant="body2">{targetInfos[domain]?.["Content Length"]?.split(":")[1]?.trim() || "--"}</Typography>
                                                </Box>
                                                <Box display="flex" justifyContent="space-between">
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                        Status Code
                                                    </Typography>
                                                    <Typography variant="body2">{targetInfos[domain]?.["Status_Code"] || "--"}</Typography>
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
                                                            <Box key={`dns-${index}`} display="flex" justifyContent="space-between" mb={1}>
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
                                                <Box
                                                    sx={{
                                                        maxHeight: "200px",
                                                        overflowY: "auto",
                                                    }}
                                                >
                                                    {
                                                        targetInfos[domain]?.["Robot"]?.map((dnsEntry, index) => {
                                                            return (
                                                                <Box key={`robot-${index}`} display="flex" justifyContent="space-between" mb={1}>
                                                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                                        {index + 1}
                                                                    </Typography>
                                                                    <Typography variant="body2" sx={{ mr: 1 }}>{dnsEntry}</Typography>
                                                                </Box>
                                                            )
                                                        }
                                                        )
                                                    }
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
                                                            <Box key={`ip-${index}`} display="flex" justifyContent="space-between" mb={1}>
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
                                                    <Typography variant="body2">{targetInfos[domain]?.["Organization Name"] || "--"}</Typography>
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
                                                    <Typography variant="body2">{targetInfos[domain]?.["Issuer Organization"] || "--"}</Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Box>

                        )
                    }
                </Box>
                {/* <Footer /> */}
            </Box>
        </Box >
    );
}

export default TargetInfo;
