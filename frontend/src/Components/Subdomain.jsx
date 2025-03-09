import React, { useState, useMemo, useEffect } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TextField, Button, Typography } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment } from '@mui/material';
import Footer from "./footer";
import api from "../api/axios_token.jsx";
import Logo from "../Images/logo3.png";
import Loading from "../Components/Loading.jsx";
import { useParams } from "react-router-dom";
import { useSubdomain } from "../contexts/SubdomainContext";
import { useNotification } from "../contexts/NotificationContext.jsx";
import { CircularProgress } from '@mui/material';

function createData(url, status) {
    return { url, status };
}

function Subdomain() {
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const { domain } = useParams();
    const { subdomains, addSubdomains, setSubdomains } = useSubdomain();
    const [loading, setLoading] = useState(true);
    const [loadingRow, setLoadingRow] = useState(null);
    const { showNotification } = useNotification();

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
        return rows.filter((row) => {
            const url = row.url?.toLowerCase() || ""; // Ensure row.url is defined
            const status = row.status?.toString() || "--"; // Ensure row.status is defined

            return url.includes(searchQuery.toLowerCase()) || status.includes(searchQuery);
        });
    }, [searchQuery, rows]);


    // Paginate filtered rows (memoized for optimization)
    const paginatedRows = useMemo(() => {
        const startIndex = page * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return filteredRows.slice(startIndex, endIndex);
    }, [page, rowsPerPage, filteredRows]);

    useEffect(() => {
        const fetchSubdomains = async () => {
            try {
                console.log("Hello from subdomain")
                const response = await api.get(`/new_subdomain?domain=${domain}`);
                const newRows = response.data?.["subdomains"]?.map((data) => createData(data, "--"));
                setRows(newRows);

                addSubdomains(domain, newRows);
            } catch (err) {
                console.error(err.message || "Something went wrong");
                showNotification("Error Occured in Subdomain Enumeration,Error is " + err.message)
            } finally {
                setLoading(false);
            }
        };

        if (!subdomains[domain]) {
            fetchSubdomains();
            setLoading(true);
        } else {
            setRows(subdomains[domain]);
            setLoading(false);
        }

    }, [domain, subdomains, addSubdomains]);

    const handleRowClick = (url) => {
        console.log(`Link clicked for URL: ${url}`);

        const checkStatus = async () => {
            try {
                setLoadingRow(url);
                const response = await api.get(`/get_status?domain=${url}`);
                const newStatus = response?.data?.status;
                setLoadingRow(null); 

                setSubdomains((prevSubdomains) => {
                    const updatedSubdomains = { ...prevSubdomains };
                    if (updatedSubdomains[domain]) {
                        updatedSubdomains[domain] = updatedSubdomains[domain].map((subdomain) =>
                            subdomain.url === url ? { ...subdomain, status: newStatus } : subdomain
                        );
                    }
                    return updatedSubdomains;
                });

                showNotification("Status Checked")
            } catch (err) {
                setLoadingRow(null); 
                console.error(err.message || "Something went wrong");
                showNotification("Error Occured in Subdomain Enumeration,Error is " + err.message)
            }
        }

        checkStatus();
    };


    return (
        <Box sx={{ color: "#fff" }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Box>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '2.5rem', fontFamily: 'Poppins, sans-serif' }}>
                        Subdomain Details
                    </Typography>
                </Box>
                {
                    loading ? (
                        <Loading logo={Logo} size={80} animation="zoom" />
                    ) : (
                        <Paper sx={{ backgroundColor: "#333333", border: "none", color: "#ffffff", mt: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: "#49494C", border: "1px solid #49494C", borderRadius: "20px" }}>
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
                                    {/* <Box sx={{ display: 'flex', flexDirection: 'row', mt: 3 }}>
                                <Typography variant="subtitle1">
                                    Upload your File:
                                </Typography>
                                <Button variant="contained" color="default" startIcon={<FileUploadIcon />} sx={{ ml: 3 }} />
                            </Box> */}
                                </Box>
                            </Box>

                            <TableContainer sx={{ mt: 5, border: "1px solid #ffffff", borderRadius: "10px" }}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: "#444444", fontWeight: "bold" }}>
                                            <TableCell sx={{ color: "#ffffff" }}>URL</TableCell>
                                            <TableCell sx={{ color: "#ffffff" }}>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paginatedRows.map((row, index) => (
                                            <TableRow key={`${row.url}-${page}-${index}`}>
                                                <TableCell sx={{ color: "#ffffff" }} component="th" scope="row">
                                                    <a
                                                        onClick={(e) => {
                                                            e.preventDefault(); // Prevent default link behavior
                                                            handleRowClick(row.url); // Call the function and pass row.url
                                                        }}
                                                        style={{ color: "#ffffff", textDecoration: "underline", cursor: "pointer" }}
                                                    >
                                                        {row.url}
                                                    </a>
                                                </TableCell>
                                                <TableCell sx={{ color: "#ffffff" }}>
                                                    {loadingRow === row.url ? (
                                                        <CircularProgress size={16} sx={{ color: "#ffffff" }} />
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

export default Subdomain;