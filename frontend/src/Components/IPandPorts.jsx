import React, { useState, useMemo, useEffect } from "react";
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment } from '@mui/material';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TextField, Button, Typography, MenuItem, FormControl, Select, InputLabel } from '@mui/material';
import Footer from "./footer";
import api from "../api/axois.jsx";
import Logo from "../Images/logo3.png";
import Loading from "../Components/Loading.jsx";
import { useParams } from "react-router-dom";
import { useIPandPorts } from "../contexts/IPandPortsContext.jsx";
import { useNotification } from "../contexts/NotificationContext.jsx";
import { useTargetInfo } from "../contexts/TargetInfoContext.jsx"

function createData(ip, port, combined, status, server, version) {
    return { ip, port, combined, status, server, version };
}

function IPandPorts() {
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [ipFilter, setIpFilter] = useState('');
    const [portFilter, setPortFilter] = useState('');
    const { domain } = useParams();
    const { IPandPorts, addIPandPorts } = useIPandPorts()
    const [loading, setLoading] = useState(true);
    const { showNotification } = useNotification();
    const { targetInfos } = useTargetInfo();

    // Handle page change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handle rows per page change
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to the first page when changing rows per page
    };

    // Handle search query change
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(0); // Reset page to 0 when search query changes
    };

    const handleIpFilterChange = (event) => {
        setIpFilter(event.target.value);
        setPage(0); // Reset page to 0 when IP filter changes
    };

    const handlePortFilterChange = (event) => {
        setPortFilter(event.target.value);
        setPage(0); // Reset page to 0 when port filter changes
    };

    // Filter rows based on search query (memoized for optimization)
    const filteredRows = useMemo(() => {
        return rows.filter((row) => {
            const matchesSearchQuery = row.port.toLowerCase().includes(searchQuery.toLowerCase()) ||
                row.ip.toString().includes(searchQuery) ||
                row.combined.toString().includes(searchQuery) ||
                row.server.toString().includes(searchQuery) ||
                row.version.toString().includes(searchQuery);

            const matchesIpFilter = ipFilter ? row.ip.includes(ipFilter) : true;
            const matchesPortFilter = portFilter ? row.port.includes(portFilter) : true;

            return matchesSearchQuery && matchesIpFilter && matchesPortFilter;
        });
    }, [searchQuery, ipFilter, portFilter, rows]);


    // Paginate filtered rows (memoized for optimization)
    const paginatedRows = useMemo(() => {
        const startIndex = page * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return filteredRows.slice(startIndex, endIndex);
    }, [page, rowsPerPage, filteredRows]);

    useEffect(() => {
        const fetchIPandPorts = async () => {
            try {
                console.log("Hello from ip & ports")
                const response = await api.get(`/get_ip_ports?domain=${domain}`);
                const newRows = response.data?.["data"]?.map((data) => {
                    const ip = targetInfos[domain]?.["IP"]?.[0] || "--"; // Fallback if IP is undefined
                    const port = data.Port?.split('/')?.[0] || "--"; // Fallback if port is undefined
                    const combined = ip !== "--" && port !== "--" ? `${ip}:${port}` : "--";
                    const server = data.Server || "--";
                    const status = data.State || "--";
                    const version = data?.["Version Number"] || "--";

                    return createData(ip, port, combined, status, server, version);
                });

                setRows(newRows);

                addIPandPorts(domain, newRows);
            } catch (err) {
                console.error(err.message || "Something went wrong");
                showNotification("Error Occured in IP & Ports,Error is " + err.message)
            } finally {
                setLoading(false);
            }
        };

        if (!IPandPorts[domain]) {
            fetchIPandPorts();
            setLoading(true);
        } else {
            setRows(IPandPorts[domain]);
            setLoading(false);
        }

    }, [domain, IPandPorts, addIPandPorts]);

    return (
        <Box sx={{ color: "#fff" }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Box>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '2.5rem', fontFamily: 'Poppins, sans-serif' }}>
                        IP and Ports
                    </Typography>
                </Box>
                {
                    loading ? (
                        <Loading logo={Logo} size={80} animation="zoom" />
                    ) : (
                        <Paper sx={{ backgroundColor: "#333333", border: "none", color: "#ffffff", mt: 2 }}>
                            <Box sx={{ display: 'flex', flexDirection: "column", alignItems: 'center', padding: '16px', backgroundColor: "#49494C", border: "1px solid #49494C", borderRadius: "20px" }}>
                                <Box sx={{ display: 'flex', flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                                    <Typography variant="h6">
                                        Apply Filter:
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: "row" }}>
                                        <Typography variant="h6">
                                            IP:
                                        </Typography>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            value={ipFilter}
                                            onChange={handleIpFilterChange}
                                            InputProps={{
                                                sx: {
                                                    backgroundColor: "#26272B",
                                                    color: "#fff",
                                                    borderRadius: "10px",
                                                    "&.Mui-focused": { backgroundColor: "black" },
                                                    ml: 2
                                                },
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
                                    <Box sx={{ display: 'flex', flexDirection: "row" }}>
                                        <Typography variant="h6">
                                            Port:
                                        </Typography>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            value={portFilter}
                                            onChange={handlePortFilterChange}
                                            InputProps={{
                                                sx: {
                                                    backgroundColor: "#26272B",
                                                    color: "#fff",
                                                    borderRadius: "10px",
                                                    "&.Mui-focused": { backgroundColor: "black" },
                                                    ml: 2
                                                },
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
                                <Box sx={{ display: 'flex', flexDirection: "row", justifyContent: "space-between", width: "100%", mt: 2 }}>
                                    <Typography variant="h6">
                                        Exposed Ports Count - {filteredRows.length}
                                    </Typography>
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
                            </Box>

                            <TableContainer sx={{ mt: 5, border: "1px solid #ffffff", borderRadius: "10px" }}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: "#444444", fontWeight: "bold" }}>
                                            <TableCell sx={{ color: "#ffffff" }}>IP</TableCell>
                                            <TableCell sx={{ color: "#ffffff" }}>Ports</TableCell>
                                            <TableCell sx={{ color: "#ffffff" }}>Combined</TableCell>
                                            <TableCell sx={{ color: "#ffffff" }}>Status</TableCell>
                                            <TableCell sx={{ color: "#ffffff" }}>Server</TableCell>
                                            <TableCell sx={{ color: "#ffffff" }}>Version Number</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paginatedRows.map((row, index) => (
                                            <TableRow key={`${row.url}-${page}-${index}`}>
                                                <TableCell sx={{ color: "#ffffff" }} component="th" scope="row">
                                                    {row.ip}
                                                </TableCell>
                                                <TableCell sx={{ color: "#ffffff" }}>{row.port}</TableCell>
                                                <TableCell sx={{ color: "#ffffff" }}>{row.combined}</TableCell>
                                                <TableCell sx={{ color: "#ffffff" }}>{row.status}</TableCell>
                                                <TableCell sx={{ color: "#ffffff" }}>{row.server}</TableCell>
                                                <TableCell sx={{ color: "#ffffff" }}>{row.version}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <TablePagination
                                sx={{ color: "#ffffff" }}
                                rowsPerPageOptions={[10, 25, 50]}
                                component="div"
                                count={filteredRows.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>
                    )
                }
            </Box>
            <Footer />
        </Box>
    );
}

export default IPandPorts;