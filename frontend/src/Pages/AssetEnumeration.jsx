import React, { useState, useMemo, useEffect } from "react";
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment } from '@mui/material';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TextField, Button, Typography, MenuItem, FormControl, Select, InputLabel } from '@mui/material';
import Logo from "../Images/logo3.png";
import Loading from "../Components/Loading.jsx";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchIPandPorts } from "../features/ipandportsSlice.js";
import { useNotification } from "../contexts/NotificationContext.jsx";
import { useTheme } from "../contexts/theme/ThemeContext.jsx";

function createData(port, server) {
    return { port, server };
}

function AssetEnumeration() {
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [ServerFilter, setServerFilter] = useState('');
    const [portFilter, setPortFilter] = useState('');
    const { domain } = useParams();
    const { showNotification } = useNotification();
    const { ipandports_, loading, error } = useSelector(state => state.ipandports)
    const { data } = useSelector(state => state.targetInfo)
    const dispatch = useDispatch();
    const { theme } = useTheme();

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

    const handleServerFilterChange = (event) => {
        setServerFilter(event.target.value);
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
                row.server.toString().includes(searchQuery);

            const matchesServerFilter = ServerFilter ? row.server.includes(ServerFilter) : true;
            const matchesPortFilter = portFilter ? row.port.includes(portFilter) : true;

            return matchesSearchQuery && matchesPortFilter && matchesServerFilter;
        });
    }, [searchQuery, portFilter, ServerFilter, rows]);


    // Paginate filtered rows (memoized for optimization)
    const paginatedRows = useMemo(() => {
        const startIndex = page * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return filteredRows.slice(startIndex, endIndex);
    }, [page, rowsPerPage, filteredRows]);

    useEffect(() => {
        if (!ipandports_[domain] && !isLoading) {
            console.log("Hello from Ip&Ports");
            dispatch(fetchIPandPorts(domain));
        }
    }, [domain, isLoading]);

    useEffect(() => {
        if (ipandports_[domain]) {
            const newRows = ipandports_[domain]["data"]?.map((data_) => {
                const port = data_.Port?.split('/')?.[0] || "--"; // Fallback if port is undefined
                const server = data_.Server || "--";

                return createData(port, server);
            });

            setRows(newRows);
        }
    }, [ipandports_, domain]);

    useEffect(() => {
        if (isError) {
            showNotification("Invalid Domain Name: " + isError);
        }
    }, [isError, showNotification]);

    return (
        <Box sx={{ color: theme.text }}>
            <Box sx={{ display: "flex", flexDirection: "column", p:2, borderRadius:"20px", backgroundColor: theme.bg_behind_boxes }} >
                <Box>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '2.5rem', fontFamily: 'Poppins, sans-serif' }}>
                        Asset Enumeration
                    </Typography>
                </Box>
                {
                    isLoading ? (
                        <Loading logo={Logo} size={80} animation="zoom" />
                    ) : (
                        <Paper sx={{ backgroundColor: theme.bg_behind_boxes, border: "1px solid " + theme.bg_behind_boxes , color: theme.secondary_text, mt: 2 }}>
                            <Box sx={{ display: 'flex', flexDirection: "column", alignItems: 'center', padding: '16px', backgroundColor: theme.box_bg, border: "1px solid " + theme.box_bg_border, borderRadius: "20px" }}>
                                <Box sx={{ display: 'flex', flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", width: "100%" }}>
                                    <Typography variant="h6">
                                        Apply Filter:
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: "row" }}>
                                        <Box sx={{ display: 'flex', flexDirection: "row" }}>
                                            <Typography variant="h6">
                                                Server:
                                            </Typography>
                                            <TextField
                                                variant="outlined"
                                                size="small"
                                                value={ServerFilter}
                                                onChange={handleServerFilterChange}
                                                InputProps={{
                                                    sx: {
                                                        backgroundColor: theme.filter_input_bg,
                                                        color: theme.text,
                                                        border: "1px solid " + theme.filter_input_bg_border,
                                                        borderRadius: "10px",
                                                        "&.Mui-focused": { backgroundColor: theme.filter_input_bg_focused },
                                                        ml: 2,
                                                        mr: 2
                                                    },
                                                }}
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        "& fieldset": { borderColor: theme.box_bg },
                                                        "&:hover fieldset": { borderColor: theme.box_bg },
                                                        "&.Mui-focused fieldset": { borderColor: theme.box_bg },
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
                                                        backgroundColor: theme.filter_input_bg,
                                                        color: theme.text,
                                                        border: "1px solid " + theme.filter_input_bg_border,
                                                        borderRadius: "10px",
                                                        "&.Mui-focused": { backgroundColor: theme.filter_input_bg_focused },
                                                        ml: 2
                                                    },
                                                }}
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        "& fieldset": { borderColor: theme.box_bg },
                                                        "&:hover fieldset": { borderColor: theme.box_bg },
                                                        "&.Mui-focused fieldset": { borderColor: theme.box_bg },
                                                    },
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: "row", justifyContent: "space-between", width: "100%", mt: 2 }}>
                                    <Typography variant="h6">
                                        Assets Discovered Count - {filteredRows.length}
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
                                                    backgroundColor: theme.filter_input_bg,
                                                    color: theme.text,
                                                    border: "1px solid " + theme.filter_input_bg_border,
                                                    borderRadius: "10px",
                                                    "&.Mui-focused": { backgroundColor: theme.filter_input_bg_focused },
                                                },
                                                startAdornment: (<InputAdornment position="start"> <SearchIcon sx={{ color: theme.text }} /> </InputAdornment>),
                                            }}
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    "& fieldset": { borderColor: theme.box_bg },
                                                    "&:hover fieldset": { borderColor: theme.box_bg },
                                                    "&.Mui-focused fieldset": { borderColor: theme.box_bg },
                                                },
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>

                            <TableContainer sx={{ mt: 5, border: "1px solid " + theme.secondary_text, borderRadius: "10px" }}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: theme.table_head_bg, fontWeight: "bold" }}>
                                            <TableCell sx={{ color: theme.text_3 , borderBottom: "1px solid " + theme.secondary_text, textAlign: "center" }}>Ports</TableCell>
                                            <TableCell sx={{ color: theme.text_3 , borderBottom: "1px solid " + theme.secondary_text, textAlign: "center" }}>Server</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paginatedRows.map((row, index) => (
                                            <TableRow key={`${row.url}-${page}-${index}`}>
                                                <TableCell sx={{ color: theme.secondary_text, backgroundColor: theme.bg_table_cell, borderBottom: "1px solid " + theme.secondary_text, textAlign: "center" }}>{row.port}</TableCell>
                                                <TableCell sx={{ color: theme.secondary_text, backgroundColor: theme.bg_table_cell, borderBottom: "1px solid " + theme.secondary_text, textAlign: "center" }}>{row.server}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <TablePagination
                                sx={{ color: theme.text }}
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

export default AssetEnumeration;