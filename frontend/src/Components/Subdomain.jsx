import React, { useState, useMemo, useEffect } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TextField, Button, Typography } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment } from '@mui/material';
import Footer from "./footer";
import api from "../api/axois.jsx";
import Logo from "../Images/logo3.png";
import Loading from "../Components/Loading.jsx";
import { useParams } from "react-router-dom";
import { useSubdomain } from "../contexts/SubdomainContext";

function createData(url, status) {
    return { url, status };
}

function Subdomain() {
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const { domain } = useParams();
    const { subdomains, addSubdomains } = useSubdomain();
    const [loading, setLoading] = useState(true);

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
        return rows.filter((row) =>
            row.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.status.toString().includes(searchQuery)
        );
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
                const response = await api.get(`/get_subdomains?domain=${domain}`);
                const newRows = response.data?.["Sub-domains"]?.map((data) => createData(data.subdomain, data.status));
                setRows(newRows);

                addSubdomains(domain, newRows);
            } catch (err) {
                console.error(err.message || "Something went wrong");
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
                                                    {row.url}
                                                </TableCell>
                                                <TableCell sx={{ color: "#ffffff" }}>{row.status}</TableCell>
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

export default Subdomain;