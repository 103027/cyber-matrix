import React, { useEffect } from "react";
import { Box, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TextField, Button, Typography } from '@mui/material';
import { InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { fetchSipCalc } from "../features/sipcalcSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../Components/Loading.jsx";
import Logo from "../Images/logo3.png";
import { useParams, useNavigate } from "react-router-dom";
import { useNotification } from "../contexts/NotificationContext.jsx";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const adjustIP = (ip, offset) => {
    if (!ip) return "";
    const parts = ip.split(".").map(Number);
    parts[3] += offset;

    if (parts[3] < 0) {
        parts[3] = 255;
        parts[2] -= 1;
    } else if (parts[3] > 255) {
        parts[3] = 0;
        parts[2] += 1;
    }

    return parts.join(".");
};

function SipCalc() {
    const { domain } = useParams();
    const { showNotification } = useNotification();
    const { data, loading, error } = useSelector(state => state.sipcalc)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = React.useState("");

    const sipCalc_Data = [
        { "Host Address": data[domain]?.["Host Address"] },
        { "Host Address(Hex)": data[domain]?.["Host Address(Hex)"] },
        { "Host Address(decimal)": data[domain]?.["Host Address(decimal)"] },
        { "Network Address": data[domain]?.["network-address"] },
        { "Network Mask": data[domain]?.["Network Mask"] },
        { "Network Mask(bits)": data[domain]?.["Network Mask(bits)"] },
        { "Network Mask(hex)": data[domain]?.["Network Mask(hex)"] },
        { "Broadcast Address	": data[domain]?.["Broadcast Address"] },
        { "Cisco Wildcard": data[domain]?.["Cisco Wildcard"] },
        { "Address in Network": data[domain]?.["Address in Network"] },
        { "Network Range": data[domain] && `${adjustIP(data[domain]["Host-min"], -1)} - ${adjustIP(data[domain]["Host-max"], 1)}` },
        { "Usable Range": `${data[domain]?.["Host-min"]} - ${data[domain]?.["Host-max"]}` },
    ]

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    const filteredData = sipCalc_Data.filter((item) => {
        const key = Object.keys(item)[0].toLowerCase();
        const value = String(Object.values(item)[0] || "").toLowerCase();
    
        return key.includes(searchQuery) || value.includes(searchQuery);
    });
    



    const isLoading = loading[domain];
    const isError = error[domain];


    useEffect(() => {
        if (!data[domain] && !isLoading) {
            console.log("Hello from SipCalc");
            dispatch(fetchSipCalc(domain));
        }
    }, [domain, isLoading]);

    useEffect(() => {
        if (isError) {
            showNotification("Invalid Domain Name: " + isError);
        }
    }, [isError, showNotification]);

    return (
        <Box sx={{ color: "#fff" }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton onClick={() => navigate(-1)} sx={{ color: "white" }}>
                        <ArrowBackIcon sx={{ fontSize: "2rem" }} />
                    </IconButton>
                    <Typography sx={{ fontWeight: "bold", fontSize: "2.5rem", fontFamily: "Poppins, sans-serif" }}>
                        SipCalc
                    </Typography>
                </Box>
                {
                    isLoading ? (
                        <Loading logo={Logo} size={80} animation="zoom" />
                    ) : (
                        <Paper sx={{ backgroundColor: "#333333", border: "none", color: "#ffffff", mt: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '16px', backgroundColor: "#49494C", border: "1px solid #49494C", borderRadius: "20px" }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: "center", alignItems: "center" }}>
                                    <TextField
                                        placeholder={"Search"}
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        InputProps={{
                                            sx: {
                                                backgroundColor: "#26272B",
                                                color: "#fff",
                                                borderRadius: "10px",
                                                "&.Mui-focused": { backgroundColor: "black" },
                                            },
                                            startAdornment: (<InputAdornment position="start"> <SearchIcon sx={{ color: "white" }} /> </InputAdornment>),
                                        }}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                "& fieldset": { borderColor: "#49494C" },
                                                "&:hover fieldset": { borderColor: "#49494C" },
                                                "&.Mui-focused fieldset": { borderColor: "#49494C" },
                                            },
                                        }}
                                    />
                                </Box>
                            </Box>

                            <TableContainer sx={{ mt: 5, border: "1px solid #ffffff", borderRadius: "10px" }}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableBody>
                                        {filteredData.map((row, index) => {
                                            const key = Object.keys(row)[0];
                                            const value = row[key];

                                            return (
                                                <TableRow key={index}>
                                                    <TableCell sx={{ color: "#ffffff", backgroundColor: "#444444", textAlign: "center" }}>
                                                        {key}
                                                    </TableCell>
                                                    <TableCell sx={{ color: "#ffffff", textAlign: "center" }}>
                                                        {value}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    )
                }
            </Box>
        </Box>
    )
}

export default SipCalc;