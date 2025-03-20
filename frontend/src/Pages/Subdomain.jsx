import React, { useState, useMemo, useEffect } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TextField, Button, Typography } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment } from '@mui/material';
import Logo from "../Images/logo3.png";
import Logo_light from "../Images/logo3_light.png";
import Logo_hacker from "../Images/logo_hacker.png";
import Loading from "../Components/Loading.jsx";
import { useParams } from "react-router-dom";
import { useNotification } from "../contexts/NotificationContext.jsx";
import { CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { fetchSubdomains, fetchSubdomainStatus } from "../features/subdomainSlice";
import { useTheme } from "../contexts/theme/ThemeContext.jsx";

function Subdomain() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const { domain } = useParams();
    const { showNotification } = useNotification();
    const { data,loading,error,loadingRow} = useSelector(state => state.subdomains)
    const dispatch = useDispatch();
    const { theme } = useTheme();

    const subdomains = data[domain]?.data || [];
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

    // Filter rows based on search query (memoized for optimization)
    const filteredRows = useMemo(() => {
        return subdomains.filter((row) => {
            const url = row.url?.toLowerCase() || ""; // Ensure row.url is defined
            const status = row.status?.toString() || "--"; // Ensure row.status is defined

            return url.includes(searchQuery.toLowerCase()) || status.includes(searchQuery);
        });
    }, [searchQuery, subdomains]);


    // Paginate filtered rows (memoized for optimization)
    const paginatedRows = useMemo(() => {
        if (!Array.isArray(filteredRows)) return [];
        const startIndex = page * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return filteredRows.slice(startIndex, endIndex);
    }, [page, rowsPerPage, filteredRows]);

    useEffect(() => {

        if (!data[domain] && !isLoading) {
            console.log("Hello from subdomians")
            dispatch(fetchSubdomains(domain));
        }

    }, [ domain ]);

    const handleRowClick = (url) => {
        console.log(`Link clicked for URL: ${url}`);
        dispatch(fetchSubdomainStatus({ domain, url }));
    };

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
                        Subdomain Details
                    </Typography>
                </Box>
                {
                    isLoading ? (
                        <Loading logo={theme.background === "#333333" ? Logo : theme.background === "#000000" ? Logo_hacker : Logo_light} size={80} animation="zoom" />
                    ) : (
                        <Paper sx={{ backgroundColor: theme.bg_behind_boxes, border: "1px solid " + theme.bg_behind_boxes , color: theme.secondary_text, mt: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: theme.box_bg, border: "1px solid " + theme.box_bg_border, borderRadius: "20px" }}>
                                <Typography variant="h6">
                                    Subdomain Count - {filteredRows.length}
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
                                    {/* <Box sx={{ display: 'flex', flexDirection: 'row', mt: 3 }}>
                                <Typography variant="subtitle1">
                                    Upload your File:
                                </Typography>
                                <Button variant="contained" color="default" startIcon={<FileUploadIcon />} sx={{ ml: 3 }} />
                            </Box> */}
                                </Box>
                            </Box>

                            <TableContainer sx={{ mt: 5, border: "1px solid " + theme.secondary_text, borderRadius: "10px" }}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: theme.table_head_bg, fontWeight: "bold" }}>
                                            <TableCell sx={{ color: theme.text_3 , borderBottom: "1px solid " + theme.secondary_text}}>URL</TableCell>
                                            <TableCell sx={{ color: theme.text_3 , borderBottom: "1px solid " + theme.secondary_text}}>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paginatedRows.map((row, index) => (
                                            <TableRow key={`${row.url}-${page}-${index}`}>
                                                <TableCell sx={{ color: theme.secondary_text, backgroundColor: theme.bg_table_cell, borderBottom: "1px solid " + theme.secondary_text }} component="th" scope="row">
                                                    <a
                                                        onClick={(e) => {
                                                            e.preventDefault(); // Prevent default link behavior
                                                            handleRowClick(row.url); // Call the function and pass row.url
                                                        }}
                                                        style={{ color: theme.secondary_text, textDecoration: "underline", cursor: "pointer" }}
                                                    >
                                                        {row.url}
                                                    </a>
                                                </TableCell>
                                                <TableCell sx={{ color: theme.secondary_text, backgroundColor: theme.bg_table_cell, borderBottom: "1px solid " + theme.secondary_text }}>
                                                    {loadingRow[domain] === row.url ? (
                                                        <CircularProgress size={16} sx={{ color: theme.secondary_text }} />
                                                    ) : (
                                                        row.status
                                                    )}
                                                </TableCell>
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

export default Subdomain;