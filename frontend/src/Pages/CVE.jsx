import React, { useState, useMemo, useEffect } from "react";
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment } from '@mui/material';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TextField, Button, Typography, MenuItem, FormControl, Select, InputLabel } from '@mui/material';
import Logo from "../Images/logo3.png";
import Loading from "../Components/Loading.jsx";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCVE } from "../features/cveSlice.js";
import { useNotification } from "../contexts/NotificationContext.jsx";

function CVE() {
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [cveIDFilter, setcveIDFilter] = useState('');
    const [severityFilter, setSeverityFilter] = useState('');
    const { domain } = useParams();
    const { showNotification } = useNotification();
    const { data, loading, error } = useSelector(state => state.cve)
    const dispatch = useDispatch();

    const isLoading = loading[domain]
    const isError = error[domain]

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

    const handlecveIDFilter = (event) => {
        setcveIDFilter(event.target.value);
        setPage(0); // Reset page to 0 when IP filter changes
    };

    const handleSeverityFilter = (event) => {
        setSeverityFilter(event.target.value);
        setPage(0); // Reset page to 0 when port filter changes
    };

    // Filter rows based on search query (memoized for optimization)
    const filteredRows = useMemo(() => {
        return rows.filter((row) => {
            const matchesSearchQuery = row?.["CVE ID"].toString().includes(searchQuery) ||
                row.Severity.toString().includes(searchQuery)

            const matchescveIDFilter = cveIDFilter ? row?.["CVE ID"].includes(cveIDFilter) : true;
            const matchesSeverityFilter = severityFilter ? row.Severity.includes(severityFilter) : true;

            return matchesSearchQuery && matchescveIDFilter && matchesSeverityFilter;
        });
    }, [searchQuery, cveIDFilter, severityFilter, rows]);


    // Paginate filtered rows (memoized for optimization)
    const paginatedRows = useMemo(() => {
        const startIndex = page * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return filteredRows.slice(startIndex, endIndex);
    }, [page, rowsPerPage, filteredRows]);

    useEffect(() => {
        if (!data[domain] && !isLoading) {
            console.log("Hello from CVE");
            dispatch(fetchCVE(domain));
        }
    }, [domain, isLoading]);

    useEffect(() => {
        if (data[domain]) {
            setRows(data[domain]?.["cveList"]);
        }
    }, [data, domain]);

    useEffect(() => {
        if (isError) {
            showNotification("Invalid Domain Name: " + isError);
        }
    }, [isError, showNotification]);

    return (
        <Box sx={{ color: "#fff" }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Box>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '2.5rem', fontFamily: 'Poppins, sans-serif' }}>
                        CVE Reporting
                    </Typography>
                </Box>
                {
                    isLoading ? (
                        <Loading logo={Logo} size={80} animation="zoom" />
                    ) : (
                        <Paper sx={{ backgroundColor: "#333333", border: "none", color: "#ffffff", mt: 2 }}>
                            <Box sx={{ display: 'flex', flexDirection: "column", alignItems: 'center', padding: '16px', backgroundColor: "#49494C", border: "1px solid #49494C", borderRadius: "20px" }}>
                                <Box sx={{ display: 'flex', flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", width: "100%" }}>
                                    <Typography variant="h6">
                                        Apply Filter:
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: "row" }}>
                                        <Box sx={{ display: 'flex', flexDirection: "row" }}>
                                            <Typography variant="h6">
                                                CVE ID:
                                            </Typography>
                                            <TextField
                                                variant="outlined"
                                                size="small"
                                                value={cveIDFilter}
                                                onChange={handlecveIDFilter}
                                                InputProps={{
                                                    sx: {
                                                        backgroundColor: "#26272B",
                                                        color: "#fff",
                                                        borderRadius: "10px",
                                                        "&.Mui-focused": { backgroundColor: "black" },
                                                        ml: 2,
                                                        mr: 2
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
                                                Severity:
                                            </Typography>
                                            <TextField
                                                variant="outlined"
                                                size="small"
                                                value={severityFilter}
                                                onChange={handleSeverityFilter}
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
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: "row", justifyContent: "flex-end", width: "100%", mt: 2 }}>
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
                                            <TableCell sx={{ color: "#ffffff", textAlign: "center" }}>CVE ID</TableCell>
                                            <TableCell sx={{ color: "#ffffff", textAlign: "center" }}>Severity</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paginatedRows.map((row, index) => (
                                            <TableRow key={`${row.url}-${page}-${index}`}>
                                                <TableCell sx={{ color: "#ffffff", textAlign: "center" }} component="th" scope="row">
                                                    {row?.["CVE ID"]}
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        textAlign: "center",
                                                        color:
                                                            row.Severity === "HIGH"
                                                                ? "red"
                                                                : row.Severity === "MEDIUM"
                                                                    ? "#1464CD"
                                                                    : row.Severity === "LOW"
                                                                        ? "green"
                                                                        : "orange", // Picked orange for "Unknown"
                                                    }}
                                                >
                                                    {row.Severity?.charAt(0).toUpperCase() + row.Severity?.slice(1).toLowerCase()}
                                                </TableCell>
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
        </Box>
    );
}

export default CVE;