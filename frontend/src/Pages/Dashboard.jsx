import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import LayersIcon from "@mui/icons-material/Layers";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import Footer from "../Components/footer";

function Dashboard() {
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
                                        backgroundColor: "#49494C",
                                        color: "#FFF",
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
                                        0
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={5}>
                                <Box
                                    sx={{
                                        backgroundColor: "#49494C",
                                        color: "#FFF",
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
                                        0
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={3.5}>
                                <Box
                                    sx={{
                                        backgroundColor: "#49494C",
                                        color: "#FFF",
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
                                        0
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={3.5}>
                                <Box
                                    sx={{
                                        backgroundColor: "#49494C",
                                        color: "#FFF",
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
                                        0
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={12} md={12} lg={5}>
                                <Box
                                    sx={{
                                        backgroundColor: "#49494C",
                                        color: "#FFF",
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
                                        0
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
                                        backgroundColor: "#49494C",
                                        color: "#FFF",
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
                                                data: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                                            },
                                        ]}
                                        series={[
                                            {
                                                data: [2, 5.5, 2, 8.5, 1.5, 5, 6],
                                                color: "#C49150",
                                                label: "Weekly Data",
                                            },
                                        ]}
                                        sx={{
                                            width:"100%"
                                        }}
                                        height={300}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={6.5}>
                                <Box
                                    sx={{
                                        backgroundColor: "#49494C",
                                        color: "#FFF",
                                        borderRadius: "8px",
                                        padding: "20px",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                                    }}
                                >
                                    <PieChart
                                        series={[
                                            {
                                                data: [
                                                    { id: 0, value: 10, label: 'Subdomain', },
                                                    { id: 1, value: 15, label: 'Assets' },
                                                    { id: 2, value: 20, label: 'Password/Hash',color: "#C49150" },
                                                    { id: 3, value: 30, label: 'Exposed Ports',color: "#0D2535" },
                                                ],
                                                innerRadius: 80,
                                            },
                                        ]}
                                        sx={{
                                            width:"100%",
                                            "& .MuiChartsLegend-root": {
                                                display: {xs:"none",sm:"flex"},
                                            },
                                        }}
                                        height={300}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Footer/>
            </Box>
        </Box >
    );
}

export default Dashboard;
