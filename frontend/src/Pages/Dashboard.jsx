import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, useMediaQuery } from "@mui/material";
import LayersIcon from "@mui/icons-material/Layers";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import Footer from "../Components/footer";
import { useTheme } from "../contexts/theme/ThemeContext.jsx";
import api from "../api/axios_token.jsx";
import { useScan } from "../contexts/ScanContext.jsx";

function Dashboard() {
    const isSmallScreen = useMediaQuery("(max-width:600px)");
    const { theme } = useTheme();
    const [totalScan, setTotalScan] = useState(0);
    const [vulnerabilitiesCount, setVulnerabilitiesCount] = useState(0);
    const [assetCount, setAssetCount] = useState(0);
    const [exposePortsCount, setExposePortsCount] = useState(0);
    const [passwordHashCount, setPasswordHashCount] = useState(0);
    const [subdomainCount, setSubdomainCount] = useState(0);
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const xAxisData = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const [weeklyCounts, setWeeklyCounts] = useState({
        Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0
    });
    const {
        runningScans,
        completedScans
    } = useScan();

    useEffect(() => {
        const getDashboardData = async () => {
            try {
                const response = await api.get("/get_dashboard_data")
                console.log("Response:", response.data.scan_info[0]);
                setTotalScan(response.data.scan_info[0].total_count)
                setVulnerabilitiesCount(response.data.scan_info[0].Vulnerabilities_count)
                setAssetCount(response.data.scan_info[0].asset_count)
                setExposePortsCount(response.data.scan_info[0].expose_port)
                setPasswordHashCount(response.data.scan_info[0].passwordhash_count)
                setSubdomainCount(response.data.scan_info[0].subdomain_count)
                const counts = {
                    Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0
                };

                response.data.scan_info[0].date.forEach(dateStr => {
                    const dateObj = new Date(dateStr);
                    const dayName = daysOfWeek[dateObj.getDay()];
                    counts[dayName] += 1;
                });

                setWeeklyCounts(counts);
            } catch (error) {
                console.error("Error cracking hash:", error);
            }
        }
        getDashboardData()
    }, [])

    const seriesData = xAxisData.map(day => weeklyCounts[day] || 0);

    return (
        <Box sx={{ color: theme.text }}>
            <Box
                sx={{ display: "flex", flexDirection: "column", p: 2, borderRadius: "20px", backgroundColor: theme.bg_behind_boxes }}
            >
                <Box>
                    <Typography
                        sx={{
                            fontWeight: 'bold',
                            fontSize: '2.5rem',
                            fontFamily: 'Poppins, sans-serif',
                        }}
                    >
                        Dashboard Summary
                    </Typography>
                </Box>
                <Box sx={{ mt: 4 }}>
                    <Box>
                        <Typography
                            sx={{
                                fontWeight: 'bold',
                                fontSize: '1.5rem',
                                fontFamily: 'Poppins, sans-serif',
                            }}
                        >
                            Today
                        </Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1, mt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={12} lg={7}>
                                <Box
                                    sx={{
                                        backgroundColor: theme.box_bg,
                                        color: theme.secondary_text,
                                        border: "1px solid " + theme.box_bg_border,
                                        borderRadius: "8px",
                                        padding: "20px",
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <Typography variant="h4" sx={{ marginTop: 1, fontWeight: "bold" }}>
                                            Total Scans
                                        </Typography>
                                        <LayersIcon sx={{ fontSize: 100, color: "#C49150" }} />
                                    </Box>
                                    <Typography variant="h1" sx={{ fontWeight: "bold" }}>
                                        {totalScan}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={5}>
                                <Box
                                    sx={{
                                        backgroundColor: theme.box_bg,
                                        color: theme.secondary_text,
                                        border: "1px solid " + theme.box_bg_border,
                                        borderRadius: "8px",
                                        padding: "20px",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <SignalCellularAltIcon sx={{ fontSize: 50, color: "#26C6DA" }} />
                                        <Typography variant="h5" sx={{ marginTop: 1, ml: 2, fontWeight: "bold" }}>
                                            Assets Discovered
                                        </Typography>
                                    </Box>
                                    <Typography variant="h2" sx={{ fontWeight: "bold", mt: 3.5 }}>
                                        {assetCount}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={3.5}>
                                <Box
                                    sx={{
                                        backgroundColor: theme.box_bg,
                                        color: theme.secondary_text,
                                        border: "1px solid " + theme.box_bg_border,
                                        borderRadius: "8px",
                                        padding: "20px",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <AccessTimeIcon sx={{ fontSize: 50, color: "#5C6BC0" }} />
                                        <Typography variant="h5" sx={{ marginTop: 1, ml: 2, fontWeight: "bold" }}>
                                            Running Scans
                                        </Typography>
                                    </Box>
                                    <Typography variant="h3" sx={{ fontWeight: "bold", mt: 3.5 }}>
                                        {runningScans}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={3.5}>
                                <Box
                                    sx={{
                                        backgroundColor: theme.box_bg,
                                        color: theme.secondary_text,
                                        border: "1px solid " + theme.box_bg_border,
                                        borderRadius: "8px",
                                        padding: "20px",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <CheckCircleIcon sx={{ fontSize: 50, color: "#4CAF50" }} />
                                        <Typography variant="h5" sx={{ marginTop: 1, ml: 2, fontWeight: "bold" }}>
                                            Scans Completed
                                        </Typography>
                                    </Box>
                                    <Typography variant="h3" sx={{ fontWeight: "bold", mt: 3.5 }}>
                                        {completedScans}
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={12} md={12} lg={5}>
                                <Box
                                    sx={{
                                        backgroundColor: theme.box_bg,
                                        color: theme.secondary_text,
                                        border: "1px solid " + theme.box_bg_border,
                                        borderRadius: "8px",
                                        padding: "20px",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <ReportProblemIcon sx={{ fontSize: 50, color: "#E53935" }} />
                                        <Typography variant="h5" sx={{ marginTop: 1, ml: 2, fontWeight: "bold" }}>
                                            Discovered Vulnerabilities
                                        </Typography>
                                    </Box>
                                    <Typography variant="h3" sx={{ fontWeight: "bold", mt: 3.5 }}>
                                        {vulnerabilitiesCount}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Box sx={{ mt: 4 }}>
                    <Box>
                        <Typography
                            sx={{
                                fontWeight: 'bold',
                                fontSize: '1.5rem',
                                fontFamily: 'Poppins, sans-serif',
                            }}
                        >
                            This Week
                        </Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1, mt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={12} lg={5.5}>
                                <Box
                                    sx={{
                                        backgroundColor: theme.box_bg,
                                        color: theme.secondary_text,
                                        border: "1px solid " + theme.box_bg_border,
                                        borderRadius: "8px",
                                        padding: "20px",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                    }}
                                >
                                    <LineChart
                                        xAxis={[
                                            {
                                                scaleType: 'point',
                                                data: xAxisData,
                                            },
                                        ]}
                                        series={[
                                            {
                                                data: seriesData,
                                                color: "#C49150",
                                                label: "Weekly Data",
                                            },
                                        ]}
                                        sx={{
                                            width: "100%",
                                            "& .MuiChartsAxis-tickLabel": {
                                                fill: theme.secondary_text + "!important",
                                                fontSize: 12,
                                                fontFamily: "'Poppins', sans-serif",
                                            },
                                            // Style the y-axis labels
                                            "& .MuiChartsAxis-tick": {
                                                fill: theme.secondary_text + "!important",
                                            },
                                            // Style the legend text
                                            "& .MuiChartsLegend-label": {
                                                fill: theme.secondary_text + "!important",
                                                fontSize: 14,
                                                fontFamily: "'Poppins', sans-serif",
                                            },
                                            // Style grid lines (optional)
                                            "& .MuiChartsAxis-line, & .MuiChartsAxis-tickLine": {
                                                stroke: theme.secondary_text + "!important",
                                            },
                                            "& .MuiChartsGrid-line": {
                                                stroke: theme.secondary_text + "!important",
                                            },
                                            "& text": {
                                                fill: theme.secondary_text + "!important",
                                            },
                                        }}
                                        height={300}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={6.5}>
                                <Box
                                    sx={{
                                        backgroundColor: theme.box_bg,
                                        color: theme.secondary_text,
                                        border: "1px solid " + theme.box_bg_border,
                                        borderRadius: "8px",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                        width: "100%",
                                        height: "340px",
                                    }}
                                >
                                    <PieChart
                                        series={[
                                            {
                                                data: [
                                                    { id: 0, value: subdomainCount, label: 'Subdomain', },
                                                    { id: 1, value: assetCount, label: 'Assets' },
                                                    { id: 2, value: passwordHashCount, label: 'Password/Hash', color: "#C49150" },
                                                    { id: 3, value: exposePortsCount, label: 'Exposed Ports', color: "#0D2535" },
                                                ],
                                                innerRadius: 80,
                                            },
                                        ]}
                                        sx={{
                                            ml: { xs: 10, sm: 0 },
                                            "& .MuiChartsLegend-root": {
                                                display: { xs: "none", sm: "flex" },
                                                color: theme.secondary_text + "!important",
                                            },
                                            "& .MuiChartsLegend-label": {
                                                fill: theme.secondary_text + "!important",
                                                color: theme.secondary_text + "!important",
                                                fontSize: 14,
                                                fontFamily: "'Poppins', sans-serif",
                                            },
                                            // Target potential parent elements
                                            "& .MuiChartsLegend-series text": {
                                                fill: theme.secondary_text + "!important",
                                                color: theme.secondary_text + "!important",
                                            },
                                            // Target SVG text elements directly
                                            "& text": {
                                                fill: theme.secondary_text + "!important",
                                            }
                                        }}
                                        height={isSmallScreen ? 380 : 300}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Footer />
            </Box>
        </Box >
    );
}

export default Dashboard;
