import React, { useState, useEffect } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TextField, Button, Typography, MenuItem, FormControl, Select, InputLabel } from '@mui/material';
import { useTheme } from "../contexts/theme/ThemeContext.jsx";
import SendIcon from '@mui/icons-material/Send';
import { useNotification } from "../contexts/NotificationContext.jsx";
import api from "../api/axios_token.jsx";
import Loading from "../Components/Loading.jsx";
import Logo from "../Images/logo3.png";
import Logo_light from "../Images/logo3_light.png";
import Logo_hacker from "../Images/logo_hacker.png";

const HASH_TYPES = [
    "Select Hash Type",
    "raw-md5",
    "crypt",
    "md5crypt",
    "sha256crypt",
    "sha512crypt",
    "bsdicrypt",
    "lm",
    "ntlm",
    "raw-md4",
    "raw-sha1",
    "raw-sha256",
    "raw-sha512",
];

function PasswordCracking() {
    const { showNotification } = useNotification();
    const { theme } = useTheme();
    const [hashType, setHashType] = useState(HASH_TYPES[0]);
    const [hashValue, setHashValue] = useState('');
    const [crackedList, setCrackedList] = useState([]);
    const [isLoading, setIsloading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const LOCAL_STORAGE_KEY = "crackedPasswords";
    useEffect(() => {
        const savedList = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedList) {
            setCrackedList(JSON.parse(savedList));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(crackedList));
    }, [crackedList]);

    const crackHash = async (hashValue, hashType) => {
        try {
            const response = await api.post("/crack_hash", {
                hash_value: hashValue,
                hash_type: hashType,
            });
            console.log("Cracked password response:", response.data.result[0]);
            return response.data.result[0];
        } catch (error) {
            console.error("Error cracking hash:", error);
            throw error;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (hashType === "Select Hash Type") {
            showNotification("Please select a valid hash type.");
            return;
        }
        if (!hashValue.trim()) {
            showNotification("Please enter a hash value.");
            return;
        }

        try {
            setIsloading(true)
            const cracked = await crackHash(hashValue, hashType);

            setCrackedList((prevList) => [
                ...prevList,
                {
                    hashType,
                    hashValue,
                    crackedPassword: cracked,
                    id: Date.now(),
                }
            ]);

            setHashType(HASH_TYPES[0]);
            setHashValue('');
        } catch {
            showNotification("Failed to crack hash. Please try again.");
        } finally {
            setIsloading(false)
        }
    };

    // Pagination handlers
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Slice rows to display on current page
    const paginatedRows = crackedList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);


    return (
        <Box sx={{ color: theme.text }}>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 3,
                p: 2,
                pb: 3,
                borderRadius: "20px",
                backgroundColor: theme.bg_behind_boxes
            }}>
                <Box>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '2.5rem', fontFamily: 'Poppins, sans-serif' }}>
                        Password and Hash Cracking
                    </Typography>
                </Box>
                {
                    isLoading ? (
                        <Loading logo={theme.background === "#333333" ? Logo : theme.background === "#000000" ? Logo_hacker : Logo_light} size={80} animation="zoom" />
                    ) : (
                        <Box>

                            <Box sx={{
                                maxWidth: "800", margin: "40px auto",
                                width: "95%",
                                backgroundColor: theme.box_bg,
                                border: "1px solid " + theme.bg_behind_boxes,
                                color: theme.secondary_text,
                                mt: 2,
                                p: 2,
                                borderRadius: "20px"
                            }}>
                                <form onSubmit={handleSubmit}>
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: { xs: "column", md: "row" },
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        gap: 2,
                                        width: "100%",
                                    }}>
                                        <FormControl
                                            sx={{ minWidth: 180, flexShrink: 0, width: { xs: "100%", md: "auto" } }}
                                            size="small"
                                            variant="outlined"
                                            required
                                        >
                                            <Select
                                                labelId="hash-type-label"
                                                label="Hash Type"
                                                value={hashType}
                                                onChange={(e) => setHashType(e.target.value)}
                                                sx={{
                                                    backgroundColor: theme.filter_input_bg,
                                                    color: theme.text,
                                                    borderRadius: "10px",
                                                    "& .MuiOutlinedInput-notchedOutline": {
                                                        borderColor: theme.filter_input_bg_border,
                                                    },
                                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                                        borderColor: theme.filter_input_bg_border,
                                                    },
                                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                        borderColor: theme.filter_input_bg_border,
                                                    },
                                                }}
                                                MenuProps={{
                                                    PaperProps: {
                                                        sx: {
                                                            backgroundColor: theme.box_bg,
                                                            color: theme.secondary_text,
                                                        }
                                                    }
                                                }}
                                            >
                                                {HASH_TYPES.map((type) => (
                                                    <MenuItem key={type} value={type} disabled={type === "Select Hash Type"}>
                                                        {type}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        <TextField
                                            placeholder="Enter the Hash Value"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={hashValue}
                                            onChange={(e) => setHashValue(e.target.value)}
                                            InputProps={{
                                                sx: {
                                                    backgroundColor: theme.filter_input_bg,
                                                    color: theme.text,
                                                    border: "1px solid " + theme.filter_input_bg_border,
                                                    borderRadius: "10px",
                                                    "&.Mui-focused": { backgroundColor: theme.filter_input_bg_focused },
                                                }
                                            }}
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    "& fieldset": { borderColor: theme.box_bg },
                                                    "&:hover fieldset": { borderColor: theme.box_bg },
                                                    "&.Mui-focused fieldset": { borderColor: theme.box_bg },
                                                },
                                            }}
                                            required
                                        />

                                        <Button
                                            type="submit"
                                            variant="contained"
                                            sx={{
                                                whiteSpace: "nowrap",
                                                fontWeight: "bold",
                                                borderRadius: 2,
                                                paddingX: 1,
                                                paddingY: 1,
                                                backgroundColor: theme.table_head_bg,
                                                color: theme.text_3,
                                                "&:hover": {
                                                    backgroundColor: theme.table_head_bg,
                                                },
                                                width: { xs: "100%", md: "auto" }
                                            }}
                                        >
                                            <SendIcon />
                                        </Button>
                                    </Box>
                                </form>
                            </Box>
                            <TableContainer sx={{ border: `1px solid ${theme.secondary_text}`, borderRadius: "10px", margin: "auto", width: "95%" }}>
                                <Table sx={{ width: "100%" }} aria-label="cracked passwords table">
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: theme.table_head_bg }}>
                                            <TableCell sx={{ color: theme.text_3, textAlign: "center", fontWeight: "bold" }}>Hash Type</TableCell>
                                            <TableCell sx={{ color: theme.text_3, textAlign: "center", fontWeight: "bold" }}>Hash Value</TableCell>
                                            <TableCell sx={{ color: theme.text_3, textAlign: "center", fontWeight: "bold" }}>Cracked Password</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paginatedRows.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={3} sx={{ color: theme.text, textAlign: "center" }}>
                                                    No cracked passwords yet.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            paginatedRows.map(({ id, hashType, hashValue, crackedPassword }) => (
                                                <TableRow key={id}>
                                                    <TableCell sx={{ textAlign: "center", color: theme.secondary_text, backgroundColor: theme.bg_table_cell }}>
                                                        {hashType}
                                                    </TableCell>
                                                    <TableCell sx={{ textAlign: "center", color: theme.secondary_text, backgroundColor: theme.bg_table_cell, wordBreak: "break-all" }}>
                                                        {hashValue}
                                                    </TableCell>
                                                    <TableCell sx={{ textAlign: "center", color: theme.secondary_text, backgroundColor: theme.bg_table_cell }}>
                                                        {crackedPassword}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>

                                <TablePagination
                                    sx={{ color: theme.text }}
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={crackedList.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </TableContainer>
                        </Box>
                    )}
            </Box>
        </Box>
    );
}

export default PasswordCracking;
